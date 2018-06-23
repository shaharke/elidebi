const _ = require('lodash');

const { connect } = require('database');
const { AuthError } = require('errors');
const { authenticate } = require('auth')

async function loadMembers(client) {
  const res = await client.query("SELECT email FROM members");
  return res.rows;
}

async function selectEvent(client) {
  const res = await client.query("SELECT id, date FROM events WHERE date_part('year', date) = date_part('year', current_date)")
  return res.rows[0].id;
}

async function selectDrawForMember(client, member) {
  const statement = "SELECT members.*  FROM lotteries INNER JOIN members ON lotteries.to_member = members.email WHERE lotteries.from_member = $1";
  const values = [member.email];
  const res = await client.query(statement, values);
  return res.rows[0];
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

exports.run = async (event, context) => {
  const client = await connect()

  const memeberList = await loadMembers(client);
  const eventId = await selectEvent(client);
  console.log('Selected event', eventId);
  await deleteExistingDraw(client, eventId);
  const drawResult = draw(memeberList);
  await saveDraw(client, eventId, drawResult);
  
  return {
    statusCode: 200
  };
};

exports.getMine = async (event) => {
  try {  
    const client = await connect();
    const member = await authenticate(client, event)
    const myDraw = await selectDrawForMember(client, member);
    return response(200, myDraw);
  } catch (e) {
    console.error(e);
    if (e instanceof AuthError) {
      return response(401, {error_message: e.message});
    }
    return response(500, {error_message: e.message});
  }
}


