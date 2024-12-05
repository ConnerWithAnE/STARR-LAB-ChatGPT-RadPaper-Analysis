import OpenAI from "openai";
import { GPTModel } from "./enums";
import { FileObject } from "openai/resources";
import path, { resolve } from "path";
import fs from "fs";
import { AssistantBody, GPTResponse, ThreadMessage, GPTData, Testing, TestLocation } from "./types";
import { prompt, questions } from "./prompts.data";
import { threadId } from "worker_threads";

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

  async runGPTAnalysis(filePaths: string[]): Promise<GPTResponse[]> {
    const assistantParams: AssistantBody = {
      name: "Radiation Effects Researcher",
      instructions:
        "You are a radiation effects reasearcher. Use your knowledge to give very concise and numerical answers to the questions. Please do not give citations.",
      model: this.model,
      tools: [{ type: "file_search" }],
      temperature: 0.1,
    };

    // Perhaps this should be pulled out to another function
    const results: GPTResponse[] = [];

    // Upload files and create threads concurrently
    const fileThreads = filePaths.map(async (filePath: string) => {
      // Pretty sure we need an assistant for each thread to keep it separated.
      const fileID = await this.uploadFile(filePath);
      const threadMessage: ThreadMessage = {
        role: "assistant",
        content: prompt + questions,
        attachments: [{ file_id: fileID, tools: [{ type: "file_search" }] }],
      };
      //console.log(`Thread Message: ${threadMessage}`)
      // Create the three threads for each paper
      let threadResults: GPTData[] = [];
      const loopPromises = Array.from({ length: 3 }, async (_) => {
        const assistant = await this.createAssistant(assistantParams);
        const thread = await this.createThread(threadMessage);
        // Run the assistant on the thread and get the prompt results. Think non-stream results are better?
        let run = await GPTController.client.beta.threads.runs.createAndPoll(
          thread.id,
          {
            assistant_id: assistant.id,
          },
        );
        var result = "";
        if (run.status == "completed") {
          const messages =
            await GPTController.client.beta.threads.messages.list(
              run.thread_id,
            );
          var n = 1;
          for (const message of messages.data.reverse()) {
            // Need to check if the message content is text before parsing it
            if (message.content[0].type == "text") {
              result = message.content[0].text.value;
              var resvalues: GPTData = {    // Initialize GPT data object
                paper_name: "",
                year: 0,
                author: [],
                part_no: "",
                type: [],
                manufacturer: "",
                testing_location: "Terrestrial",
                testing_type: "TID",
                data_type: 0
              }
              // Every second message has the data values
              if(n % 2 == 0) {
                // console.log(`${message.role} > ${result}`);
                let preres = result.split("ø").map((s) => s.replace("\n", ""));
                // console.log(preres)
                resvalues = {
                  paper_name: preres[0],
                  year: parseInt(preres[1]),
                  author: preres[2].split(","),
                  part_no: preres[3],
                  type: preres[4].split("¶"),
                  manufacturer: preres[5],
                  testing_location: <TestLocation>preres[6],
                  testing_type: <Testing>preres[7],     // TODO: this gives a list ("TID, TID, DD") sometimes so the cast may fail
                  data_type: 0    // TODO: add a prompt to get data_type
                };
                console.log(resvalues)
                threadResults.push(resvalues);
              }
              n++;
            }
          }
        } else {
          console.log(run.status);
        }
      });

      // Wait for all loop iterations to finish
      await Promise.all(loopPromises);

      const threadFinal: GPTResponse = {
        pass_1: threadResults[0],
        pass_2: threadResults[1],
        pass_3: threadResults[2],
      };

      //console.log(threadFinal)
      results.push(threadFinal);

      // TODO: Need to add the stream and and return it, not working yet.
      // Will be uncommented to implement

      /*
      const stream = await GPTController.client.beta.threads.runs.create(
        thread.id, 
        {assistant_id: assistant.id, stream: true}

      )

      let response = '';
      for await (const chunk of stream) {
        response += chunk.choices[0]?.delta?.content || "";
      }
      */
    });

    await Promise.all(fileThreads);
    return results;
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
  private async createThread(
    threadMessage: ThreadMessage,
  ): Promise<OpenAI.Beta.Thread> {
    const thread = await GPTController.client.beta.threads.create({
      messages: [threadMessage],
    });
    return thread;
  }
}