import React, { useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/home";
import Result from "./pages/result";
import Simulate from "./pages/simulate";

const simulateUrlMap = {
  calvinklein: "https://www.amazon.com/-/ko/dp/B07PGR2Z62",
  garmin: "https://www.amazon.com/dp/B0DBMM6S89",
  ipad: "https://www.amazon.com/-/ko/dp/B0DZ75TN5F",
  magnesium: "https://www.amazon.com/-/ko/dp/B07NWMVMT1",
  marshall: "https://www.amazon.com/Marshall-Acton-Bluetooth-Speaker-Cream/dp/B0BBYF2SXX",
  omega3: "https://www.amazon.com/-/ko/dp/B000SE5SY6",
  sony: "https://www.amazon.com/-/ko/dp/B0DD8SHVZL",
};

function normalizeSearchUrl(value) {
  const trimmed = value.trim();
  const simulateMatch = trimmed.match(/\/simulate\/([^/?#]+)/i);

  if (!simulateMatch) {
    return trimmed;
  }

  const slug = simulateMatch[1].toLowerCase();
  return simulateUrlMap[slug] ?? trimmed;
}

function AppShell() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!url.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }

    navigate(`/result?url=${encodeURIComponent(normalizeSearchUrl(url))}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-xl font-black text-blue-700 cursor-pointer">
          BuySafe
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/simulate" className="text-sm font-medium text-slate-600">
            테스트 데이터
          </Link>
          <button className="text-sm font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg">
            로그인
          </button>
        </div>
      </nav>
      <Routes>
        <Route
          path="/"
          element={<Home url={url} setUrl={setUrl} onSearch={handleSearch} />}
        />
        <Route path="/result" element={<Result />} />
        <Route path="/simulate" element={<Navigate to="/simulate/Marshall" replace />} />
        <Route path="/simulate/:productSlug" element={<Simulate />} />
      </Routes>
      <footer className="py-10 text-center text-xs text-slate-400 border-t bg-white">
        © 2026 BuySafe. All rights reserved.
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
