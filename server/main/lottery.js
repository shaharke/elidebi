const _ = require('lodash');

const { Client } = require('pg')

async function loadMembers(client) {
  const res = await client.query("SELECT id FROM members");
  return res.rows;
}

async function selectEvent(client) {
  const res = await client.query("SELECT id, date FROM events WHERE date_part('year', date) = date_part('year', current_date)")
  return res.rows[0].id;
}

async function selectDrawByUser(client, user) {
  const statement = "SELECT members.*  FROM lotteries INNER JOIN members ON lotteries.to_member_id = members.id WHERE from_member_id = $1"
  const values = [user]
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

function newDatabaseClient() {
  return new Client({
    host: process.env.RDS_ENDPOINT,
    database: 'elidebi',
    user: process.env.RDS_ADMIN,
    password: process.env.RDS_PASSWORD,
    port: 5432,
  })
}

exports.create = async (event, context) => {
  const client = newDatabaseClient();
  await client.connect();

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
  const client = newDatabaseClient();
  await client.connect();

  const { user } = event.queryStringParameters;
  console.log('Getting draw for user', user);
  const myDraw = await selectDrawByUser(client, user);
  return {
    statusCode: 200,
    body: JSON.stringify(myDraw)
  }
}


