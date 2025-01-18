import { DatabaseController } from '../src/database-controller';
import sqlite3 from 'sqlite3';

import { GetQuery, TableData, InsertData, UpdateData } from '../src/types';
import Response from 'express';
import { open } from 'sqlite';

// Mock DatabaseController methods
/*
jest.mock('sqlite', () => ({
  open: jest.fn().mockResolvedValue({
    run: jest.fn().mockResolvedValue({ changes: 1 }), // Simulate successful insert
    get: jest.fn().mockResolvedValue({ ROWID: 1 }), // Simulate returning a ROWID
    all: jest.fn().mockResolvedValue([]), // Simulate an empty array result for queries
  }),
}));
*/

async function initializeDB(): Promise<DatabaseController> {
  const db = await open({
    filename: ':memory:',
    driver: sqlite3.Database,
  });
  return new DatabaseController(db);
}

let testDB: DatabaseController;

// Initialize the database once before all tests
beforeAll(async () => {
  testDB = await initializeDB();
});

/**********
 *  TODO
 * Finish unit testing (using jest)
 ***********/

/*
+-----------------+
| Insertion Tests |
+-----------------+ 
*/

test('Insertion of a paper with one author', async () => {
  const testPaperData: InsertData = {
    paper_name: 'Tested Radiation Effects',
    year: 2024,
    author: ['S. Davis'],
    part_no: 'A1309KUA-9-T',
    type: 'Hall Effect Sensor',
    manufacturer: 'Allegro Microsystems',
    testing_location: 'Terrestrial',
    testing_type: 'DD',
    data_type: 1,
  };

  await expect(testDB.insertPaper(testPaperData)).resolves.not.toThrow();
});

test('Insertion of a paper with multiple authors', async () => {
  const testPaperData: InsertData = {
    paper_name: 'Radiation Test Effects On Tested Radiation',
    year: 2023,
    author: ['John Jacob', 'Lin Lee', 'Dr. Joan Gooding'],
    part_no: 'LT3094EMSE#PBF',
    type: 'Low Dropout Voltage Regulator',
    manufacturer: 'Analog Devices',
    testing_location: 'Terrestrial',
    testing_type: 'SEE',
    data_type: 0,
  };

  await expect(testDB.insertPaper(testPaperData)).resolves.not.toThrow();
});



/*
+---------------+
| Request Tests |
+---------------+ 
*/

test('Data request with empty filter', async () => {
  const testGetQuery: GetQuery = {
    paper_name: undefined,
    author: undefined,
    part_no: undefined,
    type: undefined,
    manufacturer: undefined,
    testing_type: undefined,
  };

  // Omit<TableData, 'ROWID'>[] to ignore the id with tests
  const expectedData: TableData[] = [
    {
      ROWID: 1,
      paper_name: 'Tested Radiation Effects',
      year: 2024,
      author: ['S. Davis'],
      part_no: 'A1309KUA-9-T',
      type: 'Hall Effect Sensor',
      manufacturer: 'Allegro Microsystems',
      testing_location: 'Terrestrial',
      testing_type: 'DD',
      data_type: 1,
    },
    {
      ROWID: 2,
      paper_name: 'Radiation Test Effects On Tested Radiation',
      year: 2023,
      author: ['John Jacob', 'Lin Lee', 'Dr. Joan Gooding'],
      part_no: 'LT3094EMSE#PBF',
      type: 'Low Dropout Voltage Regulator',
      manufacturer: 'Analog Devices',
      testing_location: 'Terrestrial',
      testing_type: 'SEE',
      data_type: 0,
    },
  ];

  const data = await testDB.getFilteredData(testGetQuery); // Assuming getData is also async
  expect(data).toEqual(expectedData); // Replace with appropriate expectation for your use case
});

// Test 1
test('Data request with full filter', async () => {
  const testGetQuery: GetQuery = {
    paper_name: 'Radiation Test Effects On Tested Radiation',
    author: 'John Jacob',
    part_no: 'LT3094EMSE#PBF',
    type: 'Low Dropout Voltage Regulator',
    manufacturer: 'Analog Devices',
    testing_location: 'Terrestrial',
    testing_type: 'SEE',
    data_type: 0,
  };

  const expectedData: TableData[] = [
    {
      ROWID: 2,
      paper_name: 'Radiation Test Effects On Tested Radiation',
      year: 2023,
      author: ['John Jacob', 'Lin Lee', 'Dr. Joan Gooding'],
      part_no: 'LT3094EMSE#PBF',
      type: 'Low Dropout Voltage Regulator',
      manufacturer: 'Analog Devices',
      testing_location: 'Terrestrial',
      testing_type: 'SEE',
      data_type: 0,
    },
  ];

  const data = await testDB.getFilteredData(testGetQuery); // Assuming getData is also async
  expect(data).toEqual(expectedData); // Replace with appropriate expectation for your use case
});

/*
+--------------+
| Update Tests |
+--------------+ 
*/

/*  
 *  Updataes the name of a paper
 */

test('Update of a paper name', async () => {
  const testPaperInsertData: InsertData = {
    // Name is incorrect
    paper_name: 'Radiation Teeeest Effects Test Test',
    year: 2023,
    author: ['John Jacob', 'Lin Lee', 'Dr. Joan Gooding'],
    part_no: 'LT3094EMSE#PBF',
    type: 'Low Dropout Voltage Regulator',
    manufacturer: 'Analog Devices',
    testing_location: 'Terrestrial',
    testing_type: 'SEE',
    data_type: 0,
  };
  
  const testPaperUpdateData: UpdateData = {
    // Name is incorrect
    ROWID: 3,
    paper_name: 'Radiation Test Effects Test Test',
  };

  const testPaperGetData: GetQuery = {
    paper_name: 'Radiation Test Effects Test Test'
  }

  const testPaperExpectedData: TableData[] = [{
    // Name is incorrect
    ROWID: 3,
    paper_name: 'Radiation Test Effects Test Test',
    year: 2023,
    author: ['John Jacob', 'Lin Lee', 'Dr. Joan Gooding'],
    part_no: 'LT3094EMSE#PBF',
    type: 'Low Dropout Voltage Regulator',
    manufacturer: 'Analog Devices',
    testing_location: 'Terrestrial',
    testing_type: 'SEE',
    data_type: 0,
  }];

  await testDB.insertPaper(testPaperInsertData);
  await testDB.updatePaper(testPaperUpdateData);
  const data = await testDB.getFilteredData(testPaperGetData);

  expect(data).toEqual(testPaperExpectedData);
});

