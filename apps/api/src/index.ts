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

function sendJson(response: http.ServerResponse, statusCode: number, payload: unknown) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
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
