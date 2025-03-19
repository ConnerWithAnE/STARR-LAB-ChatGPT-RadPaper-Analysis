import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  ModelStatic,
} from "sequelize";
import { sequelize } from "./database-init";

// NOTE: The following `declare` statements are for TypeScript type safety.

// ------------------ AUTHOR TABLE ------------------
class Author extends Model<
  InferAttributes<Author>,
  InferCreationAttributes<Author>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  // Mixin for associations
  declare addPaper: BelongsToManyAddAssociationMixin<Paper, number>;
  declare addPapers: BelongsToManyAddAssociationsMixin<Paper, number>;
  declare setPapers: BelongsToManyAddAssociationsMixin<Paper, number>;
}

Author.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
  },
  { sequelize, modelName: "author" },
);

// ------------------ PAPER TABLE ------------------
class Paper extends Model<
  InferAttributes<Paper>,
  InferCreationAttributes<Paper>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare year: number;
  declare objective: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Mixins for associations
  declare addAuthor: BelongsToManyAddAssociationMixin<Author, number>;
  declare addAuthors: BelongsToManyAddAssociationsMixin<Author, number>;
  declare setAuthors: BelongsToManyAddAssociationsMixin<Author, number>;
  declare addPart: BelongsToManyAddAssociationMixin<Part, number>;
  declare addParts: BelongsToManyAddAssociationsMixin<Part, number>;
  declare setParts: BelongsToManyAddAssociationsMixin<Part, number>;
  // declare addTest: HasManyAddAssociationMixin<Test, number>;
  // declare addTests: HasManyAddAssociationsMixin<Test, number>;
  declare addTid: HasManyAddAssociationMixin<Tid, number>;
  declare addTids: HasManyAddAssociationsMixin<Tid, number>;
  declare setTids: HasManyAddAssociationsMixin<Tid, number>;
  declare removeTids: HasManyAddAssociationsMixin<Tid, number>;
  declare addSee: HasManyAddAssociationMixin<See, number>;
  declare addSees: HasManyAddAssociationsMixin<See, number>;
  declare setSees: HasManyAddAssociationsMixin<See, number>;
  declare removeSees: HasManyAddAssociationsMixin<See, number>;
  declare addDd: HasManyAddAssociationMixin<Dd, number>;
  declare addDds: HasManyAddAssociationsMixin<Dd, number>;
  declare setDds: HasManyAddAssociationsMixin<Dd, number>;
  declare removeDds: HasManyAddAssociationsMixin<Dd, number>;
}

Paper.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    year: { type: DataTypes.INTEGER },
    objective: { type: DataTypes.TEXT },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "paper" },
);

// ------------------ PAPER-AUTHOR RELATIONSHIP ------------------
class PaperAuthor extends Model {}
PaperAuthor.init({}, { sequelize, modelName: "paper_author" });
Paper.belongsToMany(Author, { through: PaperAuthor });
Author.belongsToMany(Paper, { through: PaperAuthor });

// ------------------ PART TABLE ------------------
class Part extends Model<InferAttributes<Part>, InferCreationAttributes<Part>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare type: string;
  declare manufacturer: string;
  declare other_details: string;

  // Mixins for associations
  declare addPaper: BelongsToManyAddAssociationMixin<Paper, number>;
  declare addPapers: BelongsToManyAddAssociationsMixin<Paper, number>;
  // declare addTest: HasManyAddAssociationMixin<Test, number>;
  // declare addTests: HasManyAddAssociationsMixin<Test, number>;
  declare addTid: HasManyAddAssociationMixin<Tid, number>;
  declare addTids: HasManyAddAssociationsMixin<Tid, number>;
  declare setTids: HasManyAddAssociationsMixin<Tid, number>;
  declare removeTids: HasManyAddAssociationsMixin<Tid, number>;
  declare addSee: HasManyAddAssociationMixin<See, number>;
  declare addSees: HasManyAddAssociationsMixin<See, number>;
  declare setSees: HasManyAddAssociationsMixin<See, number>;
  declare removeSees: HasManyAddAssociationsMixin<See, number>;
  declare addDd: HasManyAddAssociationMixin<Dd, number>;
  declare addDds: HasManyAddAssociationsMixin<Dd, number>;
  declare setDds: HasManyAddAssociationsMixin<Dd, number>;
  declare removeDds: HasManyAddAssociationsMixin<Dd, number>;
}

Part.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.TEXT },
    manufacturer: { type: DataTypes.TEXT },
    other_details: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "part" },
);

// ------------------ PAPER-PART RELATIONSHIP ------------------
class PaperPart extends Model {}
PaperPart.init({}, { sequelize, modelName: "paper_part" });
Paper.belongsToMany(Part, { through: PaperPart });
Part.belongsToMany(Paper, { through: PaperPart });

