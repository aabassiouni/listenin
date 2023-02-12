let express = require('express'); // Express web server framework
let request = require('request'); // "Request" library
let cors = require('cors');
let cookieParser = require('cookie-parser');
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users.js");
const registerRoute = require("./routes/register.js");
const loginRoute = require("./routes/login.js");
const callbackRoute = require("./routes/callback.js");

const User = require("./models/User");


const client_id = '2d06712101474795ab9fa2bd91fa6000'; // Your client id
const client_secret = '6b993945947f416f87025d975c6f4ccb'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
let stateKey = 'spotify_auth_state';

dotenv.config();

// connect to DB
mongoose.set('strictQuery', true);
mongoose.connect(
    process.env.MONGO_URL,
    {useNewUrlParser: true, useUnifiedTopology: true }
    ).then(
    () => console.log('MongoDB Connected'));

    
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

let app = express();



app.use("/images", express.static(path.join(__dirname, "public/images")))
   .use(cors())
   .use(cookieParser());

const http = require('http').Server(app);

app.use(express.json());

// app.use("/register", registerRoute);
app.use('/login', loginRoute);
app.use('/callback', callbackRoute);
app.use('/users', userRoute);




app.get('/refresh_token', function(req, res) {
  console.log("refresh_token called");

  // requesting access token from refresh token
  
    let refresh_token = req.query.refresh_token;
    console.log("refresh token is ", refresh_token);
    if (!refresh_token) {
      console.log("refresh_token is null");
      res.send({
        'access_token': null
      });
    }
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body);
        let access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  // } catch (err) {
  //   console.log(err);
  //   res.status(403).json("somethings weird");
  // }

});

// let emails = ["test1@email.com","test2@email.com","test3@email.com","test4@email.com"];
// let streamIDs = ["test1","test2","test3","test4"];

// for (let i = 0; i < emails.length; i++) {
//   profilepicstring = "images/test" + i + ".jpg";
//   const newUser = new User({
//     email: emails[i],
//     profilePicture: profilepicstring,
//     streamID: streamIDs[1]
//   });

//   const user = newUser.save();
//   console.log(newUser.email + " saved to database");
// }

console.log('Express Server listening on 8888');
app.listen(8888);