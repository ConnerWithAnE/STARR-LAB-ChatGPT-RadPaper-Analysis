import { models } from "./models"; // Import all Sequelize models dynamically
import { Model, Op } from "sequelize";
import { sequelize } from "./database-init";
import { Author, Paper, Part, Tid, See, Dd } from "./models";
import { BlobOptions } from "buffer";

type ModelKey = keyof typeof models; // Ensures only valid model names are used

export class GenericController {
  /** Create a new record, handling related models */
  static async create(modelName: string, data: any) {
    console.log(`All models: ${Object.keys(models)}`);

    // Format model name (remove trailing 's' and capitalize first letter)
    const formattedName = this.formatModelName(modelName);
    const model = models[formattedName];
    if (!model) {
      console.error(`Invalid model name: ${modelName}`);
      return { error: `Invalid model name: ${modelName}`, status: 400 };
    }

    console.log(`Creating ${formattedName} with data:`, data);

    // Extract related data (arrays) and remove from main payload
    const relatedData = this.extractRelatedData(model, data);

    if ("error" in relatedData) {
      return relatedData;
    }

    // Create the main instance
    const instance = await model.create(data);

    // Process and associate related records
    const associationResult = await this.processAssociations(
      instance,
      formattedName,
      relatedData,
      true,
    );
    if (associationResult?.error) {
      return associationResult;
    }

    //get the full instance, not just id and defined fields
    const instanceId = instance.getDataValue("id");
    const fullInstance = this.getById(modelName, instanceId);

    return fullInstance;
    //return instance.get({ plain: true });
  }

  /**  Get all records, including valid relationships */
  static async getAll<T extends ModelKey>(modelName: T) {
    console.log(`Fetching all records for: ${modelName}`);

    // Format model name (ensure singular and capitalized)
    const formattedName = this.formatModelName(modelName);
    const model = models[formattedName];

    if (!model) {
      console.warn(`Invalid model name: ${modelName}`);
      return {
        error: `Invalid model name: ${modelName}`,
        status: 400,
      };
    }

    // Dynamically find all associated models, checking for both singular and plural associations
    const associatedModels = Object.entries(models)
      .filter(([name]) => {
        const lowerName = name.toLowerCase();
        return (
          (model as any).associations[lowerName + "s"] || // Plural check
          (model as any).associations[lowerName] // Singular check
        );
      })
      .map(([_, relatedModel]) => relatedModel);

    console.log(
      `Including associations for ${formattedName}:`,
      associatedModels.map((m) => m.name),
    );

    // Fetch all records, including related models
    const records = await model.findAll({ include: associatedModels });

    // Return plain JSON objects
    return records.map((r) => r.get({ plain: true }));
  }

  /**  Get a single record by ID, including valid relationships */
  static async getById<T extends ModelKey>(modelName: T, id: number) {
    console.log(`Fetching record with ID: ${id} from model: ${modelName}`);

    // Format model name (ensure singular and capitalized)
    const formattedName = this.formatModelName(modelName);
    const model = models[formattedName];

    if (!model) {
      console.warn(`Invalid model name: ${modelName}`);
      return {
        error: `Invalid model name: ${modelName}`,
        status: 400,
      };
    }

    // Dynamically find all associated models, checking for both singular and plural associations
    const associatedModels = Object.entries(models)
      .filter(([name]) => {
        const lowerName = name.toLowerCase();
        return (
          (model as any).associations[lowerName + "s"] || // Plural check
          (model as any).associations[lowerName] // Singular check
        );
      })
      .map(([_, relatedModel]) => relatedModel);

    console.log(
      `Including associations for ${formattedName}:`,
      associatedModels.map((m) => m.name),
    );

    // Fetch the record by ID, including related models
    const record = await model.findByPk(id, { include: associatedModels });

    if (!record) {
      console.warn(`Record with ID ${id} not found in ${formattedName}`);
      return null;
    }

    return record.get({ plain: true });
  }

