const moment = require('moment');

exports.get = async function (ddb, year = moment().year()) {
  return new Promise((resolve, reject) => {
    ddb.get( { TableName: "events", Key: { year } }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Item);
    })
  })
}