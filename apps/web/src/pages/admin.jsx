import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminOverview } from "../lib/adminApi";
import { getSavedAuthUser, isAdminUser } from "../lib/supabaseAuth";

const menus = [
  { id: "dashboard", label: "대시보드", description: "서비스 핵심 통계와 최근 상태를 확인합니다." },
  { id: "users", label: "회원 관리", description: "회원, 관리자 권한, 최근 로그인 상태를 관리합니다." },
  { id: "queries", label: "조회 로그", description: "사용자가 입력한 URL과 처리 상태를 추적합니다." },
  { id: "results", label: "분석 결과", description: "HS 분류, 세금 계산, 규제 판단 결과를 검수합니다." },
  { id: "regulations", label: "규제/KC 관리", description: "위험도, KC 필요 여부, 규제 요약을 관리합니다." },
  { id: "news", label: "뉴스/고시 관리", description: "HS 코드별 참고 뉴스와 고시 링크를 관리합니다." },
  { id: "reasons", label: "판단 근거 관리", description: "분류, 세금, 규제 판단의 설명 근거를 관리합니다." },
  { id: "settings", label: "운영 설정", description: "환율, 인증 정책, 관리자 운영값을 관리합니다." },
];

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatCard({ label, value, detail }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <strong className="block mt-3 text-3xl font-black text-slate-950">{value}</strong>
      {detail && <span className="block mt-2 text-xs font-bold text-slate-400">{detail}</span>}
    </div>
  );
}