  /**  Update a record, allowing append or set for relations */
  static async update<T extends ModelKey>(
    modelName: T,
    id: number,
    data: any,
    append = true,
  ) {
    console.log(`Updating ${modelName} with ID ${id}`);

    // Format model name (ensure singular and capitalized)
    const formattedName = this.formatModelName(modelName);
    const model = models[formattedName];

    if (!model) {
      console.warn(`Invalid model name: ${modelName}`);
      return {
        error: `Invalid model name: ${modelName}`,
        status: 400,
      };
    }

    // Find the existing record
    const instance = await model.findByPk(id);
    if (!instance) {
      console.warn(`Record with ID ${id} not found in ${formattedName}`);
      return {
        error: `Record with ID ${id} not found in ${formattedName}`,
        status: 404,
      };
    }

    // Extract related data (array of IDs) and remove them from main payload
    const relatedData = this.extractRelatedData(model, data);
    if ("error" in relatedData) {
      return relatedData;
    }

    // Update non-related fields
    await instance.update(data);

    // Process and associate related records, handling empty arrays correctly
    const associationResult = await this.processAssociations(
      instance,
      formattedName,
      relatedData,
      append,
    );
    if (associationResult?.error) {
      return associationResult; // Return error if associations failed
    }

    //get the full instance, not just id and defined fields
    const instanceId = instance.getDataValue("id");
    const fullInstance = this.getById(modelName, instanceId);

    return fullInstance;
    //return instance.get({ plain: true });
  }

  /**  Delete a record by ID */
  static async delete<T extends ModelKey>(modelName: T, id: number) {
    console.log(`Deleting ${modelName} with ID ${id}`);

    // Format model name (ensure singular and capitalized)
    const formattedName = this.formatModelName(modelName);
    const model = models[formattedName];

    if (!model) {
      console.warn(`Invalid model name: ${modelName}`);
      return -1;
    }

    // Attempt to delete the record
    const deletedCount = await model.destroy({ where: { id } });

    // Log and return result
    if (deletedCount === 0) {
      console.warn(`No record found with ID ${id} in ${formattedName}`);
    } else {
      console.log(`Successfully deleted ${formattedName} with ID ${id}`);
    }

    return deletedCount; // 0 if not found, 1 if deleted, -1 if error
  }

