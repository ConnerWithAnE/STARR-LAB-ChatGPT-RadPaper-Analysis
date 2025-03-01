import OpenAI from "openai";
import { GPTModel } from "./enums";
import path, { resolve } from "path";
import fs from "fs";
import {
  AssistantBody,
  GPTResponse,
  ThreadMessage,
  //GPTData,
  Testing,
  TestLocation,
  FullDataType,
  ai_paper,
} from "./types";
import { questions as prompts, generalContext } from "./refined-prompts.data";
import { threadId } from "worker_threads";
import { JSONSchema } from "openai/lib/jsonschema";

export class GPTController {
  private static client: OpenAI;
  private model: GPTModel;

  constructor(model: GPTModel) {
    if (!GPTController.client) {
      GPTController.client = new OpenAI({
        apiKey: process.env.OPEN_API_KEY, // This is the default and can be omitted
      });
    }
    this.model = model;
  }

  async runGPTAnalysis(filePaths: string[]) /*: Promise<GPTResponse[]>*/ {
    const assistantParams: AssistantBody = {
      name: "Radiation Effects Researcher",
      instructions: generalContext.prompt,
      model: this.model,
      tools: [{ type: "file_search" }],
      temperature: 0.1,
    };

    const results: GPTResponse[] = [];

    const fileThreads = filePaths.map(async (filePath: string) => {
      // Pretty sure we need an assistant for each thread to keep it separated.
      const fileID = await this.uploadFile(filePath);
      let threadResults: FullDataType[] = [];
      //const loopPromises = Array.from({ length: 1 }, async (_) => {   // FOR TESTING
      const loopPromises = Array.from({ length: 3 }, async (_) => {
        const assistant = await this.createAssistant(assistantParams);

        // Start with the first prompt
        //let currentPrompt = prompts.questions.paperMetadata;
      });
    });
  }

  async getPaperMetadata() {

  }

  async test2() {
    console.log("Hit1");
    const assistantParams: AssistantBody = {
      name: "Radiation Effects Researcher",
      instructions: generalContext.prompt,
      model: this.model,
      tools: [{ type: "file_search" }],
      temperature: 0.1,
    };
    const fileID = await this.uploadFile(
      "./test/SEE_in-flight_data_for_two_static_32KB_memories_on_high_earth_orbit.pdf",
    );

    const assistant = await this.createAssistant(assistantParams);
    const thread = await this.createThread();

    const sendMessage = async (messageContent: string) => {
      const message = await GPTController.client.beta.threads.messages.create(
        thread.id,
        {
          role: "assistant",
          content: messageContent,
          attachments: [{ file_id: fileID, tools: [{ type: "file_search" }] }],
        },
      );

      if (!message || !message.id) {
        console.error("Failed to send message.");
        return null;
      }

      const run = await GPTController.client.beta.threads.runs.createAndPoll(
        thread.id,
        {
          assistant_id: assistant.id,
          response_format: { type: "json_object" },
        },
      );

      if (run.status === "completed") {
        // Retrieve messages from the thread
        const messages = await GPTController.client.beta.threads.messages.list(
          thread.id,
        );

        let lastMessage = messages.data;
        for (let i = 0; i < lastMessage.length; i++) {
          console.log(lastMessage[i].content)
        }

        if (
          lastMessage &&
          lastMessage[0].content &&
          Array.isArray(lastMessage[0].content)
        ) {
         
          const jsonResponse = lastMessage[0].content.find(
            (item) => item.type === "text",
          )?.text?.value;

          if (jsonResponse) {
            try {
              const parsedJSON = JSON.parse(jsonResponse); // 🔥 Parse JSON correctly
              console.log("Extracted JSON:", parsedJSON);
              //console.log(parsedJSON as papers);y
              console.log(jsonResponse)
              console.log(JSON.stringify(parsedJSON));
              return parsedJSON;
              
            } catch (error) {
              console.error("Error parsing JSON response:", error);
            }
          } else {
            console.error("No valid JSON response found in the message.");
          }
        } else {
          console.error("Invalid response format from OpenAI.");
        }
      }

      console.error("Message processing failed.");
      return null;
    };

    const getPaperMetadata = async() => {

    }

    sendMessage(prompts.componentDetails.prompt);
  }

