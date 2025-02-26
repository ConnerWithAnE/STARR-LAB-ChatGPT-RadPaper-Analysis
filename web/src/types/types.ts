export type FullDataType = {
  id: number;
  name: string;
  year: number;
  authors: AuthorData[];
  parts: PartData[];
  testingData: TestData[];
};

export type AuthorData = {
  id: number;
  name: string;
};

export type PartData = {
  id: number;
  name: string;
  type: string;
  manufacturer: string;
  testing_location: TestLocation;
};

export type TestData = {
  id: number;
  testing_type: Testing;
  data_type: number;
  max_fluence: number;
  energy: number;
  facility: string;
  environment: string;
  terrestrial: boolean;
  flight: boolean;
  tidData?: TIDDataType;
  seeData?: SEEDataType;
  ddData?: DDDataType;
};

export type TIDDataType = {
  id: number;
  source: "Co60" | "Protons" | "Electrons" | "Heavy ions" | "X-rays";
  max_tid: number;
  dose_rate: number;
  eldrs: boolean;
  p_pion: boolean;
  dose_to_failure: number;
  increased_power_usage: boolean;
  power_usage_description: string;
  special_notes?: string;
};

export type SEEDataType = {
  id: number;
  source: "Heavy ions" | "Protons" | "Laser" | "Neutron" | "Electron";
  type:
    | "Single Event Upset"
    | "Single Event Transient"
    | "Single Event Functional Interrupt"
    | "Single Event Latch-up"
    | "Single Event Burnout"
    | "Single Event Gate Rupture";
  amplitude: number;
  duration: number;
  cross_section: number;
  cross_section_type: string;
  special_notes?: string;
};

export type DDDataType = {
  id: number;
  source: "Protons" | "Neutrons";
  damage_level: number;
  damage_level_description: string;
  special_notes?: string;
};

export type UpdateData = {
  ROWID: number;
  paper_name?: string;
  year?: number;
  author?: string[];
  part_no?: string;
  type?: string;
  manufacturer?: string;
  testing_location?: TestLocation;
  testing_type?: string;
  data_type?: number;
};

export type GPTData = {
  paper_name: string;
  year: number;
  author: string[];
  part_no: string;
  type: string;
  manufacturer: string;
  testing_location: TestLocation;
  testing_type: Testing;
  data_type: number;
};

export type GPTResponse = {
  pass_1: GPTData;
  pass_2: GPTData;
  pass_3: GPTData;
};

export type TableData = {
  id?: number;
  paper_name: string;
  year: number;
  author: string[];
  part_no: string;
  type: string;
  manufacturer: string;
  testing_location: TestLocation;
  testing_type: Testing;
  data_type: number;
};

export type Severity = 1 | 2;

export type TestLocation = "Terrestrial" | "Flight";

// Type to ensure testing types are consistent
export type Testing = "SEE" | "TID" | "DD" | "OTHER";

export function validationFunc(data: unknown): string {
  if (typeof data === "string") {
    return data;
  } else if (typeof data === "number") {
    return data.toString();
  } else if (isTestLocation(data) || isTesting(data)) {
    return data as string;
  } else if (Array.isArray(data)) {
    return data.join();
  }
  return "";
}

function isTestLocation(data: unknown): data is TestLocation {
  return data === "Terrestrial" || data === "Flight";
}

function isTesting(data: unknown): data is Testing {
  return data === "SEE" || data === "TID" || data === "DD" || data === "OTHER";
}

export type Conflict = {
  yellowSeverity: string[];
  redSeverity: string[];
};

export function hasEmptyProperty(obj: UpdateData): boolean {
  return Object.values(obj).some(
    (value) =>
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0)
  );
}
