export type PaperData = {
    id: number;
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
}

export type GPTResponse = {
  pass_1: GPTData,
  pass_2: GPTData,
  pass_3: GPTData
}

export type TestLocation = "Terrestrial" | "Flight";

// Type to ensure testing types are consistent
export type Testing = "SEE" | "TID" | "DD" | "OTHER";
