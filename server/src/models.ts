import { DataTypes, Model } from "sequelize";
import { sequelize } from "./database-init";

// Authors Table
class Author extends Model {}
Author.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize, modelName: "author" },
);

// Papers Table
class Paper extends Model {}
Paper.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize, modelName: "paper" },
);

// Paper-Author Relationship Table
class PaperAuthor extends Model {}
PaperAuthor.init({}, { sequelize, modelName: "paper_author" });
Paper.belongsToMany(Author, { through: PaperAuthor });
Author.belongsToMany(Paper, { through: PaperAuthor });

// Parts Table
class Part extends Model {}
Part.init(
  {
    part_number: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.TEXT,
    },
    manufacturer: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "part" },
);

// Paper-Part Relationship Table
class PaperPart extends Model {}
PaperPart.init({}, { sequelize, modelName: "paper_part" });
Paper.belongsToMany(Part, { through: PaperPart });
Part.belongsToMany(Paper, { through: PaperPart });

// Testing Data Table
class TestingData extends Model {}
TestingData.init(
  {
    testing_type: {
      type: DataTypes.ENUM("TID", "SEE", "DD"),
    },
    max_fluence: {
      type: DataTypes.FLOAT,
    },
    energy: {
      type: DataTypes.FLOAT,
    },
    facility: {
      type: DataTypes.TEXT,
    },
    environment: {
      type: DataTypes.TEXT,
    },
    terrestrial: {
      type: DataTypes.BOOLEAN,
    },
    flight: {
      type: DataTypes.BOOLEAN,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "testing_data" },
);
PaperPart.hasMany(TestingData);
TestingData.belongsTo(PaperPart);

// TID Data Table
class TIDData extends Model {}
TIDData.init(
  {
    source: {
      type: DataTypes.ENUM(
        "Co60",
        "Protons",
        "Electrons",
        "Heavy ions",
        "X-rays",
      ),
    },
    max_tid: {
      type: DataTypes.FLOAT,
    },
    dose_rate: {
      type: DataTypes.FLOAT,
    },
    eldrs: {
      type: DataTypes.BOOLEAN,
    },
    p_pion: {
      type: DataTypes.BOOLEAN,
    },
    dose_to_failure: {
      type: DataTypes.FLOAT,
    },
    increased_power_usage: {
      type: DataTypes.BOOLEAN,
    },
    power_usage_description: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "tid_data" },
);
TestingData.hasOne(TIDData);
TIDData.belongsTo(TestingData);

// SEE Data Table
class SEEData extends Model {}
SEEData.init(
  {
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
    amplitude: {
      type: DataTypes.FLOAT,
    },
    duration: {
      type: DataTypes.FLOAT,
    },
    cross_section: {
      type: DataTypes.FLOAT,
    },
    cross_section_type: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "see_data" },
);
TestingData.hasOne(SEEData);
SEEData.belongsTo(TestingData);

// DD Data Table
class DDData extends Model {}
DDData.init(
  {
    source: {
      type: DataTypes.ENUM("Protons", "Neutrons"),
    },
    damage_level: {
      type: DataTypes.FLOAT,
    },
    damage_level_description: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "dd_data" },
);
TestingData.hasOne(DDData);
DDData.belongsTo(TestingData);
