export type PaperData = {
  ROWID: number;
  paper_name: string;
  author: string[];
  /*
  year: number;
  part_no: string;
  type: string;
  manufacturer: string;
  testing_location: TestLocation;
  testing_type: Testing;
  data_type: number;
  */
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
