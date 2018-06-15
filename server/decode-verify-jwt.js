/* Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file
 except in compliance with the License. A copy of the License is located at

     http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS"
 BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations under the License.
*/

const https = require('https');
const jose = require('node-jose');
const Promise = require('bluebird');

const region = 'eu-central-1';
const userPoolId = 'eu-central-1_3Ek1MAjk4';
const appClientId = '4hiaorc0v5d7dnv1nl1fq8dbqa';
const keys_url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

exports.decode = async (token) => {
  const sections = token.split('.');
  // get the kid from the headers prior to verification
  let header = jose.util.base64url.decode(sections[0]);
  header = JSON.parse(header);
  const kid = header.kid;
  // download the public keys
  return new Promise((resolve, reject) => {
    console.log('Getting keys');
    https.get(keys_url, (response) => {
      console.log('Received response');
      if (response.statusCode == 200) {
        response.on('data', async (body) => {
          const keys = JSON.parse(body)['keys'];
          // search for the kid in the downloaded public keys
          const keyIndex = keys.reduce((foundIndex, key, i) => {
            if (kid == keys[i].kid) {
              foundIndex = i;
            }
            return foundIndex;
          }, -1)
          if (keyIndex == -1) {
              console.log('Public key not found in jwks.json');
              reject('Public key not found in jwks.json');
          }
          // construct the public key
          try {
            const result = await jose.JWK.asKey(keys[keyIndex]);
            // verify the signature
            const verifyResult = await jose.JWS.createVerify(result).verify(token);
            // now we can use the claims
            const claims = JSON.parse(verifyResult.payload.toString());
            
            // additionally we can verify the token expiration
            const currentTs = Math.floor(new Date() / 1000);
            if (currentTs > claims.exp) {
                reject('Token is expired');
            }
            // and the Audience (use claims.client_id if verifying an access token)
            if (claims.aud != appClientId) {
              reject('Token was not issued for this audience');
            }
            resolve(claims);  
          } catch(e) {
            console.error(e);
            reject(`Signature verification failed: ${e.message}`);
          }
        })
      }
    })
  })
}