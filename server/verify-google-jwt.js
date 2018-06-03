const {OAuth2Client} = require('google-auth-library');

exports.verify = async (token) => {
  const client = new OAuth2Client("913371731888-npteuacbhurqa07v094c4duev2bvrgdm.apps.googleusercontent.com");
  console.log('before')
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "913371731888-npteuacbhurqa07v094c4duev2bvrgdm.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  console.log('Payload', payload);
  return payload;
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}