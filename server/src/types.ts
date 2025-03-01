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

export type ai_paper = {
  id?: number;
  paper_name: string;
  year: number;
  authors: ai_author[];
};

export type ai_part = {
  id?: number;
  device_name: string;
  component_type: string;
  manufacturer: string;
  other_details: string;
  preliminary_test_data: PreliminaryTestData[];
};

// Type for adding a new paper
export type PaperData = {
  id: number;
  name: string;
  year: number;
};

export type PreliminaryTestData = {
  testing_type: "SEE" | "TID" | "DD" | null;
  max_fluence: number;
  energy_levels: string;
  facility_name: string;
  environmental_conditions: string;
  terrestrial: boolean;
  in_flight: boolean;
  tidData: TIDDataType[];
  seeData: SEEDataType[];
  ddData: DDDataType[];
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

export type TIDDataType = {
  id: number;
  source: "Co60" | "Protons" | "Electrons" | "Heavy ions" | "X-rays" | "Pions";
  max_tid: number;
  dose_rate: number;
  eldrs: boolean;
  dose_to_failure: number;
  increased_power_usage: boolean;
  power_usage_description: string;
  special_notes?: string;
};

export type SEEDataType = {
  id: number;
  source:
    | "Heavy ions"
    | "Protons"
    | "Laser"
    | "Neutron"
    | "Electron"
    | "X-rays";
  see_type: string;
  /*
    | "Single Event Upset"
    | "Single Event Transient"
    | "Single Event Functional Interrupt"
    | "Single Event Latch-up"
    | "Single Event Burnout"
    | "Single Event Gate Rupture";
SEU, SEDR, SET, SEFI, SEL, SEB, SEGR, MBU, SES, SEJ, SED, SEBID, SEHE, SEN, SEPH, SECD, SEICS, SEIPC, SEITR, SECL, SECS, SECC, SETV, SEM, SEF, SEPC, SEA. SETR, SEPF, SEQT, SESD
*/
  amplitude: number;
  duration: number;
  cross_section_saturation: number;
  cross_section_threshold: number;
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
