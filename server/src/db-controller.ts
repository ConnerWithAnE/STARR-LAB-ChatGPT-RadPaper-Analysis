// import {
//   Author,
//   Paper,
//   Part,
//   // TestingData,
//   // TIDData,
//   // SEEData,
//   // DDData,
// } from "./models";
// import { sequelize } from "./database-init";
// import { Op } from "sequelize";
// import {
//   AuthorData,
//   PaperData,
//   PartData,
//   TestData,
//   TIDDataType,
//   SEEDataType,
//   DDDataType,
//   FullDataType,
//   PaperWithRelations,
// } from "./types";

// export class DatabaseController {
//   /** -------------------- AUTHOR CRUD -------------------- */

//   async addAuthor(
//     name: string,
//   ): Promise<{ author: AuthorData; created: boolean }> {
//     const [author, created] = await Author.findOrCreate({ where: { name } });
//     return { author: author.get({ plain: true }), created };
//   }

//   /** Get a specific author by ID */
//   async getAuthorById(authorId: number): Promise<AuthorData | null> {
//     const author = await Author.findByPk(authorId);
//     return author ? author.get({ plain: true }) : null;
//   }

//   /** Get a specific author by Name */
//   async getAuthorByName(name: string): Promise<AuthorData | null> {
//     const author = await Author.findOne({ where: { name } });
//     return author ? author.get({ plain: true }) : null;
//   }

//   /** Get all authors */
//   async getAuthors(): Promise<AuthorData[]> {
//     const authors = await Author.findAll();
//     return authors.map((author) => author.get({ plain: true }));
//   }

//   /** Update an author's name */
//   async updateAuthor(
//     updateData: Partial<AuthorData>,
//   ): Promise<AuthorData | null> {
//     const { id, ...dataWithoutId } = updateData; // Ensure we do not update the id
//     const author = await Author.findByPk(id);
//     if (!author) return null;
//     await author.update(dataWithoutId);
//     return author.get({ plain: true });
//   }

//   /** Delete an author */
//   async deleteAuthor(authorId: number): Promise<number> {
//     return await Author.destroy({ where: { id: authorId } });
//   }

//   /** ---------------------- PAPER CRUD ---------------------- **/

//   /** Add a new paper and associate authors */
//   async addPaper(
//     paperData: PaperData,
//     authorIds?: number[],
//   ): Promise<PaperData> {
//     const paper = await Paper.create(paperData);
//     if (authorIds && authorIds.length > 0) {
//       const authors = await Author.findAll({ where: { id: authorIds } });
//       if (authors.length !== authorIds.length) {
//         throw new Error("Some authors not found");
//       }
//       await paper.addAuthors(authorIds); // Use primary keys directly
//     }
//     return paper.get({ plain: true });
//   }

//   /** Retrieve all papers, including authors and parts */
//   async getPapers(): Promise<PaperData[]> {
//     const papers = await Paper.findAll({ include: [Author, Part] });
//     return papers.map((paper) => paper.get({ plain: true }));
//   }

//   /** Retrieve a specific paper by ID */
//   async getPaperById(paperId: number): Promise<PaperData> {
//     const paper = await Paper.findByPk(paperId, { include: [Author, Part] });
//     if (!paper) throw new Error("Paper not found");
//     return paper.get({ plain: true });
//   }

//   /** Retrieve a specific paper by Name */
//   async getPaperByName(name: string): Promise<PaperData> {
//     const paper = await Paper.findOne({
//       where: { name },
//       include: [Author, Part],
//     });
//     if (!paper) throw new Error("Paper not found");
//     return paper.get({ plain: true });
//   }

//   /** Update a paper */
//   async updatePaper(updateData: Partial<PaperData>): Promise<PaperData> {
//     const { id, ...dataWithoutId } = updateData; // Ensure we do not update the id
//     const paper = await Paper.findByPk(id);
//     if (!paper) throw new Error("Paper not found");

//     await paper.update(dataWithoutId);
//     return paper.get({ plain: true });
//   }

//   /** Delete a paper */
//   async deletePaper(paperId: number): Promise<number> {
//     return await Paper.destroy({ where: { id: paperId } });
//   }

