const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5174";

export { API_BASE_URL };

function toFriendlyAuthError(message) {
  const waitSeconds = message.match(/after\s+(\d+)\s+seconds?/i)?.[1];

  if (waitSeconds) {
    return `보안상 너무 자주 요청할 수 없습니다. ${waitSeconds}초 후 다시 시도해주세요.`;
  }

  if (/invalid login credentials/i.test(message)) {
    return "이메일 또는 비밀번호가 올바르지 않습니다. 가입 직후라면 이메일 인증을 완료한 뒤 다시 로그인해주세요.";
  }

  if (/email not confirmed|not confirmed/i.test(message)) {
    return "이메일 인증이 완료되지 않았습니다. 가입 시 받은 인증 메일을 확인해주세요.";
  }

  return message;
}

export function isAlreadyRegisteredError(error) {
  if (!(error instanceof Error)) {
    return false;
  }

  return /already registered|already been registered|already exists|user already/i.test(error.message);
}

export function isAdminUser(user) {
  if (!user) {
    return false;
  }

  return (
    user.app_metadata?.role === "admin" ||
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.role === "admin" ||
    user.user_metadata?.is_admin === true
  );
}

function getAuthConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase Auth 환경변수가 설정되어 있지 않습니다.");
  }

  return {
    baseUrl: SUPABASE_URL.replace(/\/$/, ""),
    anonKey: SUPABASE_ANON_KEY,
  };
}

async function requestAuth(path, options) {
  const { baseUrl, anonKey } = getAuthConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload.msg || payload.error_description || payload.error || "인증 요청에 실패했습니다.";
    throw new Error(toFriendlyAuthError(message));
  }

  return payload;
}

async function requestApi(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(toFriendlyAuthError(payload.error || "인증 요청에 실패했습니다."));
    error.code = payload.code;
    throw error;
  }

  return payload.data;
}

export async function signUpWithEmail({ name, email, password, agreements }) {
  return requestApi("/api/auth/signup", {
    name,
    email,
    password,
    agreements,
  });
}

export async function signInWithEmail({ email, password }) {
  return requestApi("/api/auth/login", {
    email,
    password,
  });
}

export function saveAuthSession(session, rememberMe) {
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;

  storage.setItem("buysafe.auth.session", JSON.stringify(session));
  otherStorage.removeItem("buysafe.auth.session");
  window.dispatchEvent(new Event("buysafe:auth-changed"));
}

export function getSavedAuthSession() {
  const savedSession =
    window.localStorage.getItem("buysafe.auth.session") ??
    window.sessionStorage.getItem("buysafe.auth.session");

  if (!savedSession) {
    return null;
  }

  try {
    return JSON.parse(savedSession);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getSavedAccessToken() {
  const savedSession = getSavedAuthSession();

  return savedSession?.access_token ?? savedSession?.session?.access_token ?? null;
}

export function getSavedAuthUser() {
  return getSavedAuthSession()?.user ?? null;
}

export function clearAuthSession() {
  window.localStorage.removeItem("buysafe.auth.session");
  window.sessionStorage.removeItem("buysafe.auth.session");
  window.dispatchEvent(new Event("buysafe:auth-changed"));
}

export function redirectToSocialLogin(provider) {
  const { baseUrl, anonKey } = getAuthConfig();
  const redirectTo = `${window.location.origin}/login`;
  const params = new URLSearchParams({
    provider,
    redirect_to: redirectTo,
  });

  window.location.href = `${baseUrl}/auth/v1/authorize?${params.toString()}&apikey=${encodeURIComponent(anonKey)}`;
}
