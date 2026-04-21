import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/home";
import { clearAuthSession, getSavedAuthUser, isAdminUser } from "./lib/supabaseAuth";
import Admin from "./pages/admin";
import Login from "./pages/login";
import Result from "./pages/result";
import Simulate from "./pages/simulate";
import Signup from "./pages/signup";

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
  const [authUser, setAuthUser] = useState(() => getSavedAuthUser());
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuthUser = () => {
      setAuthUser(getSavedAuthUser());
    };

    window.addEventListener("buysafe:auth-changed", syncAuthUser);
    window.addEventListener("storage", syncAuthUser);

    return () => {
      window.removeEventListener("buysafe:auth-changed", syncAuthUser);
      window.removeEventListener("storage", syncAuthUser);
    };
  }, []);

  const handleSearch = () => {
    if (!url.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }

    navigate(`/result?url=${encodeURIComponent(normalizeSearchUrl(url))}`);
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/");
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
          {authUser ? (
            <div className="flex items-center gap-3">
              <span className="max-w-[180px] truncate text-sm font-bold text-slate-700">
                {authUser.email}
              </span>
              {isAdminUser(authUser) && (
                <Link
                  to="/admin"
                  className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  관리자페이지
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-bold bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </nav>
      <Routes>
        <Route
          path="/"
          element={<Home url={url} setUrl={setUrl} onSearch={handleSearch} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
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