//   /** Add a paper to an author (does both ways automatically) */
//   async addPaperToAuthor(
//     paperId: number,
//     authorId: number,
//   ): Promise<PaperData> {
//     const paper = await Paper.findByPk(paperId);
//     if (!paper) throw new Error("Paper not found");

//     const author = await Author.findByPk(authorId);
//     if (!author) throw new Error("Author not found");

//     await paper.addAuthor(authorId); //does both ways
//     return paper.get({ plain: true });
//   }

//   /** -------------------- PART CRUD -------------------- */

//   /** Add a new part and associate it with papers */
//   async addPart(partData: PartData, paperIds?: number[]): Promise<PartData> {
//     const part = await Part.create(partData);

//     if (paperIds && paperIds.length > 0) {
//       const papers = await Paper.findAll({ where: { id: paperIds } });
//       if (papers.length !== paperIds.length) {
//         throw new Error("Some papers were not found");
//       }
//       await part.addPapers(paperIds);
//     }

//     return part.get({ plain: true });
//   }

//   /** Retrieve all parts */
//   async getParts(): Promise<PartData[]> {
//     const parts = await Part.findAll();
//     return parts.map((part) => part.get({ plain: true }));
//   }

//   /** Retrieve a specific part by ID */
//   async getPartById(partId: number): Promise<PartData> {
//     const part = await Part.findByPk(partId);
//     if (!part) throw new Error("Part not found");
//     return part.get({ plain: true });
//   }

//   /** Retrieve a specific part by Name */
//   async getPartByName(name: string): Promise<PartData> {
//     const part = await Part.findOne({ where: { name } });
//     if (!part) throw new Error("Part not found");
//     return part.get({ plain: true });
//   }

//   /** Update a part */
//   async updatePart(updateData: Partial<PartData>): Promise<PartData> {
//     const { id, ...dataWithoutId } = updateData; // Prevent updating ID
//     const part = await Part.findByPk(id);
//     if (!part) throw new Error("Part not found");

//     await part.update(dataWithoutId);
//     return part.get({ plain: true });
//   }

//   /** Delete a part */
//   async deletePart(partId: number): Promise<number> {
//     return await Part.destroy({ where: { id: partId } });
//   }

//   /** Add a part to a paper */
//   async addPartToPaper(paperId: number, partId: number): Promise<PartData> {
//     const paper = await Paper.findByPk(paperId);
//     if (!paper) throw new Error("Paper not found");

//     const part = await Part.findByPk(partId);
//     if (!part) throw new Error("Part not found");

//     await part.addPaper(paperId);
//     return part.get({ plain: true });
//   }

//   // /** --------------------  TESTING DATA CRUD -------------------- */

//   // /** Add general testing data for a Paper-Part relationship */
//   // async addTestingData(
//   //   paperId: number,
//   //   partId: number,
//   //   testData: TestData,
//   // ): Promise<TestData> {
//   //   const paper = await Paper.findByPk(paperId);
//   //   if (!paper) throw new Error("Paper not found");

//   //   const part = await Part.findByPk(partId);
//   //   if (!part) throw new Error("Part not found");

//   //   return await TestingData.create({ ...testData, paperId, partId });
//   // }

//   // /** Retrieve all testing data */
//   // async getTestingData(): Promise<TestData[]> {
//   //   const data = await TestingData.findAll({
//   //     include: [TIDData, SEEData, DDData],
//   //   });
//   //   return data.map((entry) => entry.get({ plain: true }));
//   // }

//   // /** Retrieve a specific testing data entry by ID */
//   // async getTestingDataById(testingDataId: number): Promise<TestData> {
//   //   const testingData = await TestingData.findByPk(testingDataId, {
//   //     include: [TIDData, SEEData, DDData],
//   //   });
//   //   if (!testingData) throw new Error("Testing data not found");
//   //   return testingData.get({ plain: true });
//   // }

