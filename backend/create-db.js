const { Client } = require('pg');

async function createDb() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: '1234',
    port: 5432,
    database: 'postgres', // Connect to default DB first
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
    
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='store_ratings'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE store_ratings;');
      console.log("Database 'store_ratings' created successfully.");
    } else {
      console.log("Database 'store_ratings' already exists.");
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }
}

createDb();
