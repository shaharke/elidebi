const moment = require('moment');

exports.getDraw = async function (ddb, member, event) {
  return new Promise((resolve, reject) => {
    const query = {
      TableName : "lotteries",
      KeyConditionExpression: "#year = :yyyy and from_member = :from",
      ExpressionAttributeNames: {
        '#year': 'year'
      },
      ExpressionAttributeValues: {
          ":yyyy": event.year,
          ":from": member.email
      }
    }

    ddb.query(query, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const draw = data.Items ? data.Items[0] : null
      resolve(draw);
    })
  })
}

exports.getLastYearDraw = async function(ddb) {
  return new Promise((resolve, reject) => {
    const query = {
      TableName : "lotteries",
      FilterExpression: "#year = :yyyy",
      ExpressionAttributeNames: {
        '#year': 'year',
        "#fm": "from_member", 
        "#tm": "to_member"
      },
      ExpressionAttributeValues: {
        ":yyyy": moment().year() - 1,
      },
      ProjectionExpression: "#fm, #tm"
    }

    ddb.scan(query, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Items);
    })
  })
}