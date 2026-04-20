import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5174";

const newsByHsPrefix = {
  "210690": [
    ["식품", "건강보조식품 직구 수량 제한 및 성분 확인 안내", "Food Import Daily"],
    ["성분 검토", "Omega-3 등 어유 제품 수입 시 성분 검토 필요", "Food Import Daily"],
    ["개인통관", "보충제 반복 구매 시 개인사용 인정 범위 확인 필요", "Customs Insight"],
  ],
  "610711": [
    ["의류", "의류 직구 시 소재별 HS 분류 참고사항", "Trade Daily"],
    ["면세", "미국발 $200 이하 개인사용 의류 목록통관 안내", "Customs Insight"],
    ["합산과세", "동일 수취인 반복 주문 시 합산과세 확인 필요", "Import News"],
  ],
  "847130": [
    ["전자기기", "태블릿 PC 개인사용 수입 시 확인 항목", "Market Brief"],
    ["배터리", "리튬 배터리 내장 전자기기 배송 기준 안내", "Trade Watch"],
    ["KC", "Wi-Fi 탑재 기기 KC 면제 조건 확인 필요", "Import News"],
  ],
  "851822": [
    ["무선", "Bluetooth 스피커 직구 시 전파 인증 확인 필요", "Import News"],
    ["오디오", "스피커류 HS 분류와 개인사용 통관 참고사항", "Customs Insight"],
    ["합산과세", "동일일 입항 전자기기 합산과세 주의", "Trade Daily"],
  ],
  "851830": [
    ["오디오", "헤드폰·이어폰류 통관 분류 참고사항", "Customs Insight"],
    ["개인사용", "단일 헤드폰 주문의 개인사용 인정 범위 안내", "Import News"],
    ["FTA", "미국발 전자제품 직구 세금 계산 참고", "Trade Daily"],
  ],
  "910212": [
    ["배터리", "스마트워치 내장 배터리 제품 운송 확인 필요", "Trade Watch"],
    ["무선", "Bluetooth/GPS 웨어러블 기기 인증 검토 안내", "Import News"],
    ["합산과세", "전자기기 반복 구매 시 합산과세 가능성", "Customs Insight"],
  ],
};

const riskCatalog = [
  {
    key: "import",
    title: "수입 제한 여부",
    safeDetail: "특별한 수입 제한이 확인되지 않았습니다.",
    match: (label) => label.includes("import"),
  },
  {
    key: "kc",
    title: "KC 인증 필요 여부",
    safeDetail: "현재 테스트 데이터 기준으로 KC 필수 위험이 낮습니다.",
    match: (label) => label.includes("kc"),
  },
  {
    key: "restricted",
    title: "통관 불가 가능성",
    safeDetail: "통관 불가로 볼 만한 제한 항목이 확인되지 않았습니다.",
    match: (label, detail) => label.includes("restricted") || detail.includes("제한"),
  },
  {
    key: "combined",
    title: "합산과세 주의",
    safeDetail: "동일 수취인 기준 합산과세 위험이 낮습니다.",
    match: (label) => label.includes("combined"),
  },
  {
    key: "battery",
    title: "배터리/항공 운송 주의",
    safeDetail: "배터리 또는 항공 운송 관련 특이 위험이 확인되지 않았습니다.",
    match: (label, detail) => detail.includes("배터리") || detail.toLowerCase().includes("battery"),
  },
  {
    key: "food",
    title: "식품/건강기능식품 주의",
    safeDetail: "식품 또는 건강기능식품 관련 제한 위험이 낮습니다.",
    match: (label, detail) =>
      detail.includes("건강") ||
      detail.includes("식품") ||
      detail.toLowerCase().includes("supplement") ||
      detail.toLowerCase().includes("food"),
  },
];

const riskRank = {
  warning: 0,
  notice: 1,
  safe: 2,
};

const formatUsd = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value ?? 0));

const formatKrw = (value) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(Math.round(Number(value ?? 0)));

function calculateTotals(product, calculation, quantity) {
  const unitPriceUsd = Number(product.unitPriceUsd ?? 0);
  const shippingUsd = Number(product.shippingUsd ?? 0);
  const exchangeRateKrw = Number(product.exchangeRateKrw ?? 1380);
  const dutyRate = Number(calculation.dutyRate ?? 0);
  const vatRate = Number(calculation.vatRate ?? 0.1);
  const customsValueKrw = Math.round((unitPriceUsd * quantity + shippingUsd) * exchangeRateKrw);
  const isDutyFree = Number(calculation.totalTaxKrw ?? 0) === 0 && quantity === 1;
  const dutyKrw = isDutyFree ? 0 : Math.round(customsValueKrw * dutyRate);
  const vatKrw = isDutyFree ? 0 : Math.round((customsValueKrw + dutyKrw) * vatRate);

  return {
    customsValueKrw,
    dutyRate,
    dutyKrw,
    vatRate,
    vatKrw,
    totalTaxKrw: dutyKrw + vatKrw,
    totalCostKrw: customsValueKrw + dutyKrw + vatKrw,
  };
}

