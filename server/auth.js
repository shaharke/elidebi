const { connect } = require('database');
const { decode } = require('decode-verify-jwt');

async function getUser(event) {
  const token = event.queryStringParameters.id_token;
  const userClaims = await decode(token);
  return userClaims.email;
}

async function getMemberId(client, user) {
  const statement = 'SELECT id FROM members WHERE email = $1';
  const values = [user];
  const response = await client.query(statement, values);
  const rows = response.rows;
  if (!rows.length) {
    const message = 'User is not a member';
    console.error(message, { user: user});
    throw new Error(message);
  }
  return rows[0].id;
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

exports.do = async (event, context) => {
  try {
    const user = await getUser(event);
    const client = await connect();
    try {
      const memberId = await getMemberId(client, user);
      return response(200, {id: memberId});
    } catch (e) {
      console.error(e);
      return response(401)
    }
  } catch (e) {
    return response(500, {error_message: e.message});
  }
}

