const crypto = require("crypto-js");

function encrypt(text, key) {
  var encrypted = crypto.AES.encrypt(text, key);
  return encrypted.toString();
}

function decrypt(text, key) {
  var decrypted = crypto.AES.decrypt(text, key);
  return decrypted.toString(crypto.enc.Utf8);
}

function generate_key(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = { generate_key, encrypt, decrypt };

//comment below lines

/* 
  Generate a random key of any length and also add time of particular exam to that key.
  Store this key in database.
  At the time of exam just send the generate_key(32) to user and not the whole string with time.
  Hence at the time of exam key will be = password sent to user + present_time, this way he can only decrpyt the 
  paper at exam time.

*/
// let key = generate_key(32) + "1/1/2021:21:30";
// let enc = encrypt("some_text", key);
// console.log(enc);
// console.log(decrypt(enc, key));
