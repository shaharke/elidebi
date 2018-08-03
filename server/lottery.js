const _ = require('lodash');
const AWS = require('aws-sdk');

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
      return { from: member.email, to: shuffledList[index + 1].email};
    } else {
      return { from: member.email, to: shuffledList[0].email};
    }
  })
}

async function deleteExistingDraw(client, eventId) {
  console.log('Deleteing existing draw', {event_id: eventId});
  await client.query('DELETE FROM lotteries WHERE event_id = $1', [eventId]);
}

function saveDraw(client, eventId, draw) {
  console.log('Saving draw', draw);
  const inserts = draw.map((pair) => {
    const statement = 'INSERT INTO lotteries(event_id, from_member, to_member) VALUES($1, $2, $3)'
    const values = [eventId, pair.from, pair.to];
    console.log("Inserting draw line", values);
    return client.query(statement, values);
  })
  return Promise.all(inserts);
  
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

// exports.run = async (event, context) => {
//   const client = await connect()

//   const memeberList = await loadMembers(client);
//   const year = await selectEvent(client);
//   console.log('Selected event', year);
//   await deleteExistingDraw(client, eventId);
//   const drawResult = draw(memeberList);
//   await saveDraw(client, eventId, drawResult);
  
//   return {
//     statusCode: 200
//   };
// };

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


