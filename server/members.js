'use strict';

const { connect } = require('database');
const { authenticate } = require('auth');

exports.list = async (event, context) => {
  try {
    const client = await connect();
    await authenticate(client, event);
  
    const res = await client.query('SELECT * FROM members');
    const members = res.rows;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ members }),
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      }
    } 
  } catch (e) {
    const client = await connect();
    await authenticate(client, event);

    const res = await client.query('SELECT * FROM members');
    const members = res.rows;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ members }),
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      }
    }
  }
};
