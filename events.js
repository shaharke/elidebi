'use strict';

const { Client } = require('pg')

async function newEvent(name, date) {
  const client = newDatabaseClient();
  await client.connect();
  
  const statement = 'INSERT INTO events(name, date) VALUES($1, $2)'
  const values = [name, date];
  
  const res = await client.query(statement, values);
  return res;
}

function newDatabaseClient() {
  return new Client({
    host: process.env.RDS_ENDPOINT,
    database: 'elidebi',
    user: process.env.RDS_ADMIN,
    password: process.env.RDS_PASSWORD,
    port: 5432,
  })
}

function success(newEvent) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'New event was added'
      // newEvent: newEvent
    }),
  };
}

exports.create = async (event, context) => {
  const { name, date } = event;
  return newEvent(name, date).then((result) => {
    const successResult = success(result)
    console.log('Successfuly created a new event', successResult);
    return successResult;
  })
};
