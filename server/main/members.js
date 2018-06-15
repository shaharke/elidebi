'use strict';

const { Client } = require('pg')

function newDatabaseClient() {
  return new Client({
    host: process.env.RDS_ENDPOINT,
    database: 'elidebi',
    user: process.env.RDS_ADMIN,
    password: process.env.RDS_PASSWORD,
    port: 5432,
  })
}

exports.list = async (event, context) => {
  const client = newDatabaseClient();
  await client.connect();

  const res = await client.query('SELECT * FROM members');
  const members = res.rows;
  
  return {
    statusCode: 200,
    body: JSON.stringify({ members })
  }
};
