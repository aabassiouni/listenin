
const router = require('express').Router();
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request'); // "Request" library

const User = require("../models/User");

const client_id = '2d06712101474795ab9fa2bd91fa6000'; // Your client id
const client_secret = '6b993945947f416f87025d975c6f4ccb'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var stateKey = 'spotify_auth_state';

router.get('/', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
  
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
  
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
          });
  
          // we can also pass the token to the browser to make requests from there
          res.redirect('http://localhost:3000/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));

            // Save the user's access token to the database
            try{
                const newUser = new User({
                    email: "a@b.com"
                })
            
                const user = await newUser.save();
            } catch(err) {
                console.log(err);
            }


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