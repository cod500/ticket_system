const express = require('express');
const { Pool, Client } = require('pg');


const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString: connectionString
});

module.exports = pool;