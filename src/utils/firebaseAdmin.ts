import path from "path";
import admin from "firebase-admin";

var serviceAccount = path.join(process.cwd(), 'ml-tracker.json'); 
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ml-tracker-default-rtdb.firebaseio.com"
  });
}
export default admin;