//   // /** Retrieve testing data by testing type (e.g., TID, SEE, DD) */
//   // async getTestingDataByType(testingType: string): Promise<TestData[]> {
//   //   const data = await TestingData.findAll({
//   //     where: { testing_type: testingType },
//   //     include: [TIDData, SEEData, DDData],
//   //   });
//   //   return data.map((entry) => entry.get({ plain: true }));
//   // }

//   // /** Retrieve testing data by Paper and Part */
//   // async getTestingDataByPaperAndPart(
//   //   paperId: number,
//   //   partId: number,
//   // ): Promise<TestData> {
//   //   const testingData = await TestingData.findOne({
//   //     where: { paperId, partId },
//   //     include: [TIDData, SEEData, DDData],
//   //   });
//   //   if (!testingData) throw new Error("Testing data not found");

//   //   return testingData.get({ plain: true });
//   // }

//   // /** Update testing data */
//   // async updateTestingData(
//   //   testingDataId: number,
//   //   updateData: Partial<TestData>,
//   // ): Promise<TestData> {
//   //   const { id, ...dataWithoutId } = updateData; // Ensure we do not update the id
//   //   const testingData = await TestingData.findByPk(testingDataId);
//   //   if (!testingData) throw new Error("Testing data not found");

//   //   await testingData.update(dataWithoutId);
//   //   return testingData.get({ plain: true });
//   // }

//   // /** Delete testing data */
//   // async deleteTestingData(testingDataId: number): Promise<number> {
//   //   return await TestingData.destroy({ where: { id: testingDataId } });
//   // }

//   // /** Add testing data to a Paper and Part */
//   // async addTestingDataToPaperAndPart(
//   //   paperId: number,
//   //   partId: number,
//   //   testingDataId: number,
//   // ): Promise<TestData> {
//   //   const paper = await Paper.findByPk(paperId);
//   //   if (!paper) throw new Error("Paper not found");

//   //   const part = await Part.findByPk(partId);
//   //   if (!part) throw new Error("Part not found");

//   //   const testingData = await TestingData.findByPk(testingDataId);
//   //   if (!testingData) throw new Error("Testing data not found");

//   //   await paper.addTestingData(testingData);
//   //   await part.addTestingData(testingData);
//   //   return testingData.get({ plain: true });
//   // }

//   // /** -------------------- TID CRUD -------------------- */

//   // /** Add TID data to a specific TestingData */
//   // async addTIDData(
//   //   testingDataId: number,
//   //   tidData: TIDDataType,
//   // ): Promise<TIDDataType> {
//   //   const testingData = await TestingData.findByPk(testingDataId);
//   //   if (!testingData) throw new Error("Testing data not found");

//   //   const newTIDData = await TIDData.create({
//   //     ...tidData,
//   //     testingDataId: testingData.id,
//   //   });
//   //   return newTIDData.get({ plain: true });
//   // }

//   // /** Retrieve all TID data */
//   // async getTIDData(): Promise<TIDDataType[]> {
//   //   const data = await TIDData.findAll();
//   //   return data.map((entry) => entry.get({ plain: true }));
//   // }

//   // /** Retrieve a specific TID data entry by ID */
//   // async getTIDDataById(tidDataId: number): Promise<TIDDataType> {
//   //   const tidData = await TIDData.findByPk(tidDataId);
//   //   if (!tidData) throw new Error("TID data not found");
//   //   return tidData.get({ plain: true });
//   // }

//   // /** Update TID data */
//   // async updateTIDData(updateData: Partial<TIDDataType>): Promise<TIDDataType> {
//   //   const { id, ...dataWithoutId } = updateData; // Extract ID, prevent ID update
//   //   if (!id) throw new Error("ID is required for updating TID data");

//   //   const tidData = await TIDData.findByPk(id);
//   //   if (!tidData) throw new Error("TID data not found");

//   //   await tidData.update(dataWithoutId);
//   //   return tidData.get({ plain: true });
//   // }

//   // /** Delete TID data */
//   // async deleteTIDData(tidDataId: number): Promise<number> {
//   //   return await TIDData.destroy({ where: { id: tidDataId } });
//   // }

//   // /** -------------------- SEE CRUD -------------------- */

