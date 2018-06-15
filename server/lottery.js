const _ = require('lodash');

const { connect } = require('database');
const { decode } = require('decode-verify-jwt');

async function loadMembers(client) {
  const res = await client.query("SELECT id FROM members");
  return res.rows;
}

async function selectEvent(client) {
  const res = await client.query("SELECT id, date FROM events WHERE date_part('year', date) = date_part('year', current_date)")
  return res.rows[0].id;
}

async function selectDrawByMemberId(client, memberId) {
  const statement = "SELECT members.*  FROM lotteries INNER JOIN members ON lotteries.to_member_id = members.id WHERE lotteries.from_member_id = $1"
  const values = [memberId]
  const res = await client.query(statement, values)
  return res.rows[0];
}

function draw(memberList) {
  console.log('Shuffling members: ', memberList);
  return _.shuffle(memberList).map((member, index, shuffledList) => {
    if (index != memberList.length - 1) {
      return { from: member.id, to: shuffledList[index + 1].id};
    } else {
      return { from: member.id, to: shuffledList[0].id};
    }
  })
}

function saveDraw(client, eventId, draw) {
  console.log('Saving draw', draw);
  const inserts = draw.map((pair) => {
    const statement = 'INSERT INTO lotteries(event_id, from_member_id, to_member_id) VALUES($1, $2, $3)'
    const values = [eventId, pair.from, pair.to];
    console.log("Inserting draw line", values);
    return client.query(statement, values);
  })
  return Promise.all(inserts);
  
}

async function getUser(event) {
  const token = event.queryStringParameters.id_token;
  const userClaims = await decode(token);
  return userClaims.email;
}

function response(code, body) {
  return {
    statusCode: code,
    body: body ? JSON.stringify(body) : body,
    headers: {
      "Access-Control-Allow-Origin" : "https://www.hadamba.com", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    }
  }
}

exports.create = async (event, context) => {
  const client = await connect()

  const memeberList = await loadMembers(client);
  const eventId = await selectEvent(client);
  console.log('Selected event', eventId);
  const drawResult = draw(memeberList);
  await saveDraw(client, eventId, drawResult);
  
  return {
    statusCode: 200
  };
};

exports.getMine = async (event, context) => {
  try {
    const memberId = event.queryStringParameters.member_id;
    console.log('Member', memberId);
  
    const client = await connect();
    const myDraw = await selectDrawByMemberId(client, memberId);
    return response(200, myDraw);
  } catch (e) {
    console.error(e);
    return response(500, {error_message: e.message});
  }
  
}


