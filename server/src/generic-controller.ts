import { models } from "./models"; // Import all Sequelize models dynamically
import { Model, Op } from "sequelize";

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
      return null;
    }

    console.log(`Creating ${formattedName} with data:`, data);

    // Extract related data (arrays) and remove from main payload
    const relatedData = this.extractRelatedData(model, data);

    // Create the main instance
    const instance = await model.create(data);

    // Process and associate related records
    await this.processAssociations(instance, formattedName, relatedData, true);

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
  ): Record<string, number[]> {
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
        continue;
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
        throw new Error(`Some ${relationKey} not found or invalid`);
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
          throw new Error(`Expected only one ${relationKey} but got multiple`);
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
    if (!model) throw new Error(`Invalid model name: ${modelName}`);

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

    if (!model) throw new Error(`Invalid model name: ${modelName}`);

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

    if (!model) throw new Error(`Invalid model name: ${modelName}`);

    // Find the existing record
    const instance = await model.findByPk(id);
    if (!instance) {
      console.warn(`Record with ID ${id} not found in ${formattedName}`);
      return null;
    }

    // Extract related data (array of IDs) and remove them from main payload
    const relatedData = this.extractRelatedData(model, data);

    // Update non-related fields
    await instance.update(data);

    // Process and associate related records, handling empty arrays correctly
    await this.processAssociations(
      instance,
      formattedName,
      relatedData,
      append,
    );

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
      console.error(`Invalid model name: ${modelName}`);
      throw new Error(`Invalid model name: ${modelName}`);
    }

    // Attempt to delete the record
    const deletedCount = await model.destroy({ where: { id } });

    // Log and return result
    if (deletedCount === 0) {
      console.warn(`No record found with ID ${id} in ${formattedName}`);
    } else {
      console.log(`Successfully deleted ${formattedName} with ID ${id}`);
    }

    return deletedCount; // 0 if not found, 1 if deleted
  }

  /**  Filter records dynamically based on provided query parameters */
  static async filter<T extends ModelKey>(modelName: T, filters: any) {
    console.log(`Filtering ${modelName} with filters:`, filters);

    // Format model name (ensure singular and capitalized)
    const formattedName = this.formatModelName(modelName);
    const model = models[formattedName];

    if (!model) throw new Error(`Invalid model name: ${modelName}`);

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
            }
          } else {
            console.warn(`Invalid related model: ${relation}`);
          }
        } else {
          console.warn(`Invalid related model: ${relation}`);
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

  //   static async bulkCreate(data: any) {
  //     console.log(`Bulk creating entities...`);

  //     const createdInstances: Record<string, any[]> = {};
  //     const idMapping: Record<string, Record<number, number>> = {}; // Track old → new IDs

  //     // Step 1: Create standalone entities
  //     for (const modelName in data) {
  //       const formattedName = this.formatModelName(modelName);
  //       const model = models[formattedName];

  //       if (!model) {
  //         console.warn(`Skipping invalid model name: ${modelName}`);
  //         continue;
  //       }

  //       idMapping[modelName] = {}; // Initialize ID mapping for this model

  //       // Process each entity in the provided data
  //       createdInstances[modelName] = await Promise.all(
  //         data[modelName].map(async (item: any) => {
  //           const itemCopy = { ...item };
  //           delete itemCopy.id; // Remove user-provided ID to let DB generate it

  //           // Create a new entity
  //           const newEntity = await model.create(itemCopy);

  //           // Ensure ID retrieval works with explicit typing
  //           const newEntityId = newEntity.getDataValue("id") as number;

  //           if (item.id) {
  //             idMapping[modelName][item.id] = newEntityId; // Store mapping
  //           }

  //           return newEntity;
  //         }),
  //       );
  //     }

  //     console.log("Standalone entities created. Processing relationships...");

  //     // Step 2: Process relationships
  //     for (const modelName in data) {
  //       for (const instanceData of data[modelName]) {
  //         const newId = instanceData.id
  //           ? idMapping[modelName][instanceData.id] || instanceData.id
  //           : createdInstances[modelName].find(
  //               (inst) => inst.name === instanceData.name,
  //             )?.id;

  //         if (!newId) continue;

  //         const instance = createdInstances[modelName].find(
  //           (inst) => inst.id === newId,
  //         );

  //         const relatedData = this.extractRelatedData(
  //           models[this.formatModelName(modelName)],
  //           instanceData,
  //         );

  //         // Replace old IDs with new ones in relationships
  //         for (const key in relatedData) {
  //           relatedData[key] = relatedData[key].map(
  //             (oldId: number) => idMapping[key]?.[oldId] || oldId,
  //           );
  //         }

  //         await this.processAssociations(instance, modelName, relatedData, true);
  //       }
  //     }

  //     console.log("Bulk creation completed.");
  //     return createdInstances;
  //   }

  // bugg code below, setting relationships with temps ids
  //   static async bulkCreate(data: any) {
  //     console.log(`Bulk creating entities...`);

  //     const createdInstances: Record<string, any[]> = {};
  //     const idMapping: Record<string, Record<number, number>> = {}; // Map temp_id → real DB ID

  //     // Step 1: Create standalone entities first (ignore relationships for now)
  //     for (const modelName in data) {
  //       const formattedName = this.formatModelName(modelName);
  //       const model = models[formattedName];

  //       if (!model) {
  //         console.warn(`Skipping invalid model name: ${modelName}`);
  //         continue;
  //       }

  //       idMapping[modelName] = {}; // Initialize mapping for this model

  //       // Create entities
  //       createdInstances[modelName] = await Promise.all(
  //         data[modelName].map(async (item: any) => {
  //           const itemCopy = { ...item };
  //           delete itemCopy.temp_id; // Remove user-provided temp_id

  //           // Create entity in DB
  //           const newEntity = await model.create(itemCopy);
  //           const newEntityId = newEntity.getDataValue("id") as number; // Get DB-assigned ID

  //           if (item.temp_id) {
  //             idMapping[modelName][item.temp_id] = newEntityId; // Store temp_id → real_id mapping
  //           }

  //           return newEntity;
  //         }),
  //       );
  //     }

  //     console.log("Standalone entities created. Processing relationships...");

  //     // Step 2: Process relationships now that all IDs are known
  //     for (const modelName in data) {
  //       for (const instanceData of data[modelName]) {
  //         const newId = idMapping[modelName][instanceData.temp_id];

  //         if (!newId) continue;

  //         const instance = createdInstances[modelName].find(
  //           (inst) => inst.id === newId,
  //         );

  //         const relatedData = this.extractRelatedData(
  //           models[this.formatModelName(modelName)],
  //           instanceData,
  //         );

  //         // **Fix: Replace temp IDs with real database IDs**
  //         for (const key in relatedData) {
  //           relatedData[key] = relatedData[key].map(
  //             (tempId: number) => idMapping[key]?.[tempId] || tempId,
  //           );
  //         }

  //         // Process relationships correctly
  //         await this.processAssociations(instance, modelName, relatedData, true);
  //       }
  //     }

  //     console.log("Bulk creation completed.");
  //     return createdInstances;
  //   }
}
