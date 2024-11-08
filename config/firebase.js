const admin = require("firebase-admin");
const serviceAccount = require("./presshopdev-db299-firebase-adminsdk-r42uz-1e0c6073b0.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



const db = admin.firestore();

module.exports = {
    db : db,
    admin : admin,
};
