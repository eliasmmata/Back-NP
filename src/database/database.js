import mysql from "mysql2/promise";
import { config } from "./config.js";

let pool; // Declare a pool variable

export const connect = async () => {
  if (!pool) {
    // Create a connection pool if it doesn't exist
    pool = mysql.createPool(config);
  }

  const connection = await pool.getConnection();

  return connection;
};