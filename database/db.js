const express = require('express');
const { Pool, Client } = require('pg');


const connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
    connectionString: connectionString
});

module.exports = pool;