const admin = require('firebase-admin');
const serviceAccount = require('./oasisgame-ba662-firebase-adminsdk-bagmo-b47b9b57c8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://oasisgame-ba662.appspot.com'
});

const storage = admin.storage();

module.exports = { admin, storage };