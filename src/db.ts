import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as number | undefined,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  statement_timeout: 5000,
  max: 10, // prevents DB overload,
  ssl: {
    rejectUnauthorized: false,
  },
});
