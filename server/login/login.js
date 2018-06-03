'use strict';

const { Client } = require('pg');
const { decode } = require('decode-verify-jwt');


exports.do = async (event, context) => {
  const body = JSON.parse(event.body);
  let claims;
  try {
    claims = await decode(body.token)
    console.log(claims);
  } catch (e) {}
  
  return {
    statusCode: 200,
    body: JSON.stringify(claims),
    headers: {
      "Access-Control-Allow-Origin" : "https://www.hadamba.com", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    }
  }
}