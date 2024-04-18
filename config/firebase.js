const admin = require("firebase-admin");
const serviceAccount = require("./presshopdev-db299-firebase-adminsdk-r42uz-e127cd9714.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = {
    db : db,
    admin : admin,
};