  /**  Filter records dynamically based on provided query parameters */
  static async filter<T extends ModelKey>(modelName: T, filters: any) {
    console.log(`Filtering ${modelName} with filters:`, filters);

    // Format model name (ensure singular and capitalized)
    const formattedName = this.formatModelName(modelName);
    const model = models[formattedName];

    if (!model) {
      return {
        error: `Invalid model name: ${modelName}`,
        status: 400,
      };
    }

    // Prepare query conditions for Sequelize
    const whereConditions: Record<string, any> = {};
    const includeRelations: any[] = [];

    for (const key in filters) {
      if (!filters[key]) continue; // Ignore empty filters

      if (key.includes(".")) {
        //  Handling related model fields (e.g., "parts.type")
        const [relation, field] = key.split(".");

        console.log(
          `Filtering related model '${relation}' on field '${field}'`,
        );

        if (model.associations[relation]) {
          const relatedModelName = this.capitalize(relation.replace(/s$/, ""));
          const relatedModel = models[relatedModelName];

          if (relatedModel) {
            console.log(
              `Available fields for related model '${relatedModelName}':`,
              Object.keys(relatedModel.getAttributes()),
            ); //  Log available fields

            if (field in relatedModel.getAttributes()) {
              // Convert numeric values explicitly
              const fieldType = relatedModel.getAttributes()[field].type;
              let value = filters[key];

              if (
                fieldType.constructor.name.includes("INTEGER") ||
                fieldType.constructor.name.includes("FLOAT") ||
                fieldType.constructor.name.includes("DECIMAL")
              ) {
                value = Number(value); // Convert to number
              } else if (
                fieldType.constructor.name.includes("TEXT") ||
                fieldType.constructor.name.includes("ENUM")
              ) {
                value = { [Op.like]: `%${filters[key]}%` }; // Ensure LIKE is used correctly
              } else {
                value = filters[key]; // Default case
              }

              includeRelations.push({
                model: relatedModel,
                as: relation,
                required: true,
                where: {
                  [field]: value,
                },
              });
            } else {
              console.warn(
                `Invalid field '${field}' for relation '${relation}' in model '${relatedModelName}'`,
              );
              return {
                error: `Invalid field '${field}' for relation '${relation}' in model '${relatedModelName}'`,
                status: 400,
              };
            }
          } else {
            console.warn(`Invalid related model: ${relation}`);
            return {
              error: `Invalid related model: ${relation}`,
              status: 400,
            };
          }
        } else {
          console.warn(`Invalid related model: ${relation}`);
          return {
            error: `Invalid related model: ${relation}`,
            status: 400,
          };
        }
      } else if (Object.keys(model.getAttributes()).includes(key)) {
        //  Handling direct model fields
        const fieldType = model.getAttributes()[key].type;
        let value = filters[key];

        if (
          fieldType.constructor.name.includes("INTEGER") ||
          fieldType.constructor.name.includes("FLOAT") ||
          fieldType.constructor.name.includes("DECIMAL")
        ) {
          value = Number(value); // Convert to number for exact match
        } else if (fieldType.constructor.name.includes("TEXT")) {
          value = { [Op.like]: `%${filters[key]}%` }; // Ensure LIKE is used correctly
        }

        whereConditions[key] = value; // Apply exact match for numbers, LIKE for strings
      } else {
        console.warn(`Field '${key}' does not exist in ${formattedName}`);
        return {
          error: `Field '${key}' does not exist in ${formattedName}`,
          status: 400,
        };
      }
    }

    console.log("Final WHERE conditions for main model:", whereConditions);

    console.log("Including relations and their WHERE conditions:");
    includeRelations.forEach((relation) => {
      console.log(` - Relation: ${relation.model?.name || "UNKNOWN"}`);
      console.log(`   WHERE:`, relation.where);
    });

    // Fetch filtered records, including related models
    const records = await model.findAll({
      where: whereConditions,
      include: includeRelations,
    });

    console.log("Found records:", records.length);

    // Return fully populated records for all models
    return Promise.all(
      records.map((r) => this.getById(modelName, r.getDataValue("id"))),
    );
  }

  /** Create full paper along with related entities */
  static async createFullPaper(data: any) {
    console.log("Processing full paper creation:", data);

    // Validate required fields
    if (!data.name || !data.year) {
      return { error: "Paper year or name missing", status: 400 };
    }

    // Create Paper
    const [paper, paperCreated] = (await models.Paper.findOrCreate({
      where: { name: data.name, year: data.year },
      defaults: data,
    })) as [Paper, boolean];

    console.log(
      `Paper ${paperCreated ? "created" : "found"}:`,
      paper.get({ plain: true }),
    );

    // Handle authors, parts, and related tests
    await this.handleAuthorsAndParts(paper, data, true);

    console.log("Paper and all related entities processed successfully.");
    return await this.getFullPaperById(paper.id);
  }

  /** Update an existing paper with the ability to append or replace related entities */
  static async updateFullPaper(id: number, data: any, append = true) {
    console.log(`Updating paper with ID ${id}`, data);

    // Find existing paper
    const paper = (await models.Paper.findByPk(id, {
      include: [models.Author, models.Part],
    })) as Paper;
    if (!paper) return { error: "Paper not found", status: 404 };

    // Update paper fields
    const paperData = { ...data };
    delete paperData.authors;
    delete paperData.parts;
    // delete paperData.tids;
    // delete paperData.sees;
    // delete paperData.sees;
    await paper.update(paperData);

    // Handle authors, parts, and related tests
    await this.handleAuthorsAndParts(paper, data, append);

    console.log("Paper successfully updated.");
    return await this.getFullPaperById(id);
  }

