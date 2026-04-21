import { API_BASE_URL, getSavedAccessToken } from "./supabaseAuth";

export async function fetchAdminOverview() {
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
    throw new Error(payload.error || "관리자 데이터를 불러오지 못했습니다.");
  }

  return payload.data;
}
