'use strict';

const crypto = require('crypto');

function encrypt(secret, data) {
  const jsonStr = JSON.stringify(data);
  const key = crypto.scryptSync(secret, 'salt', 24);
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
  let encryptedString = cipher.update(jsonStr, 'utf8', 'hex');
  encryptedString += cipher.final('hex');
  return encryptedString;
}

function decrypt(secret, token) {
  const key = crypto.scryptSync(secret, 'salt', 24);
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
  let decryptedString = decipher.update(token, 'hex', 'utf8');
  decryptedString += decipher.final('utf8');
  return JSON.parse(decryptedString);
}

console.log(decrypt('1545asd1z5cvsdf456a4sd8a5s1', 'e7ba09a7f6788b43a23fb7b5f7f933e11918512bfe4ec9235d86a1eec26d3ba9dc49a2cf999d07c961ab68ed91a1f0b0'));

module.exports = {
  encrypt,
  decrypt,
};