  /** Retrieve a full paper object by ID */
  static async getFullPaperById(id: number) {
    console.log(`Fetching full paper with ID: ${id}`);

    // Find the paper with authors and parts included
    const paper = await models.Paper.findByPk(id, {
      include: [
        { model: models.Author, as: "authors" },
        {
          model: models.Part,
          as: "parts",
          include: [
            { model: models.Tid, as: "tids" },
            { model: models.See, as: "sees" },
            { model: models.Dd, as: "dds" },
          ],
        },
      ],
    });

    // Error handling if paper is not found
    if (!paper) {
      console.warn(`Paper with ID ${id} not found.`);
      return { error: "Paper not found", status: 404 };
    }

    // Convert raw Sequelize object to plain JSON
    const paperData = paper.get({ plain: true });

    return {
      ...paperData,
      authors: Array.isArray(paperData.authors) ? paperData.authors : [],
      parts: Array.isArray(paperData.parts)
        ? paperData.parts.map((part: any) => ({
            ...part,
            tids: Array.isArray(part.tids) ? part.tids : [],
            sees: Array.isArray(part.sees) ? part.sees : [],
            dds: Array.isArray(part.dds) ? part.dds : [],
          }))
        : [],
    };
  }

  /** Retrieve all papers with full related data */
  static async getFullPaper() {
    console.log("Fetching all papers with full data format.");

    // Fetch all papers with authors, parts, and nested relationships
    const papers = await models.Paper.findAll({
      include: [
        { model: models.Author, as: "authors" },
        {
          model: models.Part,
          as: "parts",
          include: [
            { model: models.Tid, as: "tids" },
            { model: models.See, as: "sees" },
            { model: models.Dd, as: "dds" },
          ],
        },
      ],
    });

    // If no papers found, return an empty array
    if (!papers || papers.length === 0) {
      console.warn("No papers found.");
      return [];
    }

    // Convert all paper models to the structured format
    return papers.map((paper) => {
      const paperData = paper.get({ plain: true });

      return {
        ...paperData,
        authors: Array.isArray(paperData.authors) ? paperData.authors : [],
        parts: Array.isArray(paperData.parts)
          ? paperData.parts.map((part: any) => ({
              ...part,
              tids: Array.isArray(part.tids) ? part.tids : [],
              sees: Array.isArray(part.sees) ? part.sees : [],
              dds: Array.isArray(part.dds) ? part.dds : [],
            }))
          : [],
      };
    });
  }

  /** Close the database connection */
  async closeDB(): Promise<void> {
    await sequelize.close();
    console.log("Database connection closed successfully");
  }

  /*------------------ HELPER FUNCTIONS ------------------*/

  /** Format model name: Singularize and capitalize */
  private static formatModelName(name: string): string {
    return name.replace(/s$/, "").replace(/^./, (c) => c.toUpperCase());
  }

  /**  Capitalize first letter of a string */
  private static capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /** Extract related data and remove from main payload */
  private static extractRelatedData(
    model: any,
    data: any,
  ): Record<string, number[]> | {} {
    const relatedData: Record<string, number[]> = {};

    for (const key in data) {
      if (Array.isArray(data[key])) {
        const pluralRelation = key;
        const singularRelation = key.slice(0, -1); // Remove trailing 's'

        console.log(`Checking relation: ${pluralRelation}`);

        console.log(
          `Available associations for ${model.name}:`,
          Object.keys(model.associations),
        );

        if (model.associations[pluralRelation]) {
          console.log(`Valid relation found: ${pluralRelation}`);
          relatedData[pluralRelation] = data[key];
          delete data[key];
        } else if (model.associations[singularRelation]) {
          console.log(`Valid singular relation found: ${singularRelation}`);
          relatedData[singularRelation] = data[key];
          delete data[key];
        } else {
          console.warn(`Invalid relation: ${pluralRelation}`);
          return {
            error: `Invalid relation: ${pluralRelation}`,
            status: 400,
          };
        }
      }
    }

    return relatedData;
  }

