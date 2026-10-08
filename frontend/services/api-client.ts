import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "@/hooks/use-api-config";

const ACCESS_KEY = "auth-access-token";
const REFRESH_KEY = "auth-refresh-token";
const EMAIL_KEY = "auth-user-email";

export async function storeTokens(access: string, refresh: string) {
  await SecureStore.setItemAsync(ACCESS_KEY, access);
  await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
  await SecureStore.deleteItemAsync(EMAIL_KEY);
}

export async function storeUserEmail(email: string) {
  await SecureStore.setItemAsync(EMAIL_KEY, email);
}

export async function getUserEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(EMAIL_KEY);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      await clearTokens();
      return null;
    }
    const data = await res.json();
    await SecureStore.setItemAsync(ACCESS_KEY, data.access);
    return data.access as string;
  } catch {
    await clearTokens();
    return null;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token = await getAccessToken();

  const doFetch = (t: string | null) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        ...options.headers,
      },
    });

  let res = await doFetch(token);

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) throw new Error("Unauthorized");
    res = await doFetch(token);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function sendLoginCode(email: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/auth/send-code/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send code: ${body}`);
  }
}

export async function verifyLoginCode(
  email: string,
  code: string
): Promise<{ access: string; refresh: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/verify-code/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Verification failed: ${body}`);
  }
  return res.json();
}
