const { Client } = require('pg');

function newDatabaseClient() {
  return new Client({
    host: process.env.RDS_ENDPOINT,
    database: 'elidebi',
    user: process.env.RDS_ADMIN,
    password: process.env.RDS_PASSWORD,
    port: 5432,
  })
}

exports.connect = async () => {
  const client = newDatabaseClient();
  await client.connect();
  return client;
}