export type Profile = {
  id?: number;
  country: string;
  target_country: string;
  degree: string;
  major?: string;
  passout_year?: number;
  gpa: number;
  ielts_score: number;
};

export type Scholarship = {
  id: number;
  title: string;
  country: string;
  degree: string;
  source_url: string;
  deadline: string;
  eligibility_text: string;
  structured_eligibility: {
    gpa_required?: number;
    ielts_required?: number;
    documents_required?: string[];
  };
};

export type Match = {
  scholarship_id: number;
  title: string;
  country: string;
  deadline: string;
  match_score: number;
  missing_requirements: string[];
  summary: string;
};

export type User = {
  id: number;
  email: string;
  full_name: string;
  profile: Profile | null;
};