// ------------------ TESTING DATA TABLE ------------------
// class Test extends Model<InferAttributes<Test>, InferCreationAttributes<Test>> {
//   declare id: CreationOptional<number>;
//   declare testing_type: "TID" | "SEE" | "DD";
//   declare max_fluence: number;
//   declare energy_levels: number;
//   declare facility_name: string;
//   declare environmental_conditions: string;
//   declare terrestrial: boolean;
//   declare flight: boolean;

//   // Foreign Keys
//   declare paperId: ForeignKey<Paper["id"]>;
//   declare partId: ForeignKey<Part["id"]>;

//   // Mixin for association
//   declare addTid: HasManyAddAssociationMixin<Tid, number>;
//   declare addSee: HasManyAddAssociationMixin<See, number>;
//   declare addDd: HasManyAddAssociationMixin<Dd, number>;
// }

// Test.init(
//   {
//     id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     testing_type: { type: DataTypes.ENUM("TID", "SEE", "DD") },
//     max_fluence: { type: DataTypes.FLOAT },
//     energy_levels: { type: DataTypes.FLOAT },
//     facility_name: { type: DataTypes.TEXT },
//     environmental_conditions: { type: DataTypes.TEXT },
//     terrestrial: { type: DataTypes.BOOLEAN },
//     flight: { type: DataTypes.BOOLEAN },
//   },
//   { sequelize, modelName: "test" },
// );

// Paper.hasMany(Test, { foreignKey: "paperId" });
// Part.hasMany(Test, { foreignKey: "partId" });
// Test.belongsTo(Paper, {
//   foreignKey: "paperId",
//   onDelete: "SET NULL",
//   onUpdate: "CASCADE",
// });

// Test.belongsTo(Part, {
//   foreignKey: "partId",
//   onDelete: "SET NULL",
//   onUpdate: "CASCADE",
// });

// ------------------ TID DATA TABLE ------------------
class Tid extends Model<InferAttributes<Tid>, InferCreationAttributes<Tid>> {
  declare id: CreationOptional<number>;
  declare max_fluence: number;
  declare energy_levels: number;
  declare facility_name: string;
  declare environmental_conditions: string;
  declare terrestrial: boolean;
  declare flight: boolean;
  declare source:
    | "Co60"
    | "Protons"
    | "Electrons"
    | "Heavy ions"
    | "X-rays"
    | "Pions";
  declare max_tid: number;
  declare dose_rate: number;
  declare eldrs: boolean;
  declare dose_to_failure: number;
  declare increased_power_usage: boolean;
  declare power_usage_description: string;
  declare failing_time: string;
  declare special_notes?: string;

  // // Foreign Key
  // declare testId: ForeignKey<Test["id"]>;
  // Foreign Keys
  declare paperId: ForeignKey<Paper["id"]>;
  declare partId: ForeignKey<Part["id"]>;

  // Mixin for associations
  declare setPaper: BelongsToManyAddAssociationMixin<Paper, number>;
  declare setPart: BelongsToManyAddAssociationMixin<Part, number>;
}

