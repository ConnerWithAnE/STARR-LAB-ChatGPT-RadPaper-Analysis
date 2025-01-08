import { GetQuery, InsertData, RadData } from "../src/types";

import { GPTController } from "../src/gpt-controller";
import { GPTModel } from "../src/enums";
import fs from "fs";
import dotenv from "dotenv";
import path, { resolve } from "path";

async function initializeGPT(): Promise<GPTController> {
  return new GPTController(GPTModel.GPT3_5Turbo);
}

let testGPT: GPTController;

// Initialize the database once before all tests
beforeAll(async () => {
  dotenv.config();
  testGPT = await initializeGPT();
});

/**********
 *  TODO
 * Finish unit testing (using jest)
 ***********/

test("Insertion of a paper with one author", async () => {
  const paper: string = path.resolve(
    __dirname,
    "./testfiles/Radiation_Test_Dummy_File.pdf"
  );
  fs.readFileSync(paper);

  await expect(testGPT.runGPTAnalysis([paper])).resolves.not.toThrow();
}, 60000);

// test('Insertion of a paper with five authors', async () => {
//   const paper: string = path.resolve(__dirname, 
//     './testfiles/SEE_in-flight_data_for_two_static_32KB_memories_on_high_earth_orbit.pdf');
//   fs.readFileSync(paper);

//   await expect(testGPT.runGPTAnalysis([paper])).resolves.not.toThrow();
// }, 60000);

// Below gpt tests commented out to reduce token usage during testing

// test('Insertion of a paper with two authors', async () => {
//   const paper: string = path.resolve(__dirname, 
//     './testfiles/Solar_flare_proton_environment_for_estimating_downtime_of_spacecraft_CCDs.pdf');
//   fs.readFileSync(paper);

//   await expect(testGPT.runGPTAnalysis([paper])).resolves.not.toThrow();
// }, 60000);

// test('Insertion of a paper with three authors. 1 of 2', async () => {
//   const paper: string = path.resolve(__dirname, 
//     './testfiles/A_radiation_tolerant_video_camera_for_high_total_dose_environments.pdf');
//   fs.readFileSync(paper);

//   await expect(testGPT.runGPTAnalysis([paper])).resolves.not.toThrow();
// }, 60000);

// test('Insertion of a paper with three authors. 2 of 2', async () => {
//   const paper: string = path.resolve(__dirname, 
//     './testfiles/Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf');
//   fs.readFileSync(paper);

//   await expect(testGPT.runGPTAnalysis([paper])).resolves.not.toThrow();
// }, 60000);