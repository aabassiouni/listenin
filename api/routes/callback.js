
const router = require('express').Router();
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request'); // "Request" library
var axios = require('axios');

const User = require("../models/User");

const client_id = '2d06712101474795ab9fa2bd91fa6000'; // Your client id
const client_secret = '6b993945947f416f87025d975c6f4ccb'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var stateKey = 'spotify_auth_state';

async function getUserData(access_token) {

  // var options = {
          //   url: 'https://api.spotify.com/v1/me',
          //   headers: { 'Authorization': 'Bearer ' + access_token },
          //   json: true
          // };

  // request.get(options, function(error, response, body) {

    //   console.log(response.statusCode)
    //   console.log(body);

    //   return body;

    // });
  


  try {
    console.log("getUserData called");
    const response = await axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("getUserData failed:", error);
  }
}


router.get('/', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    var userEmail = "";
    var profilePic = "";

    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
  
      request.post(authOptions, async function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
          
          
          console.log("going to call getUserData")
          var response = await getUserData(access_token);
          console.log("response is:", response);

          userEmail = response.email;
          profilePic = response.images[0].url;
          spotifyID = response.id;

          console.log("userEmail is:", userEmail);
          console.log("profilePic is:", profilePic);
          console.log("spotifyID is:", spotifyID);


          try{
              console.log("saving user to database");

              const newUser = new User({
                  email: userEmail,
                  profilePicture: profilePic,
                  streamID: spotifyID, 
              });

              const user = await newUser.save();

              console.log("the user being saved is", user)
          } catch(err) {
              console.log("error saving user to database");
              console.log(err);
          }


          // console.log("the user's email is outside the response:", userEmail);
          // we can also pass the token to the browser to make requests from there
          res.redirect('http://localhost:3000/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
              userID: spotifyID
            }));


        } else {
          res.redirect('http://localhost:3000' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });

module.exports = router;