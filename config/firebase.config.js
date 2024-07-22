var admin = require("firebase-admin");

var serviceAccount = require("./firebase.config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
module.exports = admin