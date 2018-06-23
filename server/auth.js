const { decode } = require('decode-verify-jwt');
const { AuthError } = require('errors');

exports.authenticate = async function (client, event) {
  try {
    const token = event.queryStringParameters.id_token;
    if (!token) {
      throw new AuthError('Token must be present');
    }
    const userClaims = await decode(token);
    const email = userClaims.email;

    const response = await client.query('SELECT * FROM members WHERE email = $1', [email])
    const member = response.rows[0];
    return member;
  } catch (e) {
    throw new AuthError(e.message);
  }
  
}
