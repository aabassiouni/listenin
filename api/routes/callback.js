const router = require("express").Router();
var querystring = require("querystring");
var request = require("request"); // "Request" library
var axios = require("axios");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");
const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getAuth, createCustomToken } = require("firebase-admin/auth");

const User = require("../models/User");


const db = getFirestore();

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.API_URL + "/callback"; 

// Your redirect uri
var stateKey = "spotify_auth_state";

async function getUserData(access_token) {

	try {
		console.log("getUserData called");
		const response = await axios({
			method: "GET",
			url: "https://api.spotify.com/v1/me",
			headers: {
				Authorization: "Bearer " + access_token,
			},
		});

		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("getUserData failed:", error);
	}
}

router.get("/", function (req, res) {
	console.log("/////////////////////////////callback route called/////////////////////////////");
	// your application requests refresh and access tokens
	// after checking the state parameter

	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	var userEmail = "";
	var profilePic = "";

	if (state === null || state !== storedState) {
		res.redirect(
			"/#" +
				querystring.stringify({
					error: "state_mismatch",
				})
		);
	} else {
		res.clearCookie(stateKey);
		var authOptions = {
			url: "https://accounts.spotify.com/api/token",
			form: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: "authorization_code",
			},
			headers: {
				Authorization: "Basic " + new Buffer.from(client_id + ":" + client_secret).toString("base64"),
			},
			json: true,
		};

		request.post(authOptions, async function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var access_token = body.access_token,
					refresh_token = body.refresh_token;

				// console.log("going to call getUserData")
				var response = await getUserData(access_token);
				// console.log("response is:", response);

				userEmail = response.email;
				// profilePic = response.images[0].url;
				spotifyID = response.id;

				// console.log("userEmail is:", userEmail);
				// console.log("profilePic is:", profilePic);
				// console.log("spotifyID is:", spotifyID);

				try {
					// console.log("saving user to database");

					const newUser = new User({
						email: userEmail,
						spotifyID: spotifyID,
					});

					const user = await newUser.save();

					// console.log("the user being saved is", user);
				} catch (err) {
					// console.log("error saving user to database");
					// console.log(err); 
				}

				// addToFirestore = async () => {
				//   try {
				//     const docRef = db.collection("messages").doc(spotifyID);
				//     const doc = await docRef.get();
				//     if (!doc.exists) {

				//       let data = {
				//         messages: [],
				//         createdAt: Timestamp.now(),
				//         updatedAt: Timestamp.now(),
				//       }

				//       console.log("No such document!");
				//       const docRef = await db.collection("messages").doc(spotifyID).set(data);
				//       // const res = await docRef.set({
				//       //   messages: [],
				//       //   createdAt: Timestamp.now(),
				//       //   updatedAt: Timestamp.now(),
				//       // });
				//       console.log("Document written with ID: ", res.id);
				//     } else {
				//       console.log("Document data:", doc.data());
				//     }
				//   } catch (error) {
				//     console.log("Error getting document:", error);
				//   }

				// };

				let firebase_token = await getAuth().createCustomToken(spotifyID);
				console.log("firebase_token is:", firebase_token);
				// addToFirestore();

				// console.log("the user's email is outside the response:", userEmail);
				// console.log(process.env.SITE_URL + '/#')
				// we can also pass the token to the browser to make requests from there
				res.redirect(
					process.env.SITE_URL +
						"/#" +
						querystring.stringify({
							access_token: access_token,
							refresh_token: refresh_token,
							firebase_token: firebase_token,
							// userID: spotifyID
						})
				);
			} else {
				res.redirect(
					process.env.SITE_URL +
						querystring.stringify({
							error: "invalid_token",
						})
				);
			}
		});
	}
});

module.exports = router;
