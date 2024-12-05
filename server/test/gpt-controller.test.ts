import { GetQuery, InsertData, RadData } from '../src/types';

import { GPTController } from '../src/gpt-controller';
import { GPTModel } from '../src/enums';
import fs from 'fs';
import dotenv from 'dotenv';
import path, { resolve } from 'path';

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

test('Insertion of a paper with one author', async () => {
  const paper: string = path.resolve(__dirname, 
    './testfiles/SEE_in-flight_data_for_two_static_32KB_memories_on_high_earth_orbit.pdf');
  fs.readFileSync(paper);

  await expect(testGPT.runGPTAnalysis([paper])).resolves.not.toThrow();
}, 60000);
