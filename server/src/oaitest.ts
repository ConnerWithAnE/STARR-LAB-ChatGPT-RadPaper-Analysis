import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
import { questions } from "./refined-prompts.data";
import {
  ai_paper,
  ai_part,
  ai_author,
  FullDataType,
  PartData,
  AuthorData,
  PreliminaryTestData,
} from "./types";
import { Author } from "./models";

dotenv.config(); // Load environment variables

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

/**
 * Creates an OpenAI Assistant and returns its ID.
 */
async function createAssistant(): Promise<string | null> {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Radiation Effects Analyzer",
      instructions:
        "Imagine you are a radiation-effects specialist for electronic components. You are well versed in the lingo, and the methodologies for testing devices. Take the paper, parse it, and then return me the data I request in the format I provide. Return in a JSON format and do not include any extra explanations",
      model: "gpt-4o",
      tools: [{ type: "file_search" }], // ✅ Explicitly define file processing capability
      temperature: 0.15,
    });

    console.log(`✅ Assistant created! Assistant ID: ${assistant.id}`);
    return assistant.id;
  } catch (error) {
    console.error("❌ Error creating assistant:", error);
    return null;
  }
}

/**
 * Uploads a PDF file to OpenAI and returns the file ID.
 */
async function uploadPDF(filePath: string): Promise<string | null> {
  try {
    console.log("📤 Uploading PDF to OpenAI...");

    const file = await openai.files.create({
      file: fs.createReadStream(filePath) as unknown as File,
      purpose: "assistants",
    });

    console.log(`✅ PDF uploaded! File ID: ${file.id}`);
    return file.id;
  } catch (error) {
    console.error("❌ Error uploading PDF:", error);
    return null;
  }
}

/**
 * Creates a new OpenAI thread.
 */
async function createThread(): Promise<string | null> {
  try {
    const thread = await openai.beta.threads.create();
    console.log(`✅ Thread created! Thread ID: ${thread.id}`);
    return thread.id;
  } catch (error) {
    console.error("❌ Error creating thread:", error);
    return null;
  }
}

/**
 * Adds a message to the OpenAI thread.
 */
async function addMessage(
  threadId: string,
  fileId: string,
  prompt: string,
): Promise<void> {
  try {
    await openai.beta.threads.messages.create(threadId, {
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
    console.error("❌ Error adding message:", error);
  }
}

async function deleteThread(threadId: string): Promise<void> {
  try {
    await openai.beta.threads.del(threadId);
    console.log(`🗑️ Thread deleted: ${threadId}`);
  } catch (error) {
    console.error(`❌ Error deleting thread ${threadId}:`, error);
  }
}

/**
 * Runs the thread and waits for a response.
 */
async function runThread(threadId: string, assistantId: string): Promise<any> {
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      response_format: { type: "json_object" }, // ✅ Force OpenAI to return JSON
    });

    console.log(`⏳ Running thread... (Run ID: ${run.id})`);

    // Poll for completion
    while (true) {
      const runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id,
      );
      if (runStatus.status === "completed") break;
      if (["failed", "expired", "cancelled"].includes(runStatus.status)) {
        console.error(`❌ Run failed with status: ${runStatus.status}`);
        return null;
      }

      console.log("🔄 Waiting for completion...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
    }

    // Retrieve the assistant’s response
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessages = messages.data.filter(
      (msg) => msg.role === "assistant",
    );

    let extractedData: Record<string, any> = {};
    //assistantMessages.forEach(msg => {
    console.log(assistantMessages);
    if (Array.isArray(assistantMessages[0].content)) {
      assistantMessages[0].content.forEach((contentItem) => {
        if (contentItem.type === "text") {
          try {
            if (contentItem.text.value.includes("```json")) {
              contentItem.text.value = contentItem.text.value.trim();
              contentItem.text.value = contentItem.text.value
                .replace(/^```json\s*/, "")
                .replace(/```$/, "");
            }
            console.log(contentItem);
            extractedData = JSON.parse(contentItem.text.value); // ✅ Parse JSON
            console.log(extractedData);
          } catch (error) {
            console.error("⚠️ Failed to parse JSON response:", error);
          }
        }
      });
    }

    return extractedData;
  } catch (error) {
    console.error("❌ Error running thread:", error);
    return null;
  }
}

//Data Functions

/**
 *
 * @param assistantId
 * @param fileId
 * @param threadId
 * @returns
 */
async function getPaperData(
  assistantId: string,
  fileId: string,
  threadId: string,
): Promise<ai_paper> {
  await addMessage(threadId, fileId, questions.paperMetaData.prompt);
  const papermetdata_json = await runThread(threadId, assistantId);
  const paperObject = papermetdata_json as ai_paper;
  return paperObject;
}

/**
 *
 * @param assistantId
 * @param fileId
 * @param threadId
 * @returns
 */
async function getPartData(
  assistantId: string,
  fileId: string,
  threadId: string,
): Promise<ai_part[]> {
  await addMessage(threadId, fileId, questions.componentDetails.prompt);
  const partdata_json = await runThread(threadId, assistantId);
  const partObjects = partdata_json.map((part: any) => {
    return part as ai_part;
  });
  return partObjects;
}

