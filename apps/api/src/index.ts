import http from "node:http";
import { URL } from "node:url";
import { supabase } from "./db/index.js";

const port = Number(process.env.PORT ?? 5174);
const exchangeRateKrw = 1380;

type QueryLog = {
  query_log_id: string;
  product_id: number;
  input_value: string;
  option_json: {
    asin?: string;
    slug?: string;
    title?: string;
    brand?: string;
    category?: string;
    option?: string;
    seller?: string;
    originCountry?: string;
    unitPriceUsd?: number;
    shippingUsd?: number;
  } | null;
};

type QueryResult = {
  query_result_id: number;
  product_id: number;
  hs_mapping_id: number;
  taxcalc_id: number;
  regulation_id: number;
  combtax_risk_id: number;
  result_status: string;
};

type HsMapping = {
  mapping_id: number;
  hs_id: number;
  predicted_hs: string;
  confidence_score: number;
};

type TaxCalculation = {
  calc_id: number;
  cif_amount: number;
  duty_amount: number;
  vat_amount: number;
  total_tax: number;
  total_cost: number;
};

type Regulation = {
  risk_id: number;
  kc_required: boolean;
  risk_level: string;
  risk_summary: string;
};

type CombinedTaxRisk = {
  combined_id: number;
  risk_level: string;
  warning_msg: string;
};

type Reason = {
  target_type: string;
  target_id: number;
  explanation: string;
};

type AdminUser = {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
  app_metadata?: {
    role?: string;
    is_admin?: boolean;
  };
  user_metadata?: {
    name?: string;
    role?: string;
    is_admin?: boolean;
  };
};

function sendJson(response: http.ServerResponse, statusCode: number, payload: unknown) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request: http.IncomingMessage) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Request body is too large."));
      }
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body) as Record<string, unknown>);
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    request.on("error", reject);
  });
}

function readStringField(body: Record<string, unknown>, field: string) {
  const value = body[field];
  return typeof value === "string" ? value.trim() : "";
}

function getBearerToken(request: http.IncomingMessage) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length);
}

function isAdminUser(user: AdminUser | null) {
  if (!user) return false;

  return (
    user.app_metadata?.role === "admin" ||
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.role === "admin" ||
    user.user_metadata?.is_admin === true
  );
}

async function requireAdmin(request: http.IncomingMessage, response: http.ServerResponse) {
  const token = getBearerToken(request);

  if (!token) {
    sendJson(response, 401, { error: "Admin authentication is required." });
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    sendJson(response, 401, { error: "Invalid admin session." });
    return null;
  }

  if (!isAdminUser(data.user as AdminUser)) {
    sendJson(response, 403, { error: "Admin permission is required." });
    return null;
  }

  return data.user;
}

async function countRows(table: string) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });

  if (error) {
    return { table, count: 0, error: error.message };
  }

  return { table, count: count ?? 0 };
}

async function listAllAuthUsers() {
  const users: AdminUser[] = [];
  let page = 1;

  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });

    if (error) {
      throw error;
    }

    users.push(...(data.users as AdminUser[]));

    if (data.users.length < 100) {
      break;
    }

    page += 1;
  }

  return users;
}

