const express = require("express"); // Express web server framework
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();



const User = require("./models/User.js");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");
const { getAuth, createCustomToken } = require("firebase-admin/auth");

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.API_URL + "/callback"; // Your redirect uri
let stateKey = "spotify_auth_state";



// connect to DB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("MongoDB Connected"));


initializeApp({
	credential: cert(JSON.parse(process.env.FIREBASE_CONFIG)),
});

const db = getFirestore();

const app = express();
app.use(express.json());

app.use("/api/images", express.static(path.join(__dirname, "public/images")))
.use(cors())
.use(cookieParser());

app.get('/api', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
	res.end(`Hello! you shouldnt be here`);
  });

const userRoute = require("./routes/users.js");
const loginRoute = require("./routes/login.js");
const callbackRoute = require("./routes/callback.js");
const sendRoute = require("./routes/send.js");
const searchRoute = require("./routes/search.js");
const refreshRoute = require("./routes/refresh-token.js");
const adminRoute = (process.env.NODE_ENV == "development" ? require("./routes/admin.js") : null);

app.use("/api/login", loginRoute);
app.use("/api/callback", callbackRoute);
app.use("/api/users", userRoute);
app.use("/api/send", sendRoute);
app.use("/api/search", searchRoute);
app.use("/api/refresh_token", refreshRoute);
// app.use("/admin", adminRoute);

console.log("Express Server listening on 8888");
app.listen(8888);

module.exports = app;