  /** Process and associate related records */
  private static async processAssociations(
    instance: any,
    modelName: string,
    relatedData: Record<string, number[]>,
    append: boolean,
  ) {
    for (const relationKey in relatedData) {
      const isPlural = relationKey.endsWith("s");
      const relationMethod = isPlural
        ? append
          ? `add${this.capitalize(relationKey)}`
          : `set${this.capitalize(relationKey)}`
        : `set${this.capitalize(relationKey)}`;
      const singularModelName = this.formatModelName(relationKey);

      console.log(`Processing relation: ${relationKey} for ${modelName}`);

      const relatedModel = models[singularModelName];
      if (!relatedModel) {
        console.warn(`Missing related model: ${singularModelName}`);
        return {
          error: `Missing related model: ${singularModelName}`,
          status: 400,
        };
      }

      // Handle empty arrays when append is false → Remove all relations
      if (!append && relatedData[relationKey].length === 0) {
        console.log(
          `Removing all ${relationKey} associations from ${modelName}`,
        );
        if (typeof instance[relationMethod] === "function") {
          await instance[relationMethod]([]);
        } else {
          console.warn(`Missing association method: ${relationMethod}`);
        }
        continue;
      }

      // Fetch related instances
      const relatedInstances = await relatedModel.findAll({
        where: { id: relatedData[relationKey] },
      });

      console.log(`Found related instances: ${relatedInstances.length}`);

      if (relatedInstances.length !== relatedData[relationKey].length) {
        console.log(`Some ${relationKey} not found or invalid`);
        return {
          error: `Some ${relationKey} not found or invalid`,
          status: 400,
        };
      }

      // Use the correct association method (add vs set)
      console.log(`Trying to use ${relationMethod}`);
      // console.log(`Instance has methods:`, Object.keys(instance));
      console.log(
        "Instance prototype methods:",
        Object.getOwnPropertyNames(Object.getPrototypeOf(instance)),
      );

      if (typeof instance[relationMethod] === "function") {
        console.log(`Using ${relationMethod}()`);

        if (!isPlural && relatedInstances.length > 1) {
          console.warn(`Expected only one ${relationKey} but got multiple`);
          return {
            error: `Expected only one ${relationKey} but got multiple`,
            status: 400,
          };
        }

        await instance[relationMethod](
          isPlural ? relatedInstances : relatedInstances[0],
        );
      } else {
        console.warn(`Missing association method: ${relationMethod}`);
      }
    }
  }

  /**
   * Helper function to handle Authors and Parts in both Create and Update operations
   */
  static async handleAuthorsAndParts(paper: Paper, data: any, append: boolean) {
    // Handle authors
    if (data.authors) {
      const authors = (await this.manageEntities(
        "Author",
        data.authors,
      )) as Author[];
      append
        ? await paper.addAuthors(authors)
        : await paper.setAuthors(authors);
    }

    // Handle parts
    if (data.parts) {
      const parts = (await this.manageEntities("Part", data.parts)) as Part[];
      append ? await paper.addParts(parts) : await paper.setParts(parts);
      console.log("gotty here");
      console.log(data.parts);
      await this.handleTestsForParts(parts, paper, data.parts, append);
    }
  }