const Result = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  const [lookup, setLookup] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPriceUsd, setUnitPriceUsd] = useState(0);
  const [shippingUsd, setShippingUsd] = useState(0);

  useEffect(() => {
    if (!url) {
      setStatus("missing-url");
      return;
    }

    const controller = new AbortController();

    async function loadResult() {
      setStatus("loading");
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/product-lookup?url=${encodeURIComponent(url)}`,
          { signal: controller.signal },
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "조회 결과를 불러오지 못했습니다.");
        }

        setLookup(payload.data);
        setQuantity(Number(payload.data.product?.quantity ?? 1));
        setUnitPriceUsd(Number(payload.data.product?.unitPriceUsd ?? 0));
        setShippingUsd(Number(payload.data.product?.shippingUsd ?? 0));
        setStatus("ready");
      } catch (fetchError) {
        if (fetchError.name === "AbortError") return;
        setError(fetchError.message);
        setStatus("error");
      }
    }

    loadResult();

    return () => controller.abort();
  }, [url]);

  const product = lookup?.product;
  const classification = lookup?.classification;
  const calculation = lookup?.calculation;
  const risks = useMemo(() => lookup?.risks ?? [], [lookup]);
  const displayRisks = useMemo(() => {
    return riskCatalog.map((riskType) => {
      const matchedRisk = risks.find((risk) =>
        riskType.match(
          String(risk.label ?? "").toLowerCase(),
          String(risk.detail ?? ""),
        ),
      );

      return {
        key: riskType.key,
        title: riskType.title,
        level: matchedRisk?.level ?? "safe",
        detail: matchedRisk?.detail ?? riskType.safeDetail,
      };
    }).sort((a, b) => (riskRank[a.level] ?? riskRank.notice) - (riskRank[b.level] ?? riskRank.notice));
  }, [risks]);
  const totals = useMemo(() => {
    if (!product || !calculation) return null;
    return calculateTotals(
      {
        ...product,
        unitPriceUsd,
        shippingUsd,
      },
      calculation,
      quantity,
    );
  }, [product, calculation, quantity, unitPriceUsd, shippingUsd]);
  const news = useMemo(() => {
    const hsCode = classification?.hsCode ?? "";
    const prefix = Object.keys(newsByHsPrefix).find((item) => hsCode.startsWith(item));
    return newsByHsPrefix[prefix] ?? [
      ["통관", "해외직구 상품 통관 기준 확인 안내", "Import News"],
      ["세금", "개인사용 물품 세금 계산 참고사항", "Customs Insight"],
      ["규제", "품목별 수입 요건 변경 소식", "Trade Daily"],
    ];
  }, [classification]);

  if (status === "missing-url") {
    return <StateCard title="조회할 URL이 없습니다" body="메인 페이지에서 테스트 제품 URL을 입력해주세요." />;
  }

  if (status === "loading" || status === "idle") {
    return <StateCard title="상품 분석 데이터를 불러오고 있습니다" body="DB 조회 중입니다." />;
  }

  if (status === "error") {
    return <StateCard title="조회 실패" body={error} tone="error" />;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-7">
              <div>
                <p className="text-sm font-black text-blue-600 mb-2">ASIN {lookup.asin}</p>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  분석된 상품 정보 및 수정
                </h2>
              </div>
              <Link
                to={`/simulate/${lookup.slug}`}
                className="text-sm font-black bg-blue-50 text-blue-700 px-4 py-2 rounded-lg"
              >
                제품 페이지
              </Link>
            </div>

            <div className="space-y-4">
              <Field label="제품명">
                <input className="result-input" value={product.title} readOnly />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="수량 (개)">
                  <input
                    className="result-input text-center"
                    min="1"
                    max="99"
                    type="number"
                    value={quantity}
                    onChange={(event) => {
                      const nextQuantity = Math.max(1, Number(event.target.value || 1));
                      setQuantity(nextQuantity);
                    }}
                  />
                </Field>
                <Field label="가격 (USD)">
                  <input
                    className="result-input text-right"
                    min="0"
                    step="0.01"
                    type="number"
                    value={unitPriceUsd}
                    onChange={(event) => setUnitPriceUsd(Math.max(0, Number(event.target.value || 0)))}
                  />
                </Field>
                <Field label="배송비 (USD)">
                  <input
                    className="result-input text-right"
                    min="0"
                    step="0.01"
                    type="number"
                    value={shippingUsd}
                    onChange={(event) => setShippingUsd(Math.max(0, Number(event.target.value || 0)))}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4">
                <Field label="HS Code 분류">
                  <input
                    className="result-input font-black"
                    value={`${classification.hsCode} (${classification.hsName})`}
                    readOnly
                  />
                </Field>
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-black">
                    다시 조회하기
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 mt-8 pt-7">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">최종 납부 금액</span>
                <strong className="text-3xl font-black text-blue-600">
                  {formatKrw(totals.totalCostKrw)}
                </strong>
              </div>

              <div className="mt-6 bg-slate-50 rounded-lg p-5 space-y-3 text-sm">
                <p className="font-black text-slate-700">관세 계산 상세</p>
                <Line label="물품 가격 (Total Value)" value={formatKrw(totals.customsValueKrw)} />
                <Line
                  label={`관세 (Customs Duty - ${Math.round(totals.dutyRate * 100)}%)`}
                  value={formatKrw(totals.dutyKrw)}
                />
                <Line
                  label={`부가세 (VAT - ${Math.round(totals.vatRate * 100)}%)`}
                  value={formatKrw(totals.vatKrw)}
                  strong
                />
                <div className="border-t border-slate-200 pt-5 mt-5 space-y-4">
                  <Line label="세금 합계" value={formatKrw(totals.totalTaxKrw)} />
                  <Line label="총 결제 예상액" value={formatKrw(totals.totalCostKrw)} strong />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
              HS Code 매칭 AI 근거
            </h3>
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {classification.reason}
              </p>
              <div className="mt-4">
                <div className="flex justify-between text-xs font-black text-slate-500 mb-2">
                  <span>매칭 신뢰도</span>
                  <span>{Math.round(classification.confidence * 100)}%</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <span
                    className="block h-full bg-green-500"
                    style={{ width: `${classification.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="bg-orange-50 border border-orange-100 rounded-lg p-7 lg:sticky lg:top-24">
          <h3 className="font-black text-orange-900 mb-6">⚠ 품목 리스크</h3>
          <div className="space-y-5">
            {displayRisks.map((risk) => (
              <RiskItem key={risk.key} risk={risk} />
            ))}
          </div>
        </aside>
      </div>

      <section className="pt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900">관련 규제 소식 및 뉴스</h3>
          <span className="text-xs font-black text-slate-400 tracking-widest">
            REAL-TIME UPDATES
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map(([tag, title, source]) => (
            <article
              key={title}
              className="bg-white border border-slate-100 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {tag}
                </span>
                <span className="text-[11px] text-slate-400 font-bold">{source}</span>
              </div>
              <h4 className="font-black text-slate-900 leading-snug">{title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed mt-3">
                해당 품목의 통관, 세금, 인증 기준을 확인할 수 있는 테스트 뉴스입니다.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-black text-slate-400 mb-2">{label}</span>
      {children}
    </label>
  );
}

function Line({ label, value, strong = false }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "font-black text-slate-900" : "text-slate-500"}`}>
      <span>{label}</span>
      <span className={strong ? "text-blue-600" : "font-bold text-slate-900"}>{value}</span>
    </div>
  );
}

function RiskItem({ risk }) {
  const labelMap = {
    safe: "안전",
    notice: "주의",
    warning: "높음",
  };
  const toneMap = {
    safe: "text-green-700",
    notice: "text-orange-700",
    warning: "text-red-700",
  };

  return (
    <div>
      <p className="font-black text-orange-950 text-sm mb-1.5">
        {risk.title}{" "}
        <span className={`text-xs ${toneMap[risk.level] ?? toneMap.notice}`}>
          ({labelMap[risk.level] ?? "주의"})
        </span>
      </p>
      <p className="text-sm text-orange-700 leading-relaxed font-medium">
        {risk.detail}
      </p>
    </div>
  );
}

function StateCard({ title, body, tone = "default" }) {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className={`bg-white border rounded-lg p-8 ${tone === "error" ? "border-red-200" : "border-slate-200"}`}>
        <h2 className="text-2xl font-black text-slate-900 mb-3">{title}</h2>
        <p className="text-slate-600 mb-6">{body}</p>
        <Link className="text-blue-600 font-bold" to="/">
          메인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}

export default Result;
