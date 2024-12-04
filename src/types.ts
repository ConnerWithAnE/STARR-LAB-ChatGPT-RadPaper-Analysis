// TODO: Add proper values to data types

import OpenAI from "openai";
import { GPTModel } from "./enums";

export type GetQuery = {
  paper_name?: string;
  author?: string;
  part_no?: string;
  type?: string;
  manufacturer?: string;
  testing_location?: TestLocation;
  testing_type?: Testing;
  data_type?: number;
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

export type RadData = {
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

export type AssistantBody = {
  name: string;
  description?: string;
  instructions: string;
  model: GPTModel;
  tools: OpenAI.Beta.Assistants.AssistantTool[];
  temperature: number;
  response_format?: OpenAI.Beta.Threads.AssistantResponseFormatOption;
};

export type GPTData = {
  paper_name: string;
  year: number;
  author: string[];
  part_no: string;
  type: string[];
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

export type ThreadMessage = {
  role: "user" | "assistant";
  content: string;
  attachments: OpenAI.Beta.Threads.ThreadCreateParams.Message.Attachment[];
};

// Type of testing done
export type TestLocation = "Terrestrial" | "Flight";

// Type to ensure testing types are consistent
export type Testing = "SEE" | "TID" | "DD" | "OTHER";

export type ROWID = { ROWID: number };
