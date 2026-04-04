export type DegreeLevel = "Bachelors" | "Masters" | "PhD";
export type UserRole = "admin" | "user";
export type AIProvider = "openai" | "cerebras" | "glm" | "ollama" | "local";
export type RemoteAIProvider = Exclude<AIProvider, "local">;

export type Profile = {
  id?: number;
  country: string;
  target_country: string;
  degree_level: DegreeLevel;
  field_of_study?: string;
  passout_year?: number;
  gpa: number;
  ielts_score?: number;
  gender?: string;
  date_of_birth?: string;
  resume_url?: string;
};

export type Scholarship = {
  id: number;
  title: string;
  country: string;
  degree: string;
  region?: string | null;
  source_key?: string | null;
  source_name?: string | null;
  official_source: boolean;
  source_url: string;
  deadline: string | null;
  funding_type?: string | null;
  coverage_summary?: string | null;
  is_fully_funded?: boolean | null;
  field_of_study: string[];
  eligible_countries: string[];
  eligibility_text: string;
  structured_eligibility: {
    gpa_required?: number;
    ielts_required?: number;
    documents_required?: string[];
    degree_levels?: string[];
    countries_allowed?: string[];
    fields_of_study?: string[];
    programs?: string[];
    funding_type?: string | null;
    fully_funded?: boolean | null;
    benefits?: string[];
    application_requirements?: string[];
    eligible_nationalities_summary?: string | null;
  };
  raw_payload: Record<string, unknown>;
};

export type Match = {
  scholarship_id: number;
  title: string;
  country: string;
  deadline: string | null;
  match_score: number;
  rule_score?: number | null;
  llm_score?: number | null;
  llm_confidence?: number | null;
  missing_requirements: string[];
  summary: string;
  personalized_reasoning?: string | null;
};

export type User = {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  profile: Profile | null;
};

export type AdminOverview = {
  total_sources: number;
  enabled_sources: number;
  total_jobs: number;
  pending_jobs: number;
  running_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
  total_match_snapshots: number;
  total_users: number;
  total_scholarships: number;
  last_ingestion_at: string | null;
};

export type AdminSource = {
  id: number;
  source_key: string;
  source_name: string;
  base_url: string;
  country: string;
  region: string;
  fetcher_kind: string;
  official: boolean;
  enabled: boolean;
  last_crawled_at: string | null;
  last_success_at: string | null;
  last_run_id: string | null;
  last_error: string | null;
};

export type AdminJob = {
  id: number;
  job_type: string;
  status: string;
  triggered_by_user_id: number | null;
  target_user_id: number | null;
  source_key: string | null;
  country_filter: string | null;
  region_filter: string | null;
  error_message: string | null;
  total_items: number;
  processed_items: number;
  success_count: number;
  failed_count: number;
  log_output: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export type AdminAISettings = {
  ai_provider: RemoteAIProvider;
  ai_fallback_order: string[];
  openai_model: string;
  cerebras_model: string;
  cerebras_max_completion_tokens: number;
  glm_model: string;
  glm_base_url: string;
  ollama_model: string;
  ollama_base_url: string;
  ollama_timeout_seconds: number;
  ollama_keep_alive: string;
  llm_match_top_n: number;
  llm_match_rule_weight: number;
  openai_key_configured: boolean;
  cerebras_key_configured: boolean;
  glm_key_configured: boolean;
};
