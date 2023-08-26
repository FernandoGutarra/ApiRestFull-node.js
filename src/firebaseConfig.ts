import admin from 'firebase-admin';
import path from 'path';

const serviceAccount = path.join(__dirname, './oasisgame-ba662-firebase-adminsdk-bagmo-b47b9b57c8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://oasisgame-ba662.appspot.com'
});

const storage = admin.storage();

export { admin, storage };