Tid.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    max_fluence: { type: DataTypes.FLOAT },
    energy_levels: { type: DataTypes.FLOAT },
    facility_name: { type: DataTypes.TEXT },
    environmental_conditions: { type: DataTypes.TEXT },
    terrestrial: { type: DataTypes.BOOLEAN },
    flight: { type: DataTypes.BOOLEAN },
    source: {
      type: DataTypes.ENUM(
        "Co60",
        "Protons",
        "Electrons",
        "Heavy ions",
        "X-rays",
        "Pions",
      ),
    },
    max_tid: { type: DataTypes.FLOAT },
    dose_rate: { type: DataTypes.FLOAT },
    eldrs: { type: DataTypes.BOOLEAN },
    dose_to_failure: { type: DataTypes.FLOAT },
    increased_power_usage: { type: DataTypes.BOOLEAN },
    power_usage_description: { type: DataTypes.TEXT },
    failing_time: { type: DataTypes.TEXT },
    special_notes: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "tid" },
);
Paper.hasMany(Tid, { foreignKey: "paperId" });
Part.hasMany(Tid, { foreignKey: "partId" });
Tid.belongsTo(Paper, {
  foreignKey: "paperId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Tid.belongsTo(Part, {
  foreignKey: "partId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
// Test.hasOne(Tid);
// Tid.belongsTo(Test);

// ----------------- SEE DATA TABLE -----------------
class See extends Model<InferAttributes<See>, InferCreationAttributes<See>> {
  declare id: CreationOptional<number>;
  declare max_fluence: number;
  declare energy_levels: number;
  declare facility_name: string;
  declare environmental_conditions: string;
  declare terrestrial: boolean;
  declare flight: boolean;
  declare source: "Heavy ions" | "Protons" | "Laser" | "Neutron" | "Electron" | "X-rays";
  declare type: string;
  /*
  declare type:
    | "Single Event Upset"
    | "Single Event Transient"
    | "Single Event Functional Interrupt"
    | "Single Event Latch-up"
    | "Single Event Burnout"
    | "Single Event Gate Rupture";
    */
  declare amplitude: number;
  declare duration: number;
  declare cross_section_saturation: number;
  declare cross_section_threshold: number;
  declare cross_section_type: string;
  declare special_notes?: string;

  // declare testId: ForeignKey<Test["id"]>;
  // Foreign Keys
  declare paperId: ForeignKey<Paper["id"]>;
  declare partId: ForeignKey<Part["id"]>;

  // Mixin for associations
  declare setPaper: BelongsToManyAddAssociationMixin<Paper, number>;
  declare setPart: BelongsToManyAddAssociationMixin<Part, number>;
}

See.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    max_fluence: { type: DataTypes.FLOAT },
    energy_levels: { type: DataTypes.FLOAT },
    facility_name: { type: DataTypes.TEXT },
    environmental_conditions: { type: DataTypes.TEXT },
    terrestrial: { type: DataTypes.BOOLEAN },
    flight: { type: DataTypes.BOOLEAN },
    source: {
      type: DataTypes.ENUM(
        "Heavy ions",
        "Protons",
        "Laser",
        "Neutron",
        "Electron",
      ),
    },
    type: { type: DataTypes.TEXT },
    /*
    type: {
      type: DataTypes.ENUM(
        "Single Event Upset",
        "Single Event Transient",
        "Single Event Functional Interrupt",
        "Single Event Latch-up",
        "Single Event Burnout",
        "Single Event Gate Rupture",
      ),
    },
    */
    amplitude: { type: DataTypes.FLOAT },
    duration: { type: DataTypes.FLOAT },
    cross_section_saturation: { type: DataTypes.FLOAT },
    cross_section_threshold: { type: DataTypes.FLOAT },
    cross_section_type: { type: DataTypes.TEXT },
    special_notes: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "see" },
);

// Test.hasOne(See);
// See.belongsTo(Test);
Paper.hasMany(See, { foreignKey: "paperId" });
Part.hasMany(See, { foreignKey: "partId" });
See.belongsTo(Paper, {
  foreignKey: "paperId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

See.belongsTo(Part, {
  foreignKey: "partId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// ----------------- DD DATA TABLE -----------------
class Dd extends Model<InferAttributes<Dd>, InferCreationAttributes<Dd>> {
  declare id: CreationOptional<number>;
  declare max_fluence: number;
  declare energy_levels: number;
  declare facility_name: string;
  declare environmental_conditions: string;
  declare terrestrial: boolean;
  declare flight: boolean;
  declare source: "Protons" | "Neutrons";
  declare damage_level: number;
  declare damage_description: string;
  declare special_notes?: string;

  // // Foreign key reference
  // declare testId: ForeignKey<Test["id"]>;
  // Foreign Keys
  declare paperId: ForeignKey<Paper["id"]>;
  declare partId: ForeignKey<Part["id"]>;

  // Mixin for associations
  declare setPaper: BelongsToManyAddAssociationMixin<Paper, number>;
  declare setPart: BelongsToManyAddAssociationMixin<Part, number>;
}

Dd.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    max_fluence: { type: DataTypes.FLOAT },
    energy_levels: { type: DataTypes.FLOAT },
    facility_name: { type: DataTypes.TEXT },
    environmental_conditions: { type: DataTypes.TEXT },
    terrestrial: { type: DataTypes.BOOLEAN },
    flight: { type: DataTypes.BOOLEAN },
    source: { type: DataTypes.ENUM("Protons", "Neutrons") },
    damage_level: { type: DataTypes.FLOAT },
    damage_description: { type: DataTypes.TEXT },
    special_notes: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "dd" },
);

// Test.hasOne(Dd);
// Dd.belongsTo(Test);
Paper.hasMany(Dd, { foreignKey: "paperId" });
Part.hasMany(Dd, { foreignKey: "partId" });
Dd.belongsTo(Paper, {
  foreignKey: "paperId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Dd.belongsTo(Part, {
  foreignKey: "partId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

export {
  Author,
  Paper,
  Part,
  PaperAuthor,
  PaperPart,
  // Test,
  Tid,
  See,
  Dd,
  sequelize,
};
export const models: Record<string, ModelStatic<Model>> = {
  Author,
  Paper,
  Part,
  PaperAuthor,
  PaperPart,
  // Test,
  Tid,
  See,
  Dd,
};
