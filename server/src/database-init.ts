import { Sequelize } from "sequelize";
import path from "path";

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "../databaseb.db"),
  // logging: false
});

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync all defined models to the database
    await sequelize.sync({ alter: true }); // `alter: true` will update tables to match the models
    console.log("Database schema synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database or sync schema:", error);
    throw error;
  }
};

export { sequelize, initializeDatabase };
import "./models";
