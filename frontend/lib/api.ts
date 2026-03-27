import { Match, Profile, Scholarship, User } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const payload = (await response.json()) as { detail?: unknown };
      if (typeof payload.detail === "string") {
        message = payload.detail;
      } else if (Array.isArray(payload.detail) && payload.detail.length > 0) {
        const first = payload.detail[0] as { msg?: string };
        if (first?.msg) {
          message = first.msg;
        }
      }
    } catch {
      // Keep the default message if the response body is not JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function createProfile(profile: Profile): Promise<Profile> {
  return request<Profile>("/profile", {
    method: "POST",
    body: JSON.stringify(profile),
  });
}

export async function getScholarships(): Promise<Scholarship[]> {
  return request<Scholarship[]>("/scholarships");
}

export async function getMatches(profile: Profile): Promise<{ matches: Match[] }> {
  void profile;
  return request<{ matches: Match[] }>("/match", { method: "POST" });
}

export async function generateSop(profile: Profile, scholarshipId: number): Promise<string> {
  void profile;
  const result = await request<{ content: string }>("/generate-sop", {
    method: "POST",
    body: JSON.stringify({ scholarship_id: scholarshipId }),
  });
  return result.content;
}

export async function signup(payload: {
  email: string;
  full_name: string;
  password: string;
}): Promise<{ user: User }> {
  return request<{ user: User }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }): Promise<{ user: User }> {
  return request<{ user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout(): Promise<void> {
  await request<{ status: string }>("/auth/logout", { method: "POST" });
}

export async function me(): Promise<User | null> {
  const response = await fetch(`${API_URL}/auth/me`, { credentials: "include", cache: "no-store" });
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<User>;
}
