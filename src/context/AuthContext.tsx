"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch, clearTokens } from "@/lib/api";
import { AuthUser, TokenResponse } from "@/lib/types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isAdminRole(role: AuthUser["role"]) {
  return (
    role === "ADMINISTRATOR" ||
    role === "HR_MANAGER" ||
    role === "DEPARTMENT_HEAD"
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        clearTokens();
      }
    }
    setLoading(false);
  }, []);

  function persistSession(data: TokenResponse) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function redirectByRole(role: AuthUser["role"]) {
    router.push(isAdminRole(role) ? "/admin/dashboard" : "/employee/dashboard");
  }

  async function login(email: string, password: string) {
    const res = await apiFetch<{ data: TokenResponse }>("/auth/login", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });
    persistSession(res.data);
    redirectByRole(res.data.user.role);
  }

  async function register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const res = await apiFetch<{ data: TokenResponse }>("/auth/register", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify(data),
    });
    persistSession(res.data);
    redirectByRole(res.data.user.role);
  }

  function logout() {
    clearTokens();
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { isAdminRole };
