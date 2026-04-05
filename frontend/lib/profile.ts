import { Profile } from "@/lib/types";

const REQUIRED_PROFILE_FIELDS: Array<keyof Profile> = [
  "country",
  "target_country",
  "degree_level",
  "field_of_study",
  "gpa",
];

function hasValue(value: Profile[keyof Profile]): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  return value !== null && value !== undefined;
}

export function getMissingRequiredProfileFields(profile: Profile | null | undefined) {
  if (!profile) {
    return [...REQUIRED_PROFILE_FIELDS];
  }

  return REQUIRED_PROFILE_FIELDS.filter((field) => !hasValue(profile[field]));
}

export function isProfileReady(profile: Profile | null | undefined) {
  return getMissingRequiredProfileFields(profile).length === 0;
}
