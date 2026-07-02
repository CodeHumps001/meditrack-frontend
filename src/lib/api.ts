const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getTokens() {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
}

function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

async function tryRefresh(): Promise<boolean> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const json = await res.json();
    if (json.status === "success" && json.data?.accessToken) {
      setAccessToken(json.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
  /** For endpoints that stream a file (report exports) rather than JSON */
  raw?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { skipAuth, raw, headers, ...rest } = options;
  const { accessToken } = getTokens();

  const doFetch = async (token: string | null) => {
    return fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        ...(raw ? {} : { "Content-Type": "application/json" }),
        ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  };

  let res = await doFetch(accessToken);

  if (res.status === 401 && !skipAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const { accessToken: newToken } = getTokens();
      res = await doFetch(newToken);
    } else {
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  if (raw) {
    if (!res.ok) throw new Error("Request failed");
    return res as unknown as T;
  }

  const json = await res.json();

  if (!res.ok || json.status === "error") {
    throw new Error(json.message || "Request failed");
  }

  return json;
}

/** Triggers a browser download for report export endpoints (?format=excel|pdf) */
export async function downloadFile(path: string, filename: string) {
  const res = await apiFetch<Response>(path, { raw: true });
  const blob = await (res as Response).blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
