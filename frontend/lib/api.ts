import { AdminAISettings, AdminJob, AdminOverview, AdminSource, Match, Profile, Scholarship, User } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type APIErrorPayload = {
  detail?: unknown;
  request_id?: unknown;
};

function buildURL(path: string): string {
  return `${API_URL}${path}`;
}

async function fetchAPI(path: string, options?: RequestInit): Promise<Response> {
  return fetch(buildURL(path), {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });
}

async function parseJSON<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

async function extractErrorMessage(response: Response): Promise<string> {
  let message = `Request failed: ${response.status}`;

  try {
    const payload = (await parseJSON<APIErrorPayload>(response)) as APIErrorPayload;
    if (typeof payload.detail === "string") {
      message = payload.detail;
    } else if (Array.isArray(payload.detail) && payload.detail.length > 0) {
      const first = payload.detail[0] as { msg?: string; loc?: string[]; type?: string };
      if (first?.msg) {
        // Handle Pydantic-style validation errors
        const loc_prefix = first.loc ? `${first.loc.join(".")} ` : "";
        message = `${loc_prefix}${first.msg}`;
      }
    } else if (payload.detail && typeof payload.detail === "object") {
      // Handle generic object errors
      message = JSON.stringify(payload.detail);
    }

    const requestId = payload.request_id || response.headers.get("X-Request-ID");
    if (typeof requestId === "string" && requestId) {
      message = `${message} (RID: ${requestId.slice(0, 8)})`;
    }
  } catch {
    // Keep the default message if the response body is not JSON.
  }

  return message;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetchAPI(path, options);

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return parseJSON<T>(response);
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

export async function getMatches(forceRefresh = false): Promise<{ matches: Match[] }> {
  return request<{ matches: Match[] }>("/match", {
    method: "POST",
    body: JSON.stringify({ force_refresh: forceRefresh }),
  });
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
  const response = await fetchAPI("/auth/me");
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  return parseJSON<User>(response);
}

export async function updateAccountSettings(payload: {
  full_name?: string;
  current_password?: string;
  new_password?: string;
}): Promise<User> {
  return request<User>("/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getAdminOverview(): Promise<AdminOverview> {
  return request<AdminOverview>("/admin/overview");
}

export async function getAdminSources(): Promise<AdminSource[]> {
  return request<AdminSource[]>("/admin/sources");
}

export async function getAdminJobs(): Promise<AdminJob[]> {
  return request<AdminJob[]>("/admin/crawl-jobs");
}

export async function getAdminAISettings(): Promise<AdminAISettings> {
  return request<AdminAISettings>("/admin/ai-settings");
}

export async function updateAdminAISettings(payload: AdminAISettings): Promise<AdminAISettings> {
  return request<AdminAISettings>("/admin/ai-settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function createAdminCrawlJob(payload: {
  source_key?: string;
  country_filter?: string;
  region_filter?: string;
}): Promise<AdminJob> {
  return request<AdminJob>("/admin/crawl-jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createAdminRematchJob(payload: {
  user_id?: number;
  all_users: boolean;
}): Promise<AdminJob> {
  return request<AdminJob>("/admin/rematch-jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