function groupCount<T extends string | undefined | null>(values: T[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    const key = value || "UNKNOWN";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

async function handleAdminOverview(request: http.IncomingMessage, response: http.ServerResponse) {
  const adminUser = await requireAdmin(request, response);

  if (!adminUser) {
    return;
  }

  const [
    authUsers,
    tableCounts,
    recentQueriesResult,
    queryResultsResult,
    regulationsResult,
    newsResult,
    reasonsResult,
  ] = await Promise.all([
    listAllAuthUsers(),
    Promise.all([
      countRows("svc_user"),
      countRows("svc_session"),
      countRows("svc_query_log"),
      countRows("svc_query_result"),
      countRows("res_hs_mapin_fin"),
      countRows("res_regulation_std"),
      countRows("res_taxcalc_std"),
      countRows("res_combtax_risk"),
      countRows("svc_news_map"),
      countRows("reason_res"),
      countRows("svc_result_view_log"),
    ]),
    supabase
      .from("svc_query_log")
      .select("query_log_id, product_id, input_value, request_status, requested_at, option_json")
      .order("requested_at", { ascending: false })
      .limit(10),
    supabase
      .from("svc_query_result")
      .select("query_result_id, product_id, result_status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("res_regulation_std")
      .select("risk_id, product_id, risk_level, kc_required, risk_summary, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("svc_news_map")
      .select("news_map_id, hs_id, risk_type, title, source_nm, is_active, published_at")
      .order("published_at", { ascending: false })
      .limit(10),
    supabase
      .from("reason_res")
      .select("reason_id, target_type, target_id, reason_type, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const tableCountsByName = Object.fromEntries(
    tableCounts.map((item) => [item.table, { count: item.count, error: "error" in item ? item.error : null }]),
  );

  const resultRows = queryResultsResult.data ?? [];
  const regulationRows = regulationsResult.data ?? [];
  const newsRows = newsResult.data ?? [];

  sendJson(response, 200, {
    data: {
      admin: {
        id: adminUser.id,
        email: adminUser.email,
      },
      stats: {
        authUsers: authUsers.length,
        admins: authUsers.filter((user) => isAdminUser(user)).length,
        activeNews: newsRows.filter((item) => item.is_active).length,
        tableCounts: tableCountsByName,
        resultStatus: groupCount(resultRows.map((item) => item.result_status)),
        riskLevels: groupCount(regulationRows.map((item) => item.risk_level)),
        kcRequired: regulationRows.filter((item) => item.kc_required).length,
      },
      users: authUsers
        .slice()
        .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")))
        .slice(0, 12)
        .map((user) => ({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name ?? "",
          role: user.app_metadata?.role ?? user.user_metadata?.role ?? "user",
          isAdmin: isAdminUser(user),
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at,
        })),
      queries: (recentQueriesResult.data ?? []).map((query) => ({
        id: query.query_log_id,
        productId: query.product_id,
        status: query.request_status,
        requestedAt: query.requested_at,
        inputValue: query.input_value,
        productTitle: query.option_json?.title ?? query.option_json?.slug ?? "Unknown product",
        asin: query.option_json?.asin ?? "",
      })),
      results: resultRows,
      regulations: regulationRows,
      news: newsRows,
      reasons: reasonsResult.data ?? [],
    },
  });
}

async function handleSignup(request: http.IncomingMessage, response: http.ServerResponse) {
  const body = await readJsonBody(request);
  const name = readStringField(body, "name");
  const email = readStringField(body, "email");
  const password = readStringField(body, "password");
  const agreements = body.agreements && typeof body.agreements === "object" ? body.agreements : {};

  if (!name || !email || !password) {
    sendJson(response, 400, { error: "Name, email, and password are required." });
    return;
  }

  // TODO: When BuySafe is ready for public launch, switch back to email verification.
  // Use supabase.auth.signUp(...) and require users to confirm their email before login.
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      agreements,
    },
  });

  if (error) {
    sendJson(response, 400, { error: error.message, code: error.code });
    return;
  }

  sendJson(response, 200, { data });
}

async function handleLogin(request: http.IncomingMessage, response: http.ServerResponse) {
  const body = await readJsonBody(request);
  const email = readStringField(body, "email");
  const password = readStringField(body, "password");

  if (!email || !password) {
    sendJson(response, 400, { error: "Email and password are required." });
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    sendJson(response, 401, { error: error.message, code: error.code });
    return;
  }

  sendJson(response, 200, { data });
}

function extractAsin(value: string | null) {
  if (!value) return null;

  const decodedValue = decodeURIComponent(value);
  const match = decodedValue.match(/(?:\/dp\/|\/gp\/product\/|asin=)([A-Z0-9]{10})/i);

  if (match) {
    return match[1].toUpperCase();
  }

  const bareAsin = decodedValue.match(/^[A-Z0-9]{10}$/i);
  return bareAsin ? bareAsin[0].toUpperCase() : null;
}

function riskLevelToUiLevel(level: string) {
  if (level === "LOW") return "safe";
  if (level === "HIGH") return "warning";
  return "notice";
}

function hsName(hsCode: string) {
  const names: Record<string, string> = {
    "8518220000": "Multiple loudspeakers mounted in the same enclosure",
    "8518309000": "Headphones and earphones",
    "9102120000": "Wrist watches, electrically operated",
    "8471300000": "Portable automatic data processing machines",
    "2106909099": "Food preparations not elsewhere specified",
    "6107110000": "Men's or boys' underpants and briefs of cotton, knitted or crocheted",
  };

  return names[hsCode] ?? "HS classification result";
}

async function single<T>(table: string, select: string, column: string, value: string | number) {
  const { data, error } = await supabase.from(table).select(select).eq(column, value).maybeSingle();

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  return data as T | null;
}

async function list<T>(table: string, select: string, column: string, values: Array<string | number>) {
  const { data, error } = await supabase.from(table).select(select).in(column, values);

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  return (data ?? []) as T[];
}

async function lookupProduct(asin: string) {
  const queryLog = await single<QueryLog>(
    "svc_query_log",
    "query_log_id, product_id, input_value, option_json",
    "option_json->>asin",
    asin,
  );

  if (!queryLog) {
    return null;
  }

  const queryResult = await single<QueryResult>(
    "svc_query_result",
    "query_result_id, product_id, hs_mapping_id, taxcalc_id, regulation_id, combtax_risk_id, result_status",
    "query_log_id",
    queryLog.query_log_id,
  );

  if (!queryResult) {
    return null;
  }

  const [hsMapping, taxCalculation, regulation, combinedTaxRisk] = await Promise.all([
    single<HsMapping>(
      "res_hs_mapin_fin",
      "mapping_id, hs_id, predicted_hs, confidence_score",
      "mapping_id",
      queryResult.hs_mapping_id,
    ),
    single<TaxCalculation>(
      "res_taxcalc_std",
      "calc_id, cif_amount, duty_amount, vat_amount, total_tax, total_cost",
      "calc_id",
      queryResult.taxcalc_id,
    ),
    single<Regulation>(
      "res_regulation_std",
      "risk_id, kc_required, risk_level, risk_summary",
      "risk_id",
      queryResult.regulation_id,
    ),
    single<CombinedTaxRisk>(
      "res_combtax_risk",
      "combined_id, risk_level, warning_msg",
      "combined_id",
      queryResult.combtax_risk_id,
    ),
  ]);

  if (!hsMapping || !taxCalculation || !regulation || !combinedTaxRisk) {
    return null;
  }

  const reasons = await list<Reason>(
    "reason_res",
    "target_type, target_id, explanation",
    "target_id",
    [hsMapping.mapping_id, taxCalculation.calc_id, regulation.risk_id, combinedTaxRisk.combined_id],
  );

  const hsReason = reasons.find((reason) => reason.target_type === "HS")?.explanation;
  const productSnapshot = queryLog.option_json ?? {};
  const unitPriceUsd = Number(productSnapshot.unitPriceUsd ?? 0);
  const shippingUsd = Number(productSnapshot.shippingUsd ?? 0);
  const cifAmount = Number(taxCalculation.cif_amount);

  return {
    asin,
    slug: productSnapshot.slug ?? asin,
    source_url: queryLog.input_value,
    product: {
      title: productSnapshot.title ?? "Unknown product",
      brand: productSnapshot.brand ?? "Unknown brand",
      category: productSnapshot.category ?? "Imported product",
      option: productSnapshot.option ?? "Default",
      seller: productSnapshot.seller ?? "Unknown seller",
      originCountry: productSnapshot.originCountry ?? "Unknown",
      quantity: 1,
      unitPriceUsd,
      shippingUsd,
      exchangeRateKrw,
    },
    classification: {
      hsCode: hsMapping.predicted_hs,
      hsName: hsName(hsMapping.predicted_hs),
      confidence: Number(hsMapping.confidence_score) / 100,
      reason: hsReason ?? "HS mapping was loaded from the result tables.",
    },
    calculation: {
      customsValueKrw: cifAmount,
      dutyRate: cifAmount > 0 ? Number(taxCalculation.duty_amount) / cifAmount : 0,
      dutyKrw: Number(taxCalculation.duty_amount),
      vatRate: 0.1,
      vatKrw: Number(taxCalculation.vat_amount),
      totalTaxKrw: Number(taxCalculation.total_tax),
    },
    risks: [
      {
        label: regulation.kc_required ? "KC / import requirement" : "Import requirement",
        level: riskLevelToUiLevel(regulation.risk_level),
        detail: regulation.risk_summary,
      },
      {
        label: "Combined tax risk",
        level: riskLevelToUiLevel(combinedTaxRisk.risk_level),
        detail: combinedTaxRisk.warning_msg,
      },
    ],
  };
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (request.method === "POST" && requestUrl.pathname === "/api/auth/signup") {
    try {
      await handleSignup(request, response);
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : "Unknown server error",
      });
    }
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/auth/login") {
    try {
      await handleLogin(request, response);
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : "Unknown server error",
      });
    }
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/api/admin/overview") {
    try {
      await handleAdminOverview(request, response);
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : "Unknown server error",
      });
    }
    return;
  }

  if (request.method !== "GET" || requestUrl.pathname !== "/api/product-lookup") {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  const asin = extractAsin(requestUrl.searchParams.get("url") ?? requestUrl.searchParams.get("asin"));

  if (!asin) {
    sendJson(response, 400, { error: "Amazon URL or ASIN is required." });
    return;
  }

  try {
    const data = await lookupProduct(asin);

    if (!data) {
      sendJson(response, 404, { error: `No test lookup data found for ASIN ${asin}.`, asin });
      return;
    }

    sendJson(response, 200, { data });
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
});

server.listen(port, () => {
  console.log(`BuySafe API listening on http://localhost:${port}`);
});