//   // /** Add SEE data to a specific TestingData */
//   // async addSEEData(
//   //   testingDataId: number,
//   //   seeData: SEEDataType,
//   // ): Promise<SEEDataType> {
//   //   const testingData = await TestingData.findByPk(testingDataId);
//   //   if (!testingData) throw new Error("Testing data not found");

//   //   const newSEEData = await SEEData.create({
//   //     ...seeData,
//   //     testingDataId: testingData.id,
//   //   });
//   //   return newSEEData.get({ plain: true });
//   // }

//   // /** Retrieve all SEE data */
//   // async getSEEData(): Promise<SEEDataType[]> {
//   //   const data = await SEEData.findAll();
//   //   return data.map((entry) => entry.get({ plain: true }));
//   // }

//   // /** Retrieve a specific SEE data entry by ID */
//   // async getSEEDataById(seeDataId: number): Promise<SEEDataType> {
//   //   const seeData = await SEEData.findByPk(seeDataId);
//   //   if (!seeData) throw new Error("SEE data not found");
//   //   return seeData.get({ plain: true });
//   // }

//   // /** Update SEE data */
//   // async updateSEEData(updateData: Partial<SEEDataType>): Promise<SEEDataType> {
//   //   const { id, ...dataWithoutId } = updateData;
//   //   if (!id) throw new Error("ID is required for updating SEE data");

//   //   const seeData = await SEEData.findByPk(id);
//   //   if (!seeData) throw new Error("SEE data not found");

//   //   await seeData.update(dataWithoutId);
//   //   return seeData.get({ plain: true });
//   // }

//   // /** Delete SEE data */
//   // async deleteSEEData(seeDataId: number): Promise<number> {
//   //   return await SEEData.destroy({ where: { id: seeDataId } });
//   // }

//   // /** -------------------- DD CRUD -------------------- */

//   // /** Add DD data to a specific TestingData */
//   // async addDDData(
//   //   testingDataId: number,
//   //   ddData: DDDataType,
//   // ): Promise<DDDataType> {
//   //   const testingData = await TestingData.findByPk(testingDataId);
//   //   if (!testingData) throw new Error("Testing data not found");

//   //   const newDDData = await DDData.create({
//   //     ...ddData,
//   //     testingDataId: testingData.id,
//   //   });
//   //   return newDDData.get({ plain: true });
//   // }

//   // /** Retrieve all DD data */
//   // async getDDData(): Promise<DDDataType[]> {
//   //   const data = await DDData.findAll();
//   //   return data.map((entry) => entry.get({ plain: true }));
//   // }

//   // /** Retrieve a specific DD data entry by ID */
//   // async getDDDataById(ddDataId: number): Promise<DDDataType> {
//   //   const ddData = await DDData.findByPk(ddDataId);
//   //   if (!ddData) throw new Error("DD data not found");
//   //   return ddData.get({ plain: true });
//   // }

//   // /** Update DD data */
//   // async updateDDData(updateData: Partial<DDDataType>): Promise<DDDataType> {
//   //   const { id, ...dataWithoutId } = updateData;
//   //   if (!id) throw new Error("ID is required for updating DD data");

//   //   const ddData = await DDData.findByPk(id);
//   //   if (!ddData) throw new Error("DD data not found");

//   //   await ddData.update(dataWithoutId);
//   //   return ddData.get({ plain: true });
//   // }

//   // /** Delete DD data */
//   // async deleteDDData(ddDataId: number): Promise<number> {
//   //   return await DDData.destroy({ where: { id: ddDataId } });
//   // }
//   // /** -------------------- 📌 OTHER UTILITIES -------------------- */

//   // /** Get the number of papers */
//   // async getNumberOfPapers(): Promise<number> {
//   //   return await Paper.count();
//   // }

//   // /** Get the number of authors */
//   // async getNumberOfAuthors(): Promise<number> {
//   //   return await Author.count();
//   // }
//   // /** Get full data */
//   // async getFullData(search?: string): Promise<FullDataType[]> {
//   //   const whereClause = search ? { name: { [Op.like]: `%${search}%` } } : {};

