const _ = require('lodash');
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const moment = require('moment');

const { AuthError } = require('errors');
const { authenticateDynamo: authenticate } = require('auth')
const { list: listMembers } = require('./dao/members');
const { get: getEvent } = require('./dao/events');
const { getDraw: getDraw} = require('./dao/lotteries');
const { get: getMember } = require('./dao/members');

async function loadMembers(ddb) {
  const members = await listMembers(ddb);
  return members.map((member) => member.email);
}

async function selectEvent(ddb) {
  const event = await getEvent(ddb);
  return event.year;
}

async function selectDrawForMember(ddb, member) {
  const event = await getEvent(ddb);
  const draw = await getDraw(ddb, member, event);
  const toMember = await getMember(ddb, draw.to_member);
  return toMember;
}

function draw(memberList) {
  console.log('Shuffling members: ', memberList);
  return _.shuffle(memberList).map((member, index, shuffledList) => {
    if (index != memberList.length - 1) {
      return { from: member, to: shuffledList[index + 1]};
    } else {
      return { from: member, to: shuffledList[0]};
    }
  })
}

function saveDraw(ddb, drawResult) {
  return Promise.map(drawResult, (draw) => {
    const params = {
      TableName: 'lotteries',
      Item: {
        'from_member' : draw.from,
        'to_member': draw.to,
        'year': moment().year()
      },
      ReturnValues: "ALL_OLD"
    };

    return new Promise((resolve) => {
      ddb.put(params, function(err, data) {
        if (err) {
          console.error('Error while inserting lottery', {lottery_member: draw.from, error_message: err.message})
          resolve(err.message);
        } else {
          console.log("Successfully created lottery", { lottery_member: draw.from, data: data});
          resolve(data);
        }
      });
    });
  })
}

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

exports.run = async (event, context) => {
  const AWS = require('aws-sdk');
  AWS.config.update({region: 'eu-central-1'});
  const ddb = new AWS.DynamoDB.DocumentClient();

  const memeberList = await loadMembers(ddb);
  const year = await selectEvent(ddb);
  console.log('Selected event', year);
  const drawResult = draw(memeberList);
  await saveDraw(ddb, drawResult);
  return response(200);
};

exports.getMine = async (event) => {
  try { 
    AWS.config.update({region: 'eu-central-1'});
    const ddb = new AWS.DynamoDB.DocumentClient();

    const member = await authenticate(ddb, event)
    const myDraw = await selectDrawForMember(ddb, member);
    return response(200, myDraw);
  } catch (e) {
    console.error(e);
    if (e instanceof AuthError) {
      return response(401, {error_message: e.message});
    }
    return response(500, {error_message: e.message});
  }
}


