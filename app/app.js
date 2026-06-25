const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

// -------------------------
// DB CONFIG (from ENV vars)
// -------------------------
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool (BEST PRACTICE)
const pool = mysql.createPool(dbConfig);

// -------------------------
// HEALTH CHECK (for probes)
// -------------------------
app.get("/health", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    res.status(200).send("OK");
  } catch (err) {
    console.error("Health check failed:", err.message);
    res.status(500).send("FAIL");
  }
});

// -------------------------
// MAIN API - Fetch Employees
// -------------------------
app.get("/employees", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employees");
    res.json({
        version: "v4",
        employees: rows
    });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Database query failed" });
  }
});

// -------------------------
// ROOT ENDPOINT
// -------------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});