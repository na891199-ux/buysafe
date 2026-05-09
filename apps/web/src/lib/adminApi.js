import { API_BASE_URL, clearAuthSession, getSavedAccessToken, refreshSavedAuthSession } from "./supabaseAuth";

export async function fetchAdminOverview() {
  return fetchAdminOverviewWithRetry(false);
}

async function fetchAdminOverviewWithRetry(hasRetried) {
  const accessToken = getSavedAccessToken();

  if (!accessToken) {
    throw new Error("관리자 로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/overview`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && !hasRetried) {
      try {
        await refreshSavedAuthSession();
        return fetchAdminOverviewWithRetry(true);
      } catch {
        clearAuthSession();
        throw new Error("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      }
    }

    if (response.status === 401) {
      clearAuthSession();
      throw new Error("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
    }

    throw new Error(payload.error || "관리자 데이터를 불러오지 못했습니다.");
  }

  return payload.data;
}
