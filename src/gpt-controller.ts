import OpenAI from "openai";
import { GPTModel } from "./enums";
import { FileObject } from "openai/resources";
import path, { resolve } from "path";
import fs from "fs";
import { AssistantBody, ThreadMessage } from "./types";

class GPTController {
  private static client: OpenAI;
  private model: GPTModel;

  // TEMP here until full function written
  private assistantP: AssistantBody;

  constructor(model: GPTModel) {
    if (!GPTController.client) {
      GPTController.client = new OpenAI({
        apiKey: process.env.OPEN_API_KEY, // This is the default and can be omitted
      });
    }
    this.model = model;

    // TEMP here until full function written
    this.assistantP = {
      name: "Radiation Effects Researcher",
      instructions:
        "You are a radiation effects reasearcher. Use your knowledge to give very concise and numerical answers to the questions. Please do not give citations.",
      model: this.model,
      tools: [{ type: "file_search" }],
      temperature: 0.1,
    };
  }

  async StreamReq() {
    const stream = await GPTController.client.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: "Say this is a test" }],
      stream: true,
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
  }

  /*
   * Parameters:
   *  - fp: the path of the uploaded files
   * Function: Uploads the given file to the OpenAI client
   * Returns:
   *  - number: The ID of the file uploaded to OpenAI API
   */
  private async uploadFile(fp: string): Promise<string> {
    const filePath = path.resolve(fp);
    const fileStream = fs.createReadStream(filePath);

    const response = await GPTController.client.files.create({
      file: fileStream,
      purpose: "assistants",
    });

    return response.id; // Return the uploaded file ID
  }

  /*
   * Parameters:
   *  - assistantDetails: an instance of AssistantBody containing the required info to create an assistant
   * Function: Creates a new assistant
   * Returns:
   *  - OpenAI.Beta.Assistants.Assistant: The new assistant instance
   */
  private async createAssistant(
    assistantDetails: AssistantBody,
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    const assistant = await GPTController.client.beta.assistants.create(
      assistantDetails,
    );
    return assistant;
  }

  /*
   * Parameters:
   *  - threadMessage: an instance of ThreadMessage containing the required info to create a new message
   * Function: Creates a new thread with an accompanied message
   * Returns:
   *  - OpenAI.Beta.Thread: The new thread
   */
  private async createThread(
    threadMessage: ThreadMessage,
  ): Promise<OpenAI.Beta.Thread> {
    const thread = await GPTController.client.beta.threads.create({
      messages: [threadMessage],
    });
    return thread;
  }
}
