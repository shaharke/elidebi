'use strict';

const { connect } = require('database');
const { authenticate } = require('auth');
const { AuthError } = require('errors');

function response(code, body, domain) {
  return {
    statusCode: code,
    body: body ? JSON.stringify(body) : body,
    headers: {
      "Access-Control-Allow-Origin" : domain ? domain : "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    }
  }
}

exports.list = async (event, context) => {
  try {
    const client = await connect();
    await authenticate(client, event);
  
    const res = await client.query('SELECT * FROM members');
    const members = res.rows;
    
    return response(200, { members });
  } catch (e) {
    console.error(e);
    if (e instanceof AuthError) {
      return response(401, {error_message: e.message});
    }
    return response(500, {error_message: e.message});
  }
};
