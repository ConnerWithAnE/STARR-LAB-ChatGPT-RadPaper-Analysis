import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  HasManyAddAssociationMixin,
  BelongsToManyAddAssociationMixin,
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
  declare addPapers: BelongsToManyAddAssociationMixin<Paper, number>;
}

Author.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false, unique: true },
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

  // Mixins for associations
  declare addAuthor: BelongsToManyAddAssociationMixin<Author, number>;
  declare addAuthors: BelongsToManyAddAssociationMixin<Author, number>;
  declare addPart: BelongsToManyAddAssociationMixin<Part, number>;
  declare addParts: BelongsToManyAddAssociationMixin<Part, number>;
  declare addTestingData: HasManyAddAssociationMixin<TestingData, number>;
  declare addTestingDatas: HasManyAddAssociationMixin<TestingData, number>;
}

Paper.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    year: { type: DataTypes.INTEGER },
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

  // Mixins for associations
  declare addPaper: BelongsToManyAddAssociationMixin<Paper, number>;
  declare addPapers: BelongsToManyAddAssociationMixin<Paper, number>;
  declare addTestingData: HasManyAddAssociationMixin<TestingData, number>;
  declare addTestingDatas: HasManyAddAssociationMixin<TestingData, number>;
}

Part.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false, unique: true },
    type: { type: DataTypes.TEXT },
    manufacturer: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "part" },
);

// ------------------ PAPER-PART RELATIONSHIP ------------------
class PaperPart extends Model {}
PaperPart.init({}, { sequelize, modelName: "paper_part" });
Paper.belongsToMany(Part, { through: PaperPart });
Part.belongsToMany(Paper, { through: PaperPart });

// ------------------ TESTING DATA TABLE ------------------
class TestingData extends Model<
  InferAttributes<TestingData>,
  InferCreationAttributes<TestingData>
> {
  declare id: CreationOptional<number>;
  declare testing_type: "TID" | "SEE" | "DD";
  declare max_fluence: number;
  declare energy: number;
  declare facility: string;
  declare environment: string;
  declare terrestrial: boolean;
  declare flight: boolean;

  // Foreign Keys
  declare paperId: ForeignKey<Paper["id"]>;
  declare partId: ForeignKey<Part["id"]>;

  // Mixin for association
  declare addTIDData: HasManyAddAssociationMixin<TIDData, number>;
  declare addSEEData: HasManyAddAssociationMixin<SEEData, number>;
  declare addDDData: HasManyAddAssociationMixin<DDData, number>;
}

TestingData.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    testing_type: { type: DataTypes.ENUM("TID", "SEE", "DD") },
    max_fluence: { type: DataTypes.FLOAT },
    energy: { type: DataTypes.FLOAT },
    facility: { type: DataTypes.TEXT },
    environment: { type: DataTypes.TEXT },
    terrestrial: { type: DataTypes.BOOLEAN },
    flight: { type: DataTypes.BOOLEAN },
  },
  { sequelize, modelName: "testing_data" },
);

Paper.hasMany(TestingData, { foreignKey: "paperId" });
Part.hasMany(TestingData, { foreignKey: "partId" });
TestingData.belongsTo(Paper, {
  foreignKey: "paperId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

TestingData.belongsTo(Part, {
  foreignKey: "partId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// ------------------ TID DATA TABLE ------------------
class TIDData extends Model<
  InferAttributes<TIDData>,
  InferCreationAttributes<TIDData>
> {
  declare id: CreationOptional<number>;
  declare source: "Co60" | "Protons" | "Electrons" | "Heavy ions" | "X-rays";
  declare max_tid: number;
  declare dose_rate: number;
  declare eldrs: boolean;
  declare p_pion: boolean;
  declare dose_to_failure: number;
  declare increased_power_usage: boolean;
  declare power_usage_description: string;
  declare special_notes?: string;

  // Foreign Key
  declare testingDataId: ForeignKey<TestingData["id"]>;
}

TIDData.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    source: {
      type: DataTypes.ENUM(
        "Co60",
        "Protons",
        "Electrons",
        "Heavy ions",
        "X-rays",
      ),
    },
    max_tid: { type: DataTypes.FLOAT },
    dose_rate: { type: DataTypes.FLOAT },
    eldrs: { type: DataTypes.BOOLEAN },
    p_pion: { type: DataTypes.BOOLEAN },
    dose_to_failure: { type: DataTypes.FLOAT },
    increased_power_usage: { type: DataTypes.BOOLEAN },
    power_usage_description: { type: DataTypes.TEXT },
    special_notes: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "tid_data" },
);

TestingData.hasOne(TIDData);
TIDData.belongsTo(TestingData);

// ----------------- SEE DATA TABLE -----------------
class SEEData extends Model<
  InferAttributes<SEEData>,
  InferCreationAttributes<SEEData>
> {
  declare id: CreationOptional<number>;
  declare source: "Heavy ions" | "Protons" | "Laser" | "Neutron" | "Electron";
  declare type:
    | "Single Event Upset"
    | "Single Event Transient"
    | "Single Event Functional Interrupt"
    | "Single Event Latch-up"
    | "Single Event Burnout"
    | "Single Event Gate Rupture";
  declare amplitude: number;
  declare duration: number;
  declare cross_section: number;
  declare cross_section_type: string;
  declare special_notes?: string;

  declare testingDataId: ForeignKey<TestingData["id"]>;
}

SEEData.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    source: {
      type: DataTypes.ENUM(
        "Heavy ions",
        "Protons",
        "Laser",
        "Neutron",
        "Electron",
      ),
    },
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
    amplitude: { type: DataTypes.FLOAT },
    duration: { type: DataTypes.FLOAT },
    cross_section: { type: DataTypes.FLOAT },
    cross_section_type: { type: DataTypes.TEXT },
    special_notes: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "see_data" },
);

TestingData.hasOne(SEEData);
SEEData.belongsTo(TestingData);

// ----------------- DD DATA TABLE -----------------
class DDData extends Model<
  InferAttributes<DDData>,
  InferCreationAttributes<DDData>
> {
  declare id: CreationOptional<number>;
  declare source: "Protons" | "Neutrons";
  declare damage_level: number;
  declare damage_level_description: string;
  declare special_notes?: string;

  // Foreign key reference
  declare testingDataId: ForeignKey<TestingData["id"]>;
}

DDData.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    source: { type: DataTypes.ENUM("Protons", "Neutrons") },
    damage_level: { type: DataTypes.FLOAT },
    damage_level_description: { type: DataTypes.TEXT },
    special_notes: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "dd_data" },
);

TestingData.hasOne(DDData);
DDData.belongsTo(TestingData);

export {
  Author,
  Paper,
  Part,
  PaperAuthor,
  PaperPart,
  TestingData,
  TIDData,
  SEEData,
  DDData,
  sequelize,
};
