require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});
// init tables
pool.query('CREATE TABLE IF NOT EXISTS users (person_id SERIAL PRIMARY KEY, username VARCHAR(256) UNIQUE NOT NULL, password VARCHAR(256) NOT NULL)');

module.exports = pool;