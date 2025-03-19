// TODO: Add proper values to data types

import OpenAI from "openai";
import { GPTModel } from "./enums";

export type AuthorData = {
  id?: number;
  name: string;
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

export type InsertData = {
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

export type TableData = {
  ROWID: number;
  paper_name: string;
  year: number;
  author: string[];
  part_no: string;
  type: string;
  manufacturer: string;
  testing_location: TestLocation;
  testing_type: string;
  data_type: number;
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

// AI types
export type ai_author = {
  name: string;
};

// Type for adding a new paper
export type PaperData = {
  id: number;
  name: string;
  year: number;
};

export type ai_GPTResponse = {
  pass_1: ai_FullDataType;
  pass_2: ai_FullDataType;
  pass_3: ai_FullDataType;
}

export type ai_FullDataType = {
  id?: number;
  name: string;
  year: number;
  authors: ai_author[];
  objective: string;
  parts: ai_part[];
}

export type ai_paper = {
  id?: number;
  name: string;
  year: number;
  authors: ai_author[];
  objective: string;
};

export type ai_part = {
  id?: number;
  name: string; // device name
  type: string; // component type
  manufacturer: string;
  other_details: string;
  preliminary_test_types: PreliminaryTestType[];
  tidData: TIDDataType[];
  seeData: SEEDataType[];
  ddData: DDDataType[];
};

export type PreliminaryTestType = "SEE" | "TID" | "DD" | string;

export type PreliminaryTestData = {
  testing_type: "SEE" | "TID" | "DD" | null;
  tidData: TIDDataType[];
  seeData: SEEDataType[];
  ddData: DDDataType[];
};

export type TIDDataType = {
  id: number;
  max_fluence?: number;
  source: "Co60" | "Protons" | "Electrons" | "Heavy ions" | "X-rays" | "Pions";
  max_tid: number;
  energy_levels: number;
  facility_name: string;
  environmental_conditions: string;
  terrestrial: boolean;
  flight: boolean;
  dose_rate: number;
  eldrs: boolean;
  dose_to_failure: number;
  increased_power_usage: boolean;
  power_usage_description: string;
  failing_time: string;
  special_notes?: string;
};

export type SEEDataType = {
  id: number;
  max_fluence?: number;
  energy_levels: number;
  facility_name: string;
  environmental_conditions: string;
  terrestrial: boolean;
  flight: boolean;
  source:
    | "Heavy ions"
    | "Protons"
    | "Laser"
    | "Neutron"
    | "Electron"
    | "X-rays";
  type: string;
  amplitude: number;
  duration: number;
  cross_section_saturation: number;
  cross_section_threshold: number;
  cross_section_type: string;
  special_notes?: string;
};

export type DDDataType = {
  id: number;
  max_fluence?: number;
  energy_levels: number;
  facility_name: string;
  environmental_conditions: string;
  flight: boolean;
  source: "Protons" | "Neutrons";
  damage_level: number;
  damage_level_description: string;
  special_notes?: string;
};

// Type for adding a new part
export type PartData = {
  id?: number;
  device_name: string;
  component_type: string;
  manufacturer: string;
  other_details: string;
};

// Type for adding testing data
export type TestData = {
  id: number;
  testing_type: Testing;
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

// Type to ensure testing types are consistent
export type Testing = "SEE" | "TID" | "DD";



export type PaperWithRelations = PaperData & {
  Authors?: AuthorData[];
  Parts?: PartData[];
  TestingData?: TestData[];
};

export type FullDataType = {
  id?: number;
  name: string;
  year: number;
  authors: AuthorData[];
  parts: PartData[];
  testingData: TestData[];
};

// Type of testing done
export type TestLocation = "Terrestrial" | "Flight";

// Type for querying papers
export type GetQuery = {
  name?: string;
  year?: number;
  author?: string;
  part_number?: string;
  type?: string;
  manufacturer?: string;
  testing_location?: TestLocation;
  testing_type?: Testing;
};

export type AssistantBody = {
  name: string;
  description?: string;
  instructions: string;
  model: GPTModel;
  tools: OpenAI.Beta.Assistants.AssistantTool[];
  temperature: number;
  response_format?: OpenAI.Beta.Threads.AssistantResponseFormatOption;
};

// export type GPTData = {
//   paper_name: string;
//   year: number;
//   author: string[];
//   part_no: string;
//   type: string;
//   manufacturer: string;
//   testing_location: TestLocation;
//   testing_type: Testing;
//   data_type: number;
// };
/*
export type GPTResponse = {
  pass_1: FullDataType;
  pass_2: FullDataType;
  pass_3: FullDataType;
};
*/

export type GPTResponse = {
  pass_1: GPTData;
  pass_2: GPTData;
  pass_3: GPTData;
};

export type ThreadMessage = {
  role: "user" | "assistant";
  content: string;
  attachments: OpenAI.Beta.Threads.ThreadCreateParams.Message.Attachment[];
};
