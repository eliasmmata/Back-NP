import mysql from "mysql2/promise";
import { config } from "./config.js";

// Declare a pool variable
let pool;

export const connect = async () => {
  try {
    if (!pool) {
      // Create a connection pool if it doesn't exist
      pool = mysql.createPool(config);
    }

    const connection = await pool.getConnection();
    console.log("Conexión a MySQL exitosa");
    return connection;
  } catch (error) {
    // Handle connection errors
    console.error("Error conectando a Base de Datos:", error);
    throw error; // Rethrow the error to handle it where this function is called
  }
};
