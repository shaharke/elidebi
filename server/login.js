'use strict';

const { Client } = require('pg')

exports.do = async (event, context) => {
  console.log(event);
  return {
    statusCode: 200
  }
}