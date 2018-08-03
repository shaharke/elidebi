exports.list = async function (ddb) {
  return new Promise((resolve, reject) => {
    ddb.scan( { TableName: "members" }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Items);
    })
  })
}

exports.get = async function(ddb, email) {
  return new Promise((resolve, reject) => {
    ddb.get( { TableName: "members", Key: { email: email } }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Item);
    })
  })
}