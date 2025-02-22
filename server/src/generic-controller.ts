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

    return instance.get({ plain: true });
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

  /** 🔹 Process and associate related records */
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
      const singularModelName = this.capitalize(relationKey).replace(/s$/, ""); // Convert to singular

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
      console.log(`Instance has methods:`, Object.keys(instance));

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

  /** 🔹 Get all records, including valid relationships */
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

  /** 🔹 Get a single record by ID, including valid relationships */
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

  /** 🔹 Update a record, allowing append or set for relations */
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

    return instance.get({ plain: true });
  }

  /** 🔹 Delete a record by ID */
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

  /** 🔹 Filter records dynamically based on provided query parameters */
  //   static async filter<T extends ModelKey>(modelName: T, filters: any) {
  //     console.log(`Filtering ${modelName} with filters:`, filters);

  //     // Format model name (ensure singular and capitalized)
  //     const formattedName = this.formatModelName(modelName);
  //     const model = models[formattedName];

  //     if (!model) throw new Error(`Invalid model name: ${modelName}`);

  //     // Prepare query conditions for Sequelize
  //     const whereConditions: Record<string, any> = {};
  //     const includeRelations: any[] = [];

  //     for (const key in filters) {
  //       if (!filters[key]) continue; // Ignore empty filters

  //       if (Object.keys((model as any).rawAttributes).includes(key)) {
  //         // Field exists in model attributes → Direct filter
  //         whereConditions[key] = { [Op.like]: `%${filters[key]}%` };
  //       } else if ((model as any).associations[key]) {
  //         // If it's a valid association, attempt to filter related models
  //         console.log(`Including relation for filtering: ${key}`);
  //         includeRelations.push({
  //           model: models[key.charAt(0).toUpperCase() + key.slice(1)], // Convert to correct model name
  //           where: { name: { [Op.like]: `%${filters[key]}%` } }, // Match related model names
  //         });
  //       }
  //     }

  //     console.log("Final WHERE conditions:", whereConditions);
  //     console.log(
  //       "Including relations:",
  //       includeRelations.map((r) => r.model.name),
  //     );

  //     // Fetch filtered records, including related models
  //     const records = await model.findAll({
  //       where: whereConditions,
  //       include: includeRelations,
  //     });

  //     return records.map((r) => r.get({ plain: true }));
  //   }
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

      // Check if the field is a direct attribute of the model
      if (Object.keys((model as any).rawAttributes).includes(key)) {
        whereConditions[key] = { [Op.like]: `%${filters[key]}%` };
      } else if ((model as any).associations[key]) {
        // If it's a valid association, attempt to filter related models
        console.log(`Including relation for filtering: ${key}`);

        // Convert key to singular model name
        const relatedModelName =
          key.charAt(0).toUpperCase() + key.slice(1).replace(/s$/, "");

        if (models[relatedModelName]) {
          includeRelations.push({
            model: models[relatedModelName], // Use the related model
            required: true, // Ensures only records with a matching related entry are returned
            where: {
              name: { [Op.like]: `%${filters[key]}%` }, // Assuming `name` is the searchable field
            },
          });
        } else {
          console.warn(`No model found for relation: ${relatedModelName}`);
        }
      }
    }

    console.log("Final WHERE conditions:", whereConditions);
    console.log(
      "Including relations:",
      includeRelations.map((r) => r.model.name),
    );

    // Fetch filtered records, including related models
    const records = await model.findAll({
      where: whereConditions,
      include: includeRelations,
    });

    return records.map((r) => r.get({ plain: true }));
  }
}