function SimpleTable({ columns, rows, emptyText = "표시할 데이터가 없습니다." }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-slate-500" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id ?? row.query_result_id ?? row.risk_id ?? row.news_map_id ?? row.reason_id ?? index}>
                {columns.map((column) => (
                  <td key={column.key} className="max-w-[360px] px-4 py-3 align-top text-slate-700">
                    {column.render ? column.render(row) : row[column.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard({ data }) {
  const tableCounts = data?.stats?.tableCounts ?? {};
  const resultStatus = data?.stats?.resultStatus ?? {};
  const riskLevels = data?.stats?.riskLevels ?? {};

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Auth 회원" value={data?.stats?.authUsers ?? 0} detail={`관리자 ${data?.stats?.admins ?? 0}명`} />
        <StatCard label="조회 로그" value={tableCounts.svc_query_log?.count ?? 0} detail="svc_query_log" />
        <StatCard label="분석 결과" value={tableCounts.svc_query_result?.count ?? 0} detail="svc_query_result" />
        <StatCard label="활성 뉴스" value={data?.stats?.activeNews ?? 0} detail="최근 고시/뉴스 링크" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-black text-slate-950">분석 상태</h3>
          <div className="mt-4 grid gap-2">
            {Object.entries(resultStatus).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-bold text-slate-600">{key}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-black text-slate-950">규제 위험도</h3>
          <div className="mt-4 grid gap-2">
            {Object.entries(riskLevels).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-bold text-slate-600">{key}</span>
                <strong>{value}</strong>
              </div>
            ))}
            <div className="flex justify-between border-t pt-3 text-sm">
              <span className="font-bold text-slate-600">KC 필요</span>
              <strong>{data?.stats?.kcRequired ?? 0}</strong>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-black text-slate-950">관리 대상 테이블</h3>
          <div className="mt-4 grid gap-2 text-sm">
            {Object.entries(tableCounts).slice(0, 8).map(([key, item]) => (
              <div key={key} className="flex justify-between gap-3">
                <span className="font-bold text-slate-600">{key}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-lg font-black text-slate-950">최근 조회</h3>
        <SimpleTable
          columns={[
            { key: "productTitle", label: "상품" },
            { key: "asin", label: "ASIN" },
            { key: "status", label: "상태" },
            { key: "requestedAt", label: "요청일", render: (row) => formatDate(row.requestedAt) },
          ]}
          rows={data?.queries ?? []}
        />
      </section>
    </div>
  );
}

const tableColumns = {
  users: [
    { key: "email", label: "이메일" },
    { key: "name", label: "이름" },
    { key: "role", label: "권한" },
    { key: "createdAt", label: "가입일", render: (row) => formatDate(row.createdAt) },
    { key: "lastSignInAt", label: "최근 로그인", render: (row) => formatDate(row.lastSignInAt) },
  ],
  queries: [
    { key: "productTitle", label: "상품" },
    { key: "asin", label: "ASIN" },
    { key: "inputValue", label: "입력 URL" },
    { key: "status", label: "상태" },
    { key: "requestedAt", label: "요청일", render: (row) => formatDate(row.requestedAt) },
  ],
  results: [
    { key: "query_result_id", label: "결과 ID" },
    { key: "product_id", label: "상품 ID" },
    { key: "result_status", label: "상태" },
    { key: "created_at", label: "생성일", render: (row) => formatDate(row.created_at) },
  ],
  regulations: [
    { key: "product_id", label: "상품 ID" },
    { key: "risk_level", label: "위험도" },
    { key: "kc_required", label: "KC", render: (row) => (row.kc_required ? "필요" : "불필요") },
    { key: "risk_summary", label: "요약" },
  ],
  news: [
    { key: "hs_id", label: "HS" },
    { key: "risk_type", label: "유형" },
    { key: "title", label: "제목" },
    { key: "source_nm", label: "출처" },
    { key: "is_active", label: "활성", render: (row) => (row.is_active ? "활성" : "비활성") },
  ],
  reasons: [
    { key: "target_type", label: "대상" },
    { key: "target_id", label: "대상 ID" },
    { key: "reason_type", label: "근거 유형" },
    { key: "created_at", label: "생성일", render: (row) => formatDate(row.created_at) },
  ],
};

function AdminSection({ activeMenu, data }) {
  if (activeMenu === "dashboard") {
    return <Dashboard data={data} />;
  }

  if (activeMenu === "settings") {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[
          ["환율 정책", "현재 결과 계산은 API의 기본 환율 값을 사용합니다. 운영 시 환율 테이블과 수동 고정값 관리가 필요합니다."],
          ["인증 정책", "개발 중에는 이메일 인증을 우회합니다. 서비스 개시 전 이메일 인증 필수 전환이 필요합니다."],
          ["관리자 권한", "Supabase Auth app_metadata.role = admin 기준으로 관리자 접근을 제어합니다."],
          ["데이터 검수", "HS 분류, 세율, 규제 결과 변경 이력을 남기는 감사 로그 메뉴가 필요합니다."],
        ].map(([title, detail]) => (
          <div key={title} className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="font-black text-slate-950">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
          </div>
        ))}
      </div>
    );
  }

  const rows = data?.[activeMenu] ?? [];
  const columns = tableColumns[activeMenu] ?? [];

  return <SimpleTable columns={columns} rows={rows} />;
}

const Admin = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("관리자 데이터를 불러오는 중입니다.");
  const authUser = getSavedAuthUser();

  useEffect(() => {
    if (!isAdminUser(authUser)) {
      setMessage("관리자 권한이 필요합니다.");
      return;
    }

    fetchAdminOverview()
      .then((payload) => {
        setData(payload);
        setMessage("");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "관리자 데이터를 불러오지 못했습니다.");
      });
  }, [authUser]);

  const active = useMemo(() => menus.find((menu) => menu.id === activeMenu) ?? menus[0], [activeMenu]);

  if (!isAdminUser(authUser)) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-black text-slate-950">관리자 권한이 필요합니다.</h1>
          <p className="mt-3 text-slate-500">관리자 계정으로 로그인한 뒤 다시 접근해주세요.</p>
          <Link to="/login" className="inline-block mt-6 rounded-lg bg-blue-600 px-5 py-3 font-black text-white">
            로그인으로 이동
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-black text-blue-600">BUYSAFE ADMIN</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">관리자페이지</h1>
        <p className="mt-3 text-slate-500">서비스 운영 데이터, 분석 결과, 규제 콘텐츠를 한곳에서 확인합니다.</p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="bg-white border border-slate-200 rounded-lg p-3 h-fit">
          {menus.map((menu) => (
            <button
              key={menu.id}
              type="button"
              onClick={() => setActiveMenu(menu.id)}
              className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                activeMenu === menu.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="block text-sm font-black">{menu.label}</span>
              <span className="block mt-1 text-xs leading-5">{menu.description}</span>
            </button>
          ))}
        </aside>

        <section>
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">{active.label}</h2>
              <p className="mt-1 text-sm text-slate-500">{active.description}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessage("관리자 데이터를 새로고침하는 중입니다.");
                fetchAdminOverview()
                  .then((payload) => {
                    setData(payload);
                    setMessage("");
                  })
                  .catch((error) => {
                    setMessage(error instanceof Error ? error.message : "관리자 데이터를 불러오지 못했습니다.");
                  });
              }}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-black text-white hover:bg-slate-700"
            >
              새로고침
            </button>
          </div>

          {message ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-bold text-slate-600">
              {message}
            </div>
          ) : (
            <AdminSection activeMenu={activeMenu} data={data} />
          )}
        </section>
      </div>
    </main>
  );
};

export default Admin;