//   //   const papers: PaperWithRelations[] = await Paper.findAll({
//   //     where: whereClause,
//   //     include: [
//   //       {
//   //         model: Author,
//   //         attributes: ["id", "name"],
//   //         through: { attributes: [] }, // Exclude join table attributes
//   //       },
//   //       {
//   //         model: Part,
//   //         attributes: ["id", "name", "type", "manufacturer"],
//   //         through: { attributes: [] },
//   //       },
//   //       {
//   //         model: TestingData,
//   //         attributes: [
//   //           "testing_type",
//   //           "max_fluence",
//   //           "energy",
//   //           "facility",
//   //           "environment",
//   //           "terrestrial",
//   //           "flight",
//   //         ],
//   //         include: [
//   //           {
//   //             model: TIDData,
//   //             attributes: [
//   //               "source",
//   //               "max_tid",
//   //               "dose_rate",
//   //               "eldrs",
//   //               "p_pion",
//   //               "dose_to_failure",
//   //               "increased_power_usage",
//   //               "power_usage_description",
//   //               "special_notes",
//   //             ],
//   //           },
//   //           {
//   //             model: SEEData,
//   //             attributes: [
//   //               "source",
//   //               "type",
//   //               "amplitude",
//   //               "duration",
//   //               "cross_section",
//   //               "cross_section_type",
//   //               "special_notes",
//   //             ],
//   //           },
//   //           {
//   //             model: DDData,
//   //             attributes: [
//   //               "source",
//   //               "damage_level",
//   //               "damage_level_description",
//   //               "special_notes",
//   //             ],
//   //           },
//   //         ],
//   //       },
//   //     ],
//   //   });

//   //   return papers.map((paper) => ({
//   //     id: paper.id,
//   //     name: paper.name,
//   //     year: paper.year,
//   //     authors:
//   //       paper.Authors?.map((author) => ({
//   //         id: author.id,
//   //         name: author.name,
//   //       })) || [],
//   //     parts:
//   //       paper.Parts?.map((part) => ({
//   //         id: part.id,
//   //         name: part.name,
//   //         type: part.type,
//   //         manufacturer: part.manufacturer,
//   //       })) || [],
//   //     testingData:
//   //       paper.TestingData?.map((test) => ({
//   //         id: test.id,
//   //         testing_type: test.testing_type,
//   //         max_fluence: test.max_fluence,
//   //         energy: test.energy,
//   //         facility: test.facility,
//   //         environment: test.environment,
//   //         terrestrial: test.terrestrial,
//   //         flight: test.flight,
//   //         tidData: test.tidData
//   //           ? {
//   //               id: test.tidData.id,
//   //               source: test.tidData.source,
//   //               max_tid: test.tidData.max_tid,
//   //               dose_rate: test.tidData.dose_rate,
//   //               eldrs: test.tidData.eldrs,
//   //               p_pion: test.tidData.p_pion,
//   //               dose_to_failure: test.tidData.dose_to_failure,
//   //               increased_power_usage: test.tidData.increased_power_usage,
//   //               power_usage_description: test.tidData.power_usage_description,
//   //               special_notes: test.tidData.special_notes || "",
//   //             }
//   //           : undefined,
//   //         seeData: test.seeData
//   //           ? {
//   //               id: test.seeData.id,
//   //               source: test.seeData.source,
//   //               type: test.seeData.type,
//   //               amplitude: test.seeData.amplitude,
//   //               duration: test.seeData.duration,
//   //               cross_section: test.seeData.cross_section,
//   //               cross_section_type: test.seeData.cross_section_type,
//   //               special_notes: test.seeData.special_notes || "",
//   //             }
//   //           : undefined,
//   //         ddData: test.ddData
//   //           ? {
//   //               id: test.ddData.id,
//   //               source: test.ddData.source,
//   //               damage_level: test.ddData.damage_level,
//   //               damage_level_description: test.ddData.damage_level_description,
//   //               special_notes: test.ddData.special_notes || "",
//   //             }
//   //           : undefined,
//   //       })) || [],
//   //   }));
//   // }

