import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
import { questions } from "./refined-prompts.data";
import {
  ai_FullDataType,
  ai_GPTResponse,
  ai_paper,
  ai_part,
  PreliminaryTestData,
} from "./types";
import { GPTModel } from "./enums";
import config from "./config";

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
  /**
   * Creates an OpenAI Assistant and returns its ID.
   */
  async createAssistant(): Promise<string> {
    try {
      const assistant = await GPTController.client.beta.assistants.create({
        name: "Radiation Effects Analyzer",
        instructions:
          "Imagine you are a radiation-effects specialist for electronic components. You are well versed in the lingo, and the methodologies for testing devices. Take the paper, parse it, and then return me the data I request in the format I provide. Return in a JSON format and do not include any extra explanations",
        model: "gpt-4o",
        tools: [{ type: "file_search" }],
        temperature: 0.1,
      });

      console.log(`Assistant created! Assistant ID: ${assistant.id}`);
      return assistant.id;
    } catch (error) {
      console.error("Error creating assistant:", error);
      throw Error(
        "Unable to create assistant and no id was provided. No assistant available",
      );
    }
  }

  /**
   * Uploads a PDF file to OpenAI and returns the file ID.
   */
  async uploadPDF(filePath: string): Promise<string | null> {
    try {
      console.log("Uploading PDF to OpenAI...");

      const file = await GPTController.client.files.create({
        file: fs.createReadStream(filePath) as unknown as File,
        purpose: "assistants",
      });

      console.log(`PDF uploaded! File ID: ${file.id}`);
      return file.id;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return null;
    }
  }

  /**
   * Creates a new OpenAI thread.
   */
  async createThread(): Promise<string> {
    try {
      const thread = await GPTController.client.beta.threads.create();
      console.log(`Thread created! Thread ID: ${thread.id}`);
      return thread.id;
    } catch (error) {
      console.error("Error creating thread:", error);
      throw Error("Failed to create thread");
    }
  }

  /**
   * Adds a message to the OpenAI thread.
   */
  async addMessage(
    threadId: string,
    fileId: string,
    prompt: string,
  ): Promise<void> {
    try {
      await GPTController.client.beta.threads.messages.create(threadId, {
        role: "user",
        content: prompt,
        attachments: [
          {
            file_id: fileId,
            tools: [{ type: "file_search" }],
          },
        ],
      });
    } catch (error) {
      console.error("Error adding message:", error);
    }
  }

  async deleteThread(threadId: string): Promise<void> {
    try {
      await GPTController.client.beta.threads.del(threadId);
      console.log(`Thread deleted: ${threadId}`);
    } catch (error) {
      console.log(`Error deleting thread ${threadId}:`, error);
    }
  }

  /**
   * Runs the thread and waits for a response.
   */
  async runThread(threadId: string, assistantId: string): Promise<any> {
    try {
      const run = await GPTController.client.beta.threads.runs.create(
        threadId,
        {
          assistant_id: assistantId,
          response_format: { type: "json_object" },
        },
      );

      console.log(`Running thread... (Run ID: ${run.id})`);

      // Poll for completion
      //process.stdout.write("Waiting for completion...");
      while (true) {
        const runStatus = await GPTController.client.beta.threads.runs.retrieve(
          threadId,
          run.id,
        );
        if (runStatus.status === "completed") break;
        if (["failed", "expired", "cancelled"].includes(runStatus.status)) {
          console.error(`Run failed with status: ${runStatus.status}`);
          return null;
        }

        //process.stdout.write(".");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      }

      const messages = await GPTController.client.beta.threads.messages.list(
        threadId,
      );
      const assistantMessages = messages.data.filter(
        (msg) => msg.role === "assistant",
      );

      if (!assistantMessages.length) {
        console.error("No assistant messages found.");
        return null;
      }

      let extractedData: any = null;

      for (const contentItem of assistantMessages[0].content || []) {
        if (contentItem.type === "text") {
          try {
            let textValue = contentItem.text.value.trim();
            if (textValue.includes("```json")) {
              textValue = textValue
                .replace(/^```json\s*/, "")
                .replace(/```$/, "");
            }
            extractedData = JSON.parse(textValue);
            break;
          } catch (error) {
            console.error("Failed to parse JSON response:", error);
          }
        }
      }

      return extractedData ?? null;
    } catch (error) {
      console.error("Error running thread:", error);
      return null;
    }
  }

  //Data Functions

  /**
   *
   * Adds a message to the ChatGPT thread and runs it.
   * This collects all of the paper metadata
   *
   * Parameters are given in a named object form
   *
   * @param assistantId the id of the chatgpt assistant to use
   * @param fileId the id of the file to search (file must have been already uploaded)
   * @param threadId the id of the thread to run (must already exist)
   * @returns a promise containing an ai_paper object, fully populated
   */
  async getPaperData({
    assistantId,
    fileId,
    threadId,
  }: {
    assistantId: string;
    fileId: string;
    threadId: string;
  }): Promise<ai_paper> {
    await this.addMessage(threadId, fileId, questions.paperMetaData.prompt);
    console.log(
      `Getting Paper Data for File ID: ${fileId} (Thread ID: ${threadId})`,
    );
    const papermetdata_json = await this.runThread(threadId, assistantId);
    const paperObject = papermetdata_json as ai_paper;
    console.log(
      `Paper data for File ID: ${fileId} completed (Thread ID: ${threadId})`,
    );
    return paperObject;
  }

  /**
   *
   * Gets the initia part data and returns it as a list of Partial<ai_part> objects.
   * These contain info like the part name, type and manufacturer
   *
   * Parameters are given in a named object form
   *
   * @param assistantId the id of the chatgpt assistant to use
   * @param fileId the id of the file to search (file must have been already uploaded)
   * @param threadId the id of the thread to run (must already exist)
   * @returns a promise containing a list of  Partial<ai_part> objects.
   * These contain the initial part metadata like name and manufacturer
   */
  async getPartData({
    assistantId,
    fileId,
    threadId,
  }: {
    assistantId: string;
    fileId: string;
    threadId: string;
  }): Promise<Partial<ai_part>[]> {
    await this.addMessage(threadId, fileId, questions.componentDetails.prompt);
    console.log(
      `Getting Part Data for File ID: ${fileId} (Thread ID: ${threadId})`,
    );
    const partdata_json = await this.runThread(threadId, assistantId);
    console.log(partdata_json);
    const partObjects = partdata_json.map((part: any) => {
      return part as Partial<ai_part>;
    });
    console.log(
      `Part data for File ID: ${fileId} completed (Thread ID: ${threadId})`,
    );
    return partObjects;
  }

  /**
   *
   * Parameters are given in a named object form
   *
   * @param assistantId the id of the chatgpt assistant to use
   * @param fileId the id of the file to search (file must have been already uploaded)
   * @param threadId the id of the thread to run (must already exist)
   * @param parts the list of Partial<ai_part> objects to run the tests against
   * @returns
   */
  async getPartTests({
    assistantId,
    fileId,
    threadId,
    parts,
  }: {
    assistantId: string;
    fileId: string;
    threadId: string;
    parts: Partial<ai_part>[];
  }): Promise<ai_part[]> {
    const partTests: ai_part[] = [];
    for (const part of parts) {
      await this.addMessage(
        threadId,
        fileId,
        `You are to only look for data related to this part ${part!.name}, ${
          questions.testingConditions.prompt
        }`,
      );
      console.log(
        `Getting Prelim data for part ${part.name} File ID: ${fileId} (Thread ID: ${threadId})`,
      );
      const partRun = await this.runThread(threadId, assistantId);
      console.log(partRun);
      partTests.push({
        ...part,
        preliminary_test_types: partRun.map((data: string) => data),
        seeData: [],
        tidData: [],
        ddData: [],
      } as ai_part);
    }
    console.log(
      `Prelim Part Data for File ID: ${fileId} completed (Thread ID: ${threadId})`,
    );
    return partTests;
  }

  /**
   *
   * Get the test results related to specific tests
   * i.e. SEE, TID, or DD
   *
   *
   * Parameters are given in a named object form
   *
   * @param assistantId the id of the chatgpt assistant to use
   * @param fileId the id of the file to search (file must have been already uploaded)
   * @param threadId the id of the thread to run (must already exist)
   * @param parts the list of ai_part objects to run the tests against
   * @returns a list of completed ai_parts
   */
  async getSpecificTest({
    assistantId,
    fileId,
    threadId,
    parts,
  }: {
    assistantId: string;
    fileId: string;
    threadId: string;
    parts: ai_part[];
  }): Promise<ai_part[]> {
    for (const part of parts) {
      for (const test of part.preliminary_test_types) {
        if (test === "SEE") {
          await this.addMessage(
            threadId,
            fileId,
            `You are to only look for data related to this part ${part.name}, ${questions.seeData.prompt}`,
          );
          console.log(
            `Getting Specifc Data for Part ${part.name} File ID: ${fileId} (Thread ID: ${threadId})`,
          );
          part.sees.push(await this.runThread(threadId, assistantId));
        } else if (test === "TID") {
          await this.addMessage(
            threadId,
            fileId,
            `You are to only look for data related to this part ${part.name}, ${questions.tidData.prompt}`,
          );
          part.tids.push(await this.runThread(threadId, assistantId));
        } else if (test === "DD") {
          await this.addMessage(
            threadId,
            fileId,
            `You are to only look for data related to this part ${part.name}, ${questions.ddData.prompt}`,
          );
          part.dds.push(await this.runThread(threadId, assistantId));
        } else {
          console.log("Passing", test);
        }
      }
    }
    console.log(
      `Specific data for File ID: ${fileId} completed (Thread ID: ${threadId})`,
    );
    return parts;
  }

  /**
   * Gets any tables and figures from the paper.
   * This can be good to try and stimulate answers related to the figures
   *
   * Parameters are given in a named object form
   *
   * @param assistantId the id of the chatgpt assistant to use
   * @param fileId the id of the file to search (file must have been already uploaded)
   * @param threadId the id of the thread to run (must already exist)
   * @returns
   */
  async getTablesAndFigures({
    assistantId,
    fileId,
    threadId,
  }: {
    assistantId: string;
    fileId: string;
    threadId: string;
  }) {
    await this.addMessage(
      threadId,
      fileId,
      "Extract any relevant tables or \
            figures from the paper that relate to radiation effects. There \
            are some tables which show the values of cross sections, get \
            those values. Return this as a JSON string. Return only valid \
            JSON with no extra text.",
    );
    const tfRun = await this.runThread(threadId, assistantId);
    return tfRun;
  }

  /**
   *
   * Function to process a single paper and save the data to
   * a JSON file
   *
   * @param pdfPath the local path of the pdf to process
   * @returns void
   */
  async processRadiationPaper(pdfPath: string) {
    //const assistantId = await createAssistant();
    //if (!assistantId) return;

    const assistantId = "asst_4Gu8RhmCQSw5ojiYRaQp5sZ0";

    const fileId = await this.uploadPDF(pdfPath);
    if (!fileId) return;

    const threadId = await this.createThread();
    if (!threadId) return;
    const ids = { assistantId, fileId, threadId };
    const papersData = await this.getPaperData({ ...ids });
    if (config.RunTables) {
      const tbfgs = await this.getTablesAndFigures({ ...ids });
    }
    const partData = await this.getSpecificTest({
      ...ids,
      parts: await this.getPartTests({
        ...ids,
        parts: await this.getPartData({ ...ids }),
      }),
    });

    await this.deleteThread(threadId);

    console.log(
      "Extracted Data:",
      JSON.stringify({ paper: papersData, parts: partData }, null, 2),
    );

    console.log("Running thread to process all queries...");
    const outputFile = pdfPath.replace(".pdf", "_extracted.json");
    fs.writeFileSync(
      outputFile,
      JSON.stringify({ paper: papersData, parts: partData }, null, 4),
    );

    console.log(`Extraction complete! Data saved to ${outputFile}`);
  }

  /**
   *
   *
   *
   * @param assistantId the id of the chatgpt assistant to use (must exist)
   * @param fileId the id of the file to search (file must have been already uploaded)
   * @returns an instance of ai_FullDataType containing a fully extracted paper
   */
  async processPaper(
    fileId: string,
    assistantId: string,
  ): Promise<ai_FullDataType> {
    const threadId = await this.createThread();

    const ids = { assistantId, fileId, threadId };

    // Getting paper data
    const papersData = await this.getPaperData({ ...ids });

    // Getting the Part, Prelim and Specific data and passing them as arguments
    const partData = await this.getSpecificTest({
      ...ids,
      parts: await this.getPartTests({
        ...ids,
        parts: await this.getPartData({ ...ids }),
      }),
    });

    // Attempt to delete the thread, sometimes it doesn't work?
    // It will say the thread doesn't exist, idfk lol
    try {
      await this.deleteThread(threadId);
    } catch {
      console;
    }

    const final = { ...papersData, parts: partData } as ai_FullDataType;

    console.log(`File: ${fileId} pass completed`);

    return final;
  }

  /**
   *
   * Processes a list of pdfs using their local paths. Will upload the pdfs
   * to the OpenAI api and then run each paper through the processPaper()
   * function 3 times. The results are then packaged and returned
   *
   * @param pdfPaths a list of pdf paths to run through GPT
   * @param assistant_id OPTIONALLY pass an id for an existing assistant
   * @returns A list of ai_GPTResponse objects populated with the extracted data
   */
  async processRadiationPapers(pdfPaths: string[], assistant_id?: string) {
    // Create a new assistant if one is not given
    let assistantId = assistant_id ?? (await this.createAssistant());
    const fileIDs = await Promise.all(
      pdfPaths.map(async (path: string) => {
        const fileId = await this.uploadPDF(path);
        if (!fileId) {
          console.error(
            `File ${path.split("/").pop() || ""} FAILED to upload. Skipping`,
          );
          return `ERROR - Filename: ${path.split("/").pop() || ""}`;
        } else {
          return fileId;
        }
      }),
    );
    const paperObjects = await Promise.all(
      fileIDs.map(async (fileId: string) => {
        if (!fileId.includes("ERROR")) {
          const passes: ai_FullDataType[] = await Promise.all(
            Array.from({ length: 3 }).map(() => {
              return this.processPaper(fileId, assistantId);
            }),
          );
          return {
            pass_1: passes[0],
            pass_2: passes[1],
            pass_3: passes[2],
          } as ai_GPTResponse;
        }
      }),
    );

    return paperObjects;
  }
}