/**
 *
 * @param assistantId
 * @param fileId
 * @param threadId
 * @param parts
 * @returns
 */
async function getPartTests(
  assistantId: string,
  fileId: string,
  threadId: string,
  parts: ai_part[],
): Promise<PreliminaryTestData[]> {
  const partTests: PreliminaryTestData[] = [];
  for (const part of parts) {
    await addMessage(
      threadId,
      fileId,
      `You are to only look for data related to this part ${part.device_name}, ${questions.testingConditions.prompt}`,
    );
    const partRun = await runThread(threadId, assistantId);
    partTests.push(partRun as PreliminaryTestData);
  }
  return partTests;
}

async function getSpecificTest(
  assistantId: string,
  fileId: string,
  threadId: string,
  partTests: PreliminaryTestData[],
) {
  let partSpecific: {
    SEE: any[];
    TID: any[];
    DD: any[];
  } = {
    SEE: [],
    TID: [],
    DD: [],
  };
  for (const test of partTests) {
    if (test.testing_type === "SEE") {
      await addMessage(
        threadId,
        fileId,
        `You are to only look for data related to this part ${test.device_name}, ${questions.seeData.prompt}`,
      );
      partSpecific.SEE.push(await runThread(threadId, assistantId));
    } else if (test.testing_type === "TID") {
      await addMessage(
        threadId,
        fileId,
        `You are to only look for data related to this part ${test.device_name}, ${questions.tidData.prompt}`,
      );
      partSpecific.TID.push(await runThread(threadId, assistantId));
    } else if (test.testing_type === "DD") {
      await addMessage(
        threadId,
        fileId,
        `You are to only look for data related to this part ${test.device_name}, ${questions.ddData.prompt}`,
      );
      partSpecific.DD.push(await runThread(threadId, assistantId));
    } else {
      console.log("Passing", test.testing_type);
    }
  }
  return partSpecific;
}

async function getTablesAndFigures(
  assistantId: string,
  fileId: string,
  threadId: string,
) {
  await addMessage(
    threadId,
    fileId,
    "Extract any relevant tables or \
            figures from the paper that relate to radiation effects. There \
            are some tables which show the values of cross sections, get \
            those values. Return this as a JSON string. Return only valid \
            JSON with no extra text.",
  );
  const tfRun = await runThread(threadId, assistantId);
  return tfRun;
}

/**
 * Main function to process a PDF using OpenAI Threads.
 */
export async function processRadiationPaper(pdfPath: string) {
  //const assistantId = await createAssistant();
  //if (!assistantId) return;

  const assistantId = "asst_4Gu8RhmCQSw5ojiYRaQp5sZ0";

  const fileId = await uploadPDF(pdfPath);
  if (!fileId) return;

  const threadId = await createThread();
  if (!threadId) return;

  console.log("Getting Paper Data\n");
  //await addMessage(threadId, fileId, questions.paperMetaData.prompt);
  //const papermetdata_json = await runThread(threadId, assistantId);
  const papersData = await getPaperData(assistantId, fileId, threadId);
  console.log("Getting Part Data\n");
  const partData = await getPartData(assistantId, fileId, threadId);

  console.log("Getting Table and Figure Data");
  const figureTableData = await getTablesAndFigures(
    assistantId,
    fileId,
    threadId,
  );

  console.log("Getting Part Test");
  const partTestData = await getPartTests(
    assistantId,
    fileId,
    threadId,
    partData,
  );

  console.log("Getting specific part tests");
  const specificTestData = await getSpecificTest(
    assistantId,
    fileId,
    threadId,
    partTestData,
  );

  const fullData: FullDataType = {
    name: papersData.paper_name,
    year: papersData.year,
    authors: papersData.authors.map((author) => author as AuthorData),
    parts: partData.map((part) => part as PartData),
    testingData: partTestData.map((test) => ({
      id: test.id,
      testing_type: test.testing_type,
      max_fluence: test.max_fluence,
      energy: test.energy,
      facility: test.facility,
      environment: test.environment,
      terrestrial: test.terrestrial,
      flight: test.flight,
      // Adding specific test data
      tidData: test.tidData,
      seeData: test.seeData,
      ddData: test.ddData,
    })),
  };

  await deleteThread(threadId);

  console.log("🔍 Extracted Data:", JSON.stringify(fullData, null, 2));

  console.log("🚀 Running thread to process all queries...");

  // ✅ Correctly write structured JSON data
  const outputFile = pdfPath.replace(".pdf", "_extracted.json");
  fs.writeFileSync(outputFile, JSON.stringify(fullData, null, 4));

  console.log(`✅ Extraction complete! Data saved to ${outputFile}`);
}

/*
async function processRadiationPapers(pdfPaths: string[], assistant_id?: string) {\
    // Create a new assistant if one is not given
  let assistantId = assistant_id ?? await createAssistant();
  const fileIDs = await Promise.all(
    pdfPaths.map(async (path: string) => await uploadPDF(path)),
  );

  await Promise.all(fileIDs.map((fileId) => {

  }))

}
  */
