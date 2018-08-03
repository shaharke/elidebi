const { connect } = require('database');
const Promise = require('bluebird');
const moment = require('moment');

exports.migrateEvents = async (event) => {
  const client = await connect();
  const res = await client.query('SELECT * FROM events');
  const events = res.rows;

  // Load the AWS SDK for Node.js
  const AWS = require('aws-sdk');
  // Set the region 
  AWS.config.update({region: 'eu-central-1'});

  // Create the DynamoDB service object
  const ddb = new AWS.DynamoDB.DocumentClient();

  return Promise.map(events, (event) => {
    const eventDate = moment(event.date);
    const params = {
      TableName: 'events',
      Item: {
        'name': event.name,
        'date': eventDate.format('DD-MM-YYYY'),
        'year': eventDate.year()
      },
      ReturnValues: "ALL_OLD"
    };

    return new Promise((resolve) => {
      ddb.put(params, function(err, data) {
        if (err) {
          console.error('Error while inserting event', {event_id: event.id, error_message: err.message})
          resolve(err.message);
        } else {
          console.log("Successfully migrated lottery", { event_id: event.id, data: data});
          resolve(data);
        }
      });
    });
  })
}

exports.migrateLotteries = async (event) => {
  const client = await connect();
  const res = await client.query('SELECT * FROM lotteries');
  const lotteries = res.rows;

  // Load the AWS SDK for Node.js
  const AWS = require('aws-sdk');
  // Set the region 
  AWS.config.update({region: 'eu-central-1'});

  // Create the DynamoDB service object
  const ddb = new AWS.DynamoDB.DocumentClient();

  return Promise.map(lotteries, (lottery) => {
    const params = {
      TableName: 'lotteries',
      Item: {
        'from_member' : lottery.from_member,
        'to_member': lottery.to_member,
        'year': moment().year()
      },
      ReturnValues: "ALL_OLD"
    };

    return new Promise((resolve) => {
      ddb.put(params, function(err, data) {
        if (err) {
          console.error('Error while inserting lottery', {lottery_member: lottery.from_member, error_message: err.message})
          resolve(err.message);
        } else {
          console.log("Successfully migrated lottery", { lottery_member: lottery.from_member, data: data});
          resolve(data);
        }
      });
    });
  })
}

exports.migrateMembers = async (event) => {
  const client = await connect();
  const res = await client.query('SELECT * FROM members');
  const members = res.rows;

  // Load the AWS SDK for Node.js
  const AWS = require('aws-sdk');
  // Set the region 
  AWS.config.update({region: 'eu-central-1'});

  // Create the DynamoDB service object
  const ddb = new AWS.DynamoDB.DocumentClient();

  return Promise.map(members, (member) => {
    const params = {
      TableName: 'members',
      Item: {
        'email' : member.email,
        'first_name': member.first_name,
        'last_name': member.last_name,
        'nickname': member.nickname || null
      },
      ReturnValues: "ALL_OLD"
    };

    return new Promise((resolve) => {
      ddb.put(params, function(err, data) {
        if (err) {
          console.error('Error while inserting member', {member: member.email, error_message: err.message})
          resolve(err.message);
        } else {
          console.log("Successfully migrated member", { member: member.email, data: data});
          resolve(data);
        }
      });
    });
  });
}