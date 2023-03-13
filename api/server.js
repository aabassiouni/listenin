const express = require("express"); // Express web server framework
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/users.js");
const loginRoute = require("./routes/login.js");
const callbackRoute = require("./routes/callback.js");
const sendRoute = require("./routes/send.js");
const searchRoute = require("./routes/search.js");
const refreshRoute = require("./routes/refresh-token.js");

const User = require("./models/User.js");
const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");
const { getAuth, createCustomToken } = require("firebase-admin/auth");

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.API_URL + "/callback"; // Your redirect uri
let stateKey = "spotify_auth_state";

dotenv.config();

// connect to DB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("MongoDB Connected"));

// var serviceAccount = require("./firebase_service_account_key/listenin-f7d21-firebase-adminsdk-lorx8-7c0be2cd24.json");

// console.log(JSON.parse(process.env.FIREBASE_CONFIG))

initializeApp({
	credential: cert(JSON.parse(process.env.FIREBASE_CONFIG)),
});

const db = getFirestore();

const app = express();
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public/images")))
	.use(cors())
	.use(cookieParser());

const http = require("http").Server(app);

// app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/callback", callbackRoute);
app.use("/users", userRoute);
app.use("/send", sendRoute);
app.use("/search", searchRoute);
app.use("/refresh_token", refreshRoute);



module.exports = db;

console.log("Express Server listening on 8888");
app.listen(8888);
