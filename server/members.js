'use strict';

const AWS = require('aws-sdk');
const { authenticateDynamo: authenticate } = require('./auth');
const { AuthError } = require('./errors');
const { list: listMembers } = require('./dao/members');

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
    AWS.config.update({region: 'eu-central-1'});
    const ddb = new AWS.DynamoDB.DocumentClient();
    await authenticate(ddb, event);
    const members = await listMembers(ddb);
    return response(200, { members });
  } catch (e) {
    console.error(e);
    if (e instanceof AuthError) {
      return response(401, {error_message: e.message});
    }
    return response(500, {error_message: e.message});
  }
};