  /**
   * Helper function to process `Tids`, `Sees`, and `Dds` for parts
   */
  static async handleTestsForParts(
    parts: Part[],
    paper: Paper,
    partsData: any[],
    append: boolean,
  ) {
    for (const partData of partsData) {
      let part;
      if (partData.name) {
        part = parts.find((p) => p.name === partData.name);
      } else {
        part = parts.find((p) => p.id === partData.id);
      }
      if (!part) continue;

      console.log(`Processing part: ${partData.name}`);

      // Handle tids
      if (Array.isArray(partData.tids)) {
        console.log("Processing tids for part:", partData.id);

        const tids = (await this.manageEntities(
          "Tid",
          partData.tids,
          true,
        )) as Tid[];

        if (append) {
          await part.addTids(tids);
          await paper.addTids(tids);
        } else {
          // Find only the tids that belong to this specific Paper-Part combo
          const existingTids = await Tid.findAll({
            where: { partId: part.id, paperId: paper.id }, // Ensure we only target the current Paper-Part
          });

          //  Remove only these specific tids
          await part.removeTids(existingTids);
          await paper.removeTids(existingTids);

          // If new tids are provided, add them back
          if (tids.length > 0) {
            await part.addTids(tids);
            await paper.addTids(tids);
          }
        }
      }

      // Handle sees
      if (Array.isArray(partData.sees)) {
        console.log("Processing sees for part:", partData.id);

        const sees = (await this.manageEntities(
          "See",
          partData.sees,
          true,
        )) as See[];

        if (append) {
          await part.addSees(sees);
          await paper.addSees(sees);
        } else {
          // Find only the sees that belong to this specific Paper-Part combo
          const existingSees = await See.findAll({
            where: { partId: part.id, paperId: paper.id }, // Ensure we only target the current Paper-Part
          });

          //  Remove only these specific sees
          await part.removeSees(existingSees);
          await paper.removeSees(existingSees);

          // If new sees are provided, add them back
          if (sees.length > 0) {
            await part.addSees(sees);
            await paper.addSees(sees);
          }
        }
      }

      // Handle dds
      if (Array.isArray(partData.dds)) {
        console.log("Processing dds for part:", partData.id);

        const dds = (await this.manageEntities(
          "Dd",
          partData.dds,
          true,
        )) as Dd[];

        if (append) {
          await part.addDds(dds);
          await paper.addDds(dds);
        } else {
          // Find only the dds that belong to this specific Paper-Part combo
          const existingDds = await Dd.findAll({
            where: { partId: part.id, paperId: paper.id }, // Ensure we only target the current Paper-Part
          });

          //  Remove only these specific dds
          await part.removeDds(existingDds);
          await paper.removeDds(existingDds);

          // If new dds are provided, add them back
          if (dds.length > 0) {
            await part.addDds(dds);
            await paper.addDds(dds);
          }
        }
      }
    }
  }

  /**
   * Helper function to find or create related entities
   * @param modelName Model to search
   * @param items Array of items to find or create
   * @param alwaysCreate If true, always creates a new entry
   */
  static async manageEntities(
    modelName: string,
    items: any[],
    alwaysCreate = false,
  ) {
    if (!items || !Array.isArray(items)) return [];

    const results = [];
    for (const item of items) {
      const searchCriteria = { ...item };
      delete searchCriteria.createdAt;
      delete searchCriteria.updatedAt;
      delete searchCriteria.tids;
      delete searchCriteria.sees;
      delete searchCriteria.dds;

      if (alwaysCreate) {
        // Always create a new record
        const entity = await models[modelName].create(searchCriteria);
        results.push(entity);
      } else {
        let entity;
        if (searchCriteria.id) {
          // Find the existing record by ID
          entity = await models[modelName].findByPk(searchCriteria.id);
          if (entity) {
            // Update the record if it exists
            await entity.update(searchCriteria);
          }
        }

        if (!entity) {
          // If no matching record exists, create a new one
          [entity] = await models[modelName].findOrCreate({
            where: searchCriteria,
            defaults: searchCriteria,
          });
        }

        results.push(entity);
      }
    }

    return results;
  }
}
