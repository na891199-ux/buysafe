import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { redirectToSocialLogin, saveAuthSession, signInWithEmail } from "../lib/supabaseAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const session = await signInWithEmail({
        email: email.trim(),
        password,
      });
      saveAuthSession(session, rememberMe);
      setMessage("로그인되었습니다.");
      navigate("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    }
  };

  const handleSocialLogin = (provider) => {
    try {
      redirectToSocialLogin(provider);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `${provider} 로그인에 실패했습니다.`);
    }
  };

  return (
    <main className="min-h-[calc(100vh-145px)] bg-slate-50">
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-[1fr_420px] gap-10 items-center">
        <div>
          <p className="text-sm font-black text-blue-600 mb-4">BUYSAFE ACCOUNT</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            구매 전 확인한 내역을
            <br />
            안전하게 이어서 보세요.
          </h1>
          <p className="mt-5 max-w-xl text-slate-500 text-lg leading-8">
            로그인하면 최근 조회한 상품, 관세 계산 결과, 통관 리스크 메모를 한곳에서 다시 확인할 수 있습니다.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl">
            {["조회 기록 저장", "관세 결과 보관", "리스크 메모 관리"].map((item) => (
              <div key={item} className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                <span className="block text-sm font-black text-slate-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-lg shadow-xl shadow-slate-200/70 p-6 md:p-8"
        >
          <div className="mb-7">
            <h2 className="text-2xl font-black text-slate-950">로그인</h2>
            <p className="mt-2 text-sm text-slate-500">BuySafe 계정 정보를 입력해주세요.</p>
          </div>

          <label className="block mb-5">
            <span className="block text-sm font-bold text-slate-700 mb-2">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              placeholder="you@example.com"
            />
          </label>

          <label className="block mb-4">
            <span className="block text-sm font-bold text-slate-700 mb-2">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              placeholder="비밀번호"
            />
          </label>

          <div className="flex items-center justify-between gap-4 mb-6">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              로그인 유지
            </label>
            <div className="flex items-center gap-3">
              <Link to="/signup" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                회원가입
              </Link>
              <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                비밀번호 찾기
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-700 transition-colors"
          >
            로그인
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-bold text-slate-400">또는</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("kakao")}
              className="w-full rounded-lg bg-[#FEE500] px-5 py-3 font-black text-[#191919] hover:bg-[#f6dc00] transition-colors"
            >
              카카오 로그인
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("naver")}
              className="w-full rounded-lg bg-[#03C75A] px-5 py-3 font-black text-white hover:bg-[#02b350] transition-colors"
            >
              네이버 로그인
            </button>
          </div>

          {message && (
            <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default Login;
