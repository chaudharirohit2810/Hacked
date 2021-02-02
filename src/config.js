require("dotenv").config();
// alert(process.env.REACT_APP_SECRET_KEY);
const SecureStorage = require("secure-web-storage");
var CryptoJS = require("crypto-js");

module.exports = global.config = {
    backendURL: "http://localhost:5000/api",
    secureStorage: new SecureStorage(localStorage, {
        hash: function hash(key) {
            key = CryptoJS.SHA256(key, process.env.REACT_APP_SECRET_KEY);

            return key.toString();
        },
        encrypt: function encrypt(data) {
            data = CryptoJS.AES.encrypt(data, process.env.REACT_APP_SECRET_KEY);

            data = data.toString();

            return data;
        },
        decrypt: function decrypt(data) {
            data = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET_KEY);

            data = data.toString(CryptoJS.enc.Utf8);

            return data;
        },
    }),
};
