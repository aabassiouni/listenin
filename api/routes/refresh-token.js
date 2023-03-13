const request = require("request"); // "Request" library
const router = require("express").Router();

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret

router.get("/", function (req, res) {
	console.log("//////////////// refresh_token called //////////////////////");

	// requesting access token from refresh token
	let refresh_token = req.query.refresh_token;
	console.log(" old refresh token is ", refresh_token);
	if (!refresh_token) {
		console.log("refresh_token is null");
		res.send({
			access_token: null,
		});
	}
	let authOptions = {
		url: "https://accounts.spotify.com/api/token",
		headers: { Authorization: "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64") },
		form: {
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		},
		json: true,
	};

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("refresh_token response body is ");
			console.log(body);
			let access_token = body.access_token;
			res.send({
				access_token: access_token,
			});
		}
	});
});

module.exports = router;
