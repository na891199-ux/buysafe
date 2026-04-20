import React from "react";

const samplePages = [
  {
    label: "Marshall Acton III Bluetooth Speaker",
    url: "http://localhost:5173/simulate/Marshall",
  },
  {
    label: "Sony MDR-M1 Headphones",
    url: "http://localhost:5173/simulate/Sony",
  },
  {
    label: "Garmin Forerunner 55",
    url: "http://localhost:5173/simulate/Garmin",
  },
  {
    label: "Apple iPad 11-inch A16",
    url: "http://localhost:5173/simulate/iPad",
  },
  {
    label: "NOW Magnesium Glycinate",
    url: "http://localhost:5173/simulate/Magnesium",
  },
  {
    label: "NOW Ultra Omega-3",
    url: "http://localhost:5173/simulate/Omega3",
  },
  {
    label: "Calvin Klein Boxer Brief",
    url: "http://localhost:5173/simulate/CalvinKlein",
  },
];

const Home = ({ onSearch, url, setUrl }) => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
        해외 직구가 불안할 때 <br />
        <span className="text-blue-600">BuySafe</span>에서 먼저 확인하세요
      </h2>
      <p className="text-slate-500 text-lg">
        테스트 제품 페이지 URL을 입력하면 DB에 저장된 분석 결과를 조회합니다.
      </p>

      <div className="bg-white p-2 rounded-2xl shadow-xl border flex flex-col md:flex-row gap-2 max-w-3xl mx-auto mt-12">
        <input
          className="flex-grow px-6 py-4 outline-none text-lg"
          placeholder="테스트 제품 페이지 URL을 입력하세요"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSearch();
          }}
        />
        <button
          onClick={onSearch}
          className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          조회하기
        </button>
      </div>

      <div className="mt-10 text-left max-w-3xl mx-auto">
        <p className="text-sm font-black text-slate-400 mb-3">
          테스트 제품 페이지 URL
        </p>
        <div className="grid gap-2">
          {samplePages.map((sample) => (
            <button
              key={sample.url}
              onClick={() => setUrl(sample.url)}
              className="text-left bg-white border border-slate-100 rounded-lg px-4 py-3 hover:border-blue-200 hover:text-blue-700"
            >
              <span className="block text-sm font-bold text-slate-700">
                {sample.label}
              </span>
              <span className="block text-xs text-slate-500 mt-1 break-all">
                {sample.url}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
