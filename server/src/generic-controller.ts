import { models } from "./models"; // Import all Sequelize models dynamically
import { Model, Op } from "sequelize";
import { sequelize } from "./database-init";
import { Author, Paper, Part, Tid, See, Dd } from "./models";

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

  /** Format model name: Singularize and capitalize */
  private static formatModelName(name: string): string {
    return name.replace(/s$/, "").replace(/^./, (c) => c.toUpperCase());
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

  /**  Capitalize first letter of a string */
  private static capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
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
              } else if (fieldType.constructor.name.includes("TEXT")) {
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

    return records.map((r) => r.get({ plain: true }));
  }
  /** Close the database connection */
  async closeDB(): Promise<void> {
    await sequelize.close();
    console.log("Database connection closed successfully");
  }

  // static async createFullPaper(data: any) {
  //   console.log("Processing full paper creation:", data);

  //   // Extract and validate main paper data
  //   const paperData = { ...data };
  //   delete paperData.authors;
  //   delete paperData.parts;
  //   delete paperData.tids;
  //   delete paperData.sees;
  //   delete paperData.dds;

  //   // Find or Create Paper
  //   const [paper, paperCreated] =
  //     await models.Paper.findOrCreate({
  //       where: { name: paperData.name, year: paperData.year },
  //       defaults: paperData,
  //     })as [Paper, boolean];

  //   console.log(
  //     `Paper ${paperCreated ? "created" : "found"}:`,
  //     paper.get({ plain: true }),
  //   );

  //   // Helper function to find or create entities dynamically
  //   async function findOrCreateEntity(modelName: string, items: any[]) {
  //     if (!items || !Array.isArray(items)) return [];

  //     return await Promise.all(
  //       items.map(async (item) => {
  //         const searchCriteria = { ...item };
  //         delete searchCriteria.id;
  //         delete searchCriteria.createdAt;
  //         delete searchCriteria.updatedAt;

  //         const [entity] = await models[modelName].findOrCreate({
  //           where: searchCriteria,
  //           defaults: item,
  //         });

  //         return entity;
  //       }),
  //     );
  //   }

  //   // Find or Create Authors
  //   const authors = await findOrCreateEntity("Author", data.authors) as Author[];
  //   if (authors.length) await paper.addAuthors(authors);

  //   // Find or Create Parts
  //   const parts = await findOrCreateEntity("Part", data.parts) as Part[];
  //   if (parts.length) await paper.addParts(parts);

  //   // Find or Create TIDs and Link to Paper & Parts
  //   const tids = await findOrCreateEntity("Tid", data.tids) as Tid[];
  //   for (const tid of tids) {
  //     await tid.setPaper(paper);
  //     const linkedPart = parts.find((p) => p.name === tid.name);
  //     if (linkedPart) await tid.setPart(linkedPart);
  //   }

  //   // Find or Create SEEs and Link to Paper & Parts
  //   const sees = await findOrCreateEntity("See", data.sees) as See[];
  //   for (const see of sees) {
  //     await see.setPaper(paper);
  //     const linkedPart = parts.find((p) => p.name === see.name);
  //     if (linkedPart) await see.setPart(linkedPart);
  //   }

  //   // Find or Create DDs and Link to Paper & Parts
  //   const dds = await findOrCreateEntity("Dd", data.dds) as Dd[];
  //   for (const dd of dds) {
  //     await dd.setPaper(paper);
  //     const linkedPart = parts.find((p) => p.name === dd.name);
  //     if (linkedPart) await dd.setPart(linkedPart);
  //   }

  //   console.log("Paper and all related entities processed successfully.");

  //   return {
  //     paper: paper.get({ plain: true }),
  //     authors: authors.map((a) => a.get({ plain: true })),
  //     parts: parts.map((p) => p.get({ plain: true })),
  //     tids: tids.map((t) => t.get({ plain: true })),
  //     sees: sees.map((s) => s.get({ plain: true })),
  //     dds: dds.map((d) => d.get({ plain: true })),
  //   };
  // }

  // static async createFullPaper(data: any) {
  //   console.log("Processing full paper creation:", data);

  //   // Extract and validate main paper data
  //   const paperData = { ...data };
  //   delete paperData.authors;
  //   delete paperData.parts;

  //   // Find or Create Paper
  //   const [paper, paperCreated] = (await models.Paper.findOrCreate({
  //     where: { name: paperData.name, year: paperData.year },
  //     defaults: paperData,
  //   })) as [Paper, boolean];

  //   console.log(
  //     `Paper ${paperCreated ? "created" : "found"}:`,
  //     paper.get({ plain: true }),
  //   );

  //   async function findOrCreateEntity(modelName: string, items: any[]) {
  //     if (!items || !Array.isArray(items)) return [];

  //     const results = [];
  //     for (const item of items) {
  //       const searchCriteria = { ...item };
  //       delete searchCriteria.id;
  //       delete searchCriteria.createdAt;
  //       delete searchCriteria.updatedAt;

  //       const [entity] = await models[modelName].findOrCreate({
  //         where: searchCriteria,
  //         defaults: item,
  //       });

  //       results.push(entity);
  //     }

  //     return results;
  //   }

  //   // Find or Create Authors and Associate with Paper
  //   const authors = (await findOrCreateEntity(
  //     "Author",
  //     data.authors,
  //   )) as Author[];
  //   if (authors.length) await paper.addAuthors(authors);

  //   // Find or Create Parts and Associate with Paper
  //   const parts = (await findOrCreateEntity("Part", data.parts)) as Part[];
  //   if (parts.length) await paper.addParts(parts);

  //   // Process tids, sees, and dds inside each part
  //   for (const partData of data.parts) {
  //     // Find the corresponding Part entity
  //     const part = parts.find((p) => p.name === partData.name);
  //     if (!part) continue;

  //     // Process TIDs
  //     if (partData.tids && partData.tids.length > 0) {
  //       const tids = (await findOrCreateEntity("Tid", partData.tids)) as Tid[];
  //       for (const tid of tids) {
  //         await tid.setPaper(paper); // Associate with paper
  //         await tid.setPart(part); // Associate with part
  //       }
  //     }

  //     // Process SEEs
  //     if (partData.sees && partData.sees.length > 0) {
  //       const sees = (await findOrCreateEntity("See", partData.sees)) as See[];
  //       for (const see of sees) {
  //         await see.setPaper(paper); // Associate with paper
  //         await see.setPart(part); // Associate with part
  //       }
  //     }

  //     // Process DDs
  //     if (partData.dds && partData.dds.length > 0) {
  //       const dds = (await findOrCreateEntity("Dd", partData.dds)) as Dd[];
  //       for (const dd of dds) {
  //         await dd.setPaper(paper); // Associate with paper
  //         await dd.setPart(part); // Associate with part
  //       }
  //     }
  //   }

  //   console.log("Paper and all related entities processed successfully.");

  //   return {
  //     paper: paper.get({ plain: true }),
  //     authors: authors.map((a) => a.get({ plain: true })),
  //     parts: parts.map((p) => p.get({ plain: true })),
  //   };
  // }

  static async createFullPaper(data: any) {
    console.log("Processing full paper creation:", data);

    // Extract and validate main paper data
    const paperData = { ...data };
    delete paperData.authors;
    delete paperData.parts;

    // Find or Create Paper
    const [paper, paperCreated] = (await models.Paper.findOrCreate({
      where: { name: paperData.name, year: paperData.year },
      defaults: paperData,
    })) as [Paper, boolean];

    console.log(
      `Paper ${paperCreated ? "created" : "found"}:`,
      paper.get({ plain: true }),
    );

    async function findOrCreateEntity(modelName: string, items: any[]) {
      if (!items || !Array.isArray(items)) return [];

      const results = [];
      for (const item of items) {
        const searchCriteria = { ...item };
        delete searchCriteria.id;
        delete searchCriteria.createdAt;
        delete searchCriteria.updatedAt;
        delete searchCriteria.tids;
        delete searchCriteria.sees;
        delete searchCriteria.dds;

        const [entity] = await models[modelName].findOrCreate({
          where: searchCriteria,
          defaults: searchCriteria,
        });

        results.push(entity);
      }

      return results;
    }

    // Find or Create Authors
    const authors = (await findOrCreateEntity(
      "Author",
      data.authors,
    )) as Author[];
    if (authors.length) await paper.addAuthors(authors);

    // Find or Create Parts
    const parts = (await findOrCreateEntity("Part", data.parts)) as Part[];
    if (parts.length) await paper.addParts(parts);

    // Process TIDs, SEEs, and DDS inside each part
    for (const partData of data.parts) {
      const part = parts.find((p) => p.name === partData.name);
      if (!part) continue;

      // Create TIDs
      if (partData.tids) {
        const tids = (await findOrCreateEntity("Tid", partData.tids)) as Tid[];
        for (const tid of tids) {
          await tid.setPaper(paper);
          await tid.setPart(part);
        }
      }

      // Create SEEs
      if (partData.sees) {
        const sees = (await findOrCreateEntity("See", partData.sees)) as See[];
        for (const see of sees) {
          await see.setPaper(paper);
          await see.setPart(part);
        }
      }

      // Create DDS
      if (partData.dds) {
        const dds = (await findOrCreateEntity("Dd", partData.dds)) as Dd[];
        for (const dd of dds) {
          await dd.setPaper(paper);
          await dd.setPart(part);
        }
      }
    }

    console.log("Paper and all related entities processed successfully.");

    return {
      paper: paper.get({ plain: true }),
      authors: authors.map((a) => a.get({ plain: true })),
      parts: parts.map((p) => p.get({ plain: true })),
    };
  }
}
