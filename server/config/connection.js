import { Sequelize } from "sequelize";
import "dotenv/config";

// Ensure the DATABASE_URL is provided in your .env file
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

/**
 * Establishes a connection to the database by authenticating the sequelize instance.
 * @returns {Promise<void>} A promise that resolves if the connection is successful,
 * or rejects with an error if it fails.
 */
export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    // Re-throw the error to be caught by the server startup logic
    throw error;
  }
};

// Export the sequelize instance for your models to use
export default sequelize;