  async test() {
    console.log("Hit1");
    const assistantParams: AssistantBody = {
      name: "Radiation Effects Researcher",
      instructions: generalContext.prompt,
      model: this.model,
      tools: [{ type: "file_search" }],
      temperature: 0.1,
    };
    const fileID = await this.uploadFile(
      "./test/SEE_in-flight_data_for_two_static_32KB_memories_on_high_earth_orbit.pdf",
    );

    const assistant = await this.createAssistant(assistantParams);
    const thread = await this.createThread();

    const sendMessage = async (messageContent: string) => {
      const message = await GPTController.client.beta.threads.messages.create(
        thread.id,
        {
          role: "assistant",
          content: messageContent,
          attachments: [{ file_id: fileID, tools: [{ type: "file_search" }] }],
        },
      );

      if (!message || !message.id) {
        console.error("Failed to send message.");
        return null;
      }

      const run = await GPTController.client.beta.threads.runs.createAndPoll(
        thread.id,
        {
          assistant_id: assistant.id,
          response_format: { type: "json_object" },
        },
      );

      if (run.status === "completed") {
        // Retrieve messages from the thread
        const messages = await GPTController.client.beta.threads.messages.list(
          thread.id,
        );

        let lastMessage = messages.data;

        if (
          lastMessage &&
          lastMessage[0].content &&
          Array.isArray(lastMessage[0].content)
        ) {
          const jsonResponse = lastMessage[0].content.find(
            (item) => item.type === "text",
          )?.text?.value;

          if (jsonResponse) {
            try {
              const parsedJSON = JSON.parse(jsonResponse); // 🔥 Parse JSON correctly
              console.log("Extracted JSON:", parsedJSON);
            } catch (error) {
              console.error("Error parsing JSON response:", error);
            }
          } else {
            console.error("No valid JSON response found in the message.");
          }
        } else {
          console.error("Invalid response format from OpenAI.");
        }
        if (messages && messages.data.length > 0) {
          return messages.data[0].content; // Latest message content
        }
      }

      console.error("Message processing failed.");
      return null;
    };

    //const response = await GPTController.client.beta.threads.create();
    /*
    await GPTController.client.beta.threads.messages.create(response.id, {
      role: "assistant",
      content: prompts.paperMetaData.prompt,
      attachments: [{ file_id: fileID, tools: [{ type: "file_search" }] }],
    });*/

    const threadMesasage: ThreadMessage = {
      role: "assistant",
      content: prompts.paperMetaData.prompt,
      attachments: [{ file_id: fileID, tools: [{ type: "file_search" }] }],
    };

    //const response = await GPTController.client.beta.threads.create();

    const response = await this.createThread();

    const run = await GPTController.client.beta.threads.runs.createAndPoll(
      response.id,
      {
        assistant_id: assistant.id,
        response_format: { type: "json_object" },
      },
    );

    if (run.status == "completed") {
      const messages = await GPTController.client.beta.threads.messages.list(
        run.thread_id,
      );

      const lastMessage = messages.data; // Get last message

      console.log(lastMessage[1].content);
      console.log(lastMessage[0].content);

      if (
        lastMessage &&
        lastMessage[0].content &&
        Array.isArray(lastMessage[0].content)
      ) {
        const jsonResponse = lastMessage[0].content.find(
          (item) => item.type === "text",
        )?.text?.value;

        if (jsonResponse) {
          try {
            const parsedJSON = JSON.parse(jsonResponse); // 🔥 Parse JSON correctly
            console.log("Extracted JSON:", parsedJSON);
          } catch (error) {
            console.error("Error parsing JSON response:", error);
          }
        } else {
          console.error("No valid JSON response found in the message.");
        }
      } else {
        console.error("Invalid response format from OpenAI.");
      }
    }
  }

  // Function to create and start the assistant thread
  /*
  async startAssistantThread(fileId: string, assistantId: string, prompt: { prompt: string, schema: JSONSchema }, schema: string) {
    const response = await GPTController.client.beta.threads.create();

    await GPTController.client.beta.threads.messages.create(response.id, {
      role: "assistant",
      content: prompt.prompt,
      attachments: [{ file_id: fileId, tools: [{ type: "file_search" }] }],
    })

    const run = await GPTController.client.beta.threads.runs.createAndPoll(response.id, {
      model: "gpt-4",
      assistant_id: assistantId,
      response_format: {
        type: "json_schema", json_schema: prompt.schema
        }
    });

    return response; // This will give you the response from the assistant
  }
    */

  async processPrompt(
    prompt: string,
    file_id: string,
    assistant: OpenAI.Beta.Assistants.Assistant,
  ) {
    const threadMessage: ThreadMessage = {
      role: "assistant",
      content: prompt,
      attachments: [{ file_id: file_id, tools: [{ type: "file_search" }] }],
    };
    const thread = this.createThread();
    const run = await GPTController.client.beta.threads.runs.createAndPoll(
      (
        await thread
      ).id,
      {
        assistant_id: assistant.id,
      },
    );
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
    console.log("uploadFile: ", response);
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
  private async createThread(): Promise<OpenAI.Beta.Thread> {
    const thread = await GPTController.client.beta.threads.create();
    return thread;
  }
}