//   // async getFilteredData(
//   //   filters: Partial<FullDataType>,
//   // ): Promise<FullDataType[]> {
//   //   const paperWhere: any = {};
//   //   const authorWhere: any = {};
//   //   const partWhere: any = {};
//   //   const testingDataWhere: any = {};
//   //   const tidDataWhere: any = {};
//   //   const seeDataWhere: any = {};
//   //   const ddDataWhere: any = {};

//   //   // Apply filters dynamically
//   //   if (filters.name) {
//   //     if (Array.isArray(filters.name)) {
//   //       paperWhere.name = { [Op.in]: filters.name }; // Matches any paper name provided
//   //     } else {
//   //       paperWhere.name = { [Op.like]: `%${filters.name}%` };
//   //     }
//   //   }

//   //   if (filters.year) {
//   //     if (Array.isArray(filters.year)) {
//   //       paperWhere.year = { [Op.in]: filters.year }; // Matches multiple years
//   //     } else {
//   //       paperWhere.year = filters.year;
//   //     }
//   //   }

//   //   if (filters.authors) {
//   //     const authorNames = filters.authors
//   //       .map((author) => author.name)
//   //       .filter(Boolean);
//   //     if (authorNames.length > 0) {
//   //       authorWhere.name = { [Op.in]: authorNames }; // Matches any author in the provided list
//   //     }
//   //   }

//   //   if (filters.parts) {
//   //     const partNames = filters.parts.map((part) => part.name).filter(Boolean);
//   //     const partTypes = filters.parts.map((part) => part.type).filter(Boolean);

//   //     if (partNames.length > 0) {
//   //       partWhere.name = { [Op.in]: partNames };
//   //     }
//   //     if (partTypes.length > 0) {
//   //       partWhere.type = { [Op.in]: partTypes };
//   //     }
//   //   }

//   //   if (filters.testingData) {
//   //     const testingTypes = filters.testingData
//   //       .map((test) => test.testing_type)
//   //       .filter(Boolean);
//   //     const testingFacilities = filters.testingData
//   //       .map((test) => test.facility)
//   //       .filter(Boolean);

//   //     if (testingTypes.length > 0) {
//   //       testingDataWhere.testing_type = { [Op.in]: testingTypes };
//   //     }
//   //     if (testingFacilities.length > 0) {
//   //       testingDataWhere.facility = { [Op.in]: testingFacilities };
//   //     }
//   //   }

//   //   if (filters.testingData?.some((test) => test.tidData)) {
//   //     const tidSources = filters.testingData
//   //       .map((test) => test.tidData?.source)
//   //       .filter(Boolean);

//   //     if (tidSources.length > 0) {
//   //       tidDataWhere.source = { [Op.in]: tidSources };
//   //     }
//   //   }

//   //   if (filters.testingData?.some((test) => test.seeData)) {
//   //     const seeSources = filters.testingData
//   //       .map((test) => test.seeData?.source)
//   //       .filter(Boolean);

//   //     if (seeSources.length > 0) {
//   //       seeDataWhere.source = { [Op.in]: seeSources };
//   //     }
//   //   }

//   //   if (filters.testingData?.some((test) => test.ddData)) {
//   //     const ddSources = filters.testingData
//   //       .map((test) => test.ddData?.source)
//   //       .filter(Boolean);

//   //     if (ddSources.length > 0) {
//   //       ddDataWhere.source = { [Op.in]: ddSources };
//   //     }
//   //   }

