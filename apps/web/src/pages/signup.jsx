import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAlreadyRegisteredError, signUpWithEmail } from "../lib/supabaseAuth";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreements, setAgreements] = useState({
    age: false,
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [message, setMessage] = useState("");
  const [showLoginLink, setShowLoginLink] = useState(false);
  const navigate = useNavigate();

  const requiredAgreementComplete = useMemo(
    () => agreements.age && agreements.terms && agreements.privacy,
    [agreements],
  );

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateAgreement = (field, checked) => {
    setAgreements((current) => ({ ...current, [field]: checked }));
  };

  const toggleAllAgreements = (checked) => {
    setAgreements({
      age: checked,
      terms: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoginLink(false);

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage("이름, 이메일, 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    if (!requiredAgreementComplete) {
      setMessage("필수 약관과 개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    try {
      await signUpWithEmail({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        agreements,
      });
      setMessage("가입이 완료되었습니다. 로그인 화면으로 이동합니다.");
      window.setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      if (isAlreadyRegisteredError(error)) {
        setShowLoginLink(true);
        setMessage("이미 가입된 이메일입니다.");
        return;
      }

      setMessage(error instanceof Error ? error.message : "회원가입에 실패했습니다.");
    }
  };

  const allAgreed = Object.values(agreements).every(Boolean);

  return (
    <main className="min-h-[calc(100vh-145px)] bg-slate-50">
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-[1fr_460px] gap-10 items-start">
        <div className="pt-4">
          <p className="text-sm font-black text-blue-600 mb-4">JOIN BUYSAFE</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            안전한 해외직구를 위한
            <br />
            개인 계정을 만드세요.
          </h1>
          <p className="mt-5 max-w-xl text-slate-500 text-lg leading-8">
            회원가입 후 조회 기록과 관세 계산 결과를 저장하고, 관심 상품의 통관 리스크를 다시 확인할 수 있습니다.
          </p>
          <div className="mt-8 bg-white border border-slate-200 rounded-lg p-5 max-w-xl">
            <h2 className="text-base font-black text-slate-900">개인정보 동의 안내</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              서비스 제공을 위해 이름, 이메일, 로그인 인증 정보를 수집합니다. 수집한 정보는 계정 관리와 조회 결과 저장에 사용됩니다.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-lg shadow-xl shadow-slate-200/70 p-6 md:p-8"
        >
          <div className="mb-7">
            <h2 className="text-2xl font-black text-slate-950">회원가입</h2>
            <p className="mt-2 text-sm text-slate-500">필수 정보를 입력하고 개인정보 동의 여부를 확인해주세요.</p>
          </div>

          <label className="block mb-4">
            <span className="block text-sm font-bold text-slate-700 mb-2">이름</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              autoComplete="name"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              placeholder="홍길동"
            />
          </label>

          <label className="block mb-4">
            <span className="block text-sm font-bold text-slate-700 mb-2">이메일</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              placeholder="you@example.com"
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            <label className="block">
              <span className="block text-sm font-bold text-slate-700 mb-2">비밀번호</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                placeholder="8자 이상"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-bold text-slate-700 mb-2">비밀번호 확인</span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => updateForm("confirmPassword", event.target.value)}
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                placeholder="다시 입력"
              />
            </label>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-5">
            <label className="flex items-start gap-3 pb-4 border-b border-slate-200">
              <input
                type="checkbox"
                checked={allAgreed}
                onChange={(event) => toggleAllAgreements(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                <span className="block text-sm font-black text-slate-900">전체 동의</span>
                <span className="block mt-1 text-xs leading-5 text-slate-500">
                  필수 동의와 선택 마케팅 수신 동의를 한 번에 선택합니다.
                </span>
              </span>
            </label>

            <div className="pt-4 grid gap-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreements.age}
                  onChange={(event) => updateAgreement("age", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-700">[필수] 만 14세 이상입니다.</span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreements.terms}
                  onChange={(event) => updateAgreement("terms", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-700">[필수] 서비스 이용약관에 동의합니다.</span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreements.privacy}
                  onChange={(event) => updateAgreement("privacy", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-700">
                    [필수] 개인정보 수집 및 이용에 동의합니다.
                  </span>
                  <span className="block mt-1 text-xs leading-5 text-slate-500">
                    수집 항목: 이름, 이메일, 비밀번호 인증 정보. 이용 목적: 회원 식별, 로그인, 조회 결과 저장.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={(event) => updateAgreement("marketing", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-700">[선택] 혜택 및 업데이트 알림 수신에 동의합니다.</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:text-slate-500"
            disabled={!requiredAgreementComplete}
          >
            회원가입
          </button>

          {message && (
            <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
              {message}
              {showLoginLink && (
                <>
                  {" "}
                  <Link to="/login" className="underline decoration-2 underline-offset-2">
                    로그인으로 이동
                  </Link>
                </>
              )}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            이미 계정이 있나요?{" "}
            <Link to="/login" className="font-black text-blue-600 hover:text-blue-700">
              로그인
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Signup;