//   //   // Fetch filtered data
//   //   const papers: PaperWithRelations[] = await Paper.findAll({
//   //     where: Object.keys(paperWhere).length ? paperWhere : undefined,
//   //     include: [
//   //       {
//   //         model: Author,
//   //         where: Object.keys(authorWhere).length ? authorWhere : undefined,
//   //         attributes: ["id", "name"],
//   //         through: { attributes: [] },
//   //       },
//   //       {
//   //         model: Part,
//   //         where: Object.keys(partWhere).length ? partWhere : undefined,
//   //         attributes: ["id", "name", "type", "manufacturer"],
//   //         through: { attributes: [] },
//   //       },
//   //       {
//   //         model: TestingData,
//   //         where: Object.keys(testingDataWhere).length
//   //           ? testingDataWhere
//   //           : undefined,
//   //         attributes: [
//   //           "testing_type",
//   //           "max_fluence",
//   //           "energy",
//   //           "facility",
//   //           "environment",
//   //           "terrestrial",
//   //           "flight",
//   //         ],
//   //         include: [
//   //           {
//   //             model: TIDData,
//   //             where: Object.keys(tidDataWhere).length
//   //               ? tidDataWhere
//   //               : undefined,
//   //             attributes: [
//   //               "source",
//   //               "max_tid",
//   //               "dose_rate",
//   //               "eldrs",
//   //               "p_pion",
//   //               "dose_to_failure",
//   //               "increased_power_usage",
//   //               "power_usage_description",
//   //               "special_notes",
//   //             ],
//   //           },
//   //           {
//   //             model: SEEData,
//   //             where: Object.keys(seeDataWhere).length
//   //               ? seeDataWhere
//   //               : undefined,
//   //             attributes: [
//   //               "source",
//   //               "type",
//   //               "amplitude",
//   //               "duration",
//   //               "cross_section",
//   //               "cross_section_type",
//   //               "special_notes",
//   //             ],
//   //           },
//   //           {
//   //             model: DDData,
//   //             where: Object.keys(ddDataWhere).length ? ddDataWhere : undefined,
//   //             attributes: [
//   //               "source",
//   //               "damage_level",
//   //               "damage_level_description",
//   //               "special_notes",
//   //             ],
//   //           },
//   //         ],
//   //       },
//   //     ],
//   //   });

//   //   return papers.map((paper) => ({
//   //     id: paper.id,
//   //     name: paper.name,
//   //     year: paper.year,
//   //     authors:
//   //       paper.Authors?.map((author) => ({
//   //         id: author.id,
//   //         name: author.name,
//   //       })) || [],
//   //     parts:
//   //       paper.Parts?.map((part) => ({
//   //         id: part.id,
//   //         name: part.name,
//   //         type: part.type,
//   //         manufacturer: part.manufacturer,
//   //       })) || [],
//   //     testingData:
//   //       paper.TestingData?.map((test) => ({
//   //         id: test.id,
//   //         testing_type: test.testing_type,
//   //         max_fluence: test.max_fluence,
//   //         energy: test.energy,
//   //         facility: test.facility,
//   //         environment: test.environment,
//   //         terrestrial: test.terrestrial,
//   //         flight: test.flight,
//   //         tidData: test.tidData
//   //           ? {
//   //               id: test.tidData.id,
//   //               source: test.tidData.source,
//   //               max_tid: test.tidData.max_tid,
//   //               dose_rate: test.tidData.dose_rate,
//   //               eldrs: test.tidData.eldrs,
//   //               p_pion: test.tidData.p_pion,
//   //               dose_to_failure: test.tidData.dose_to_failure,
//   //               increased_power_usage: test.tidData.increased_power_usage,
//   //               power_usage_description: test.tidData.power_usage_description,
//   //               special_notes: test.tidData.special_notes || "",
//   //             }
//   //           : undefined,
//   //         seeData: test.seeData
//   //           ? {
//   //               id: test.seeData.id,
//   //               source: test.seeData.source,
//   //               type: test.seeData.type,
//   //               amplitude: test.seeData.amplitude,
//   //               duration: test.seeData.duration,
//   //               cross_section: test.seeData.cross_section,
//   //               cross_section_type: test.seeData.cross_section_type,
//   //               special_notes: test.seeData.special_notes || "",
//   //             }
//   //           : undefined,
//   //         ddData: test.ddData
//   //           ? {
//   //               id: test.ddData.id,
//   //               source: test.ddData.source,
//   //               damage_level: test.ddData.damage_level,
//   //               damage_level_description: test.ddData.damage_level_description,
//   //               special_notes: test.ddData.special_notes || "",
//   //             }
//   //           : undefined,
//   //       })) || [],
//   //   }));
//   // }

//   /** Close the database connection */
//   async closeDB(): Promise<void> {
//     await sequelize.close();
//     console.log("Database connection closed successfully");
//   }
// }
