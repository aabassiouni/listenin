// import logo from './logo.svg';
import './App.css';
// import SpotifyWebApi from 'spotify-web-api-js';
// import { token } from "./spotify/spotify";
import React, { useState, useEffect, useContext} from 'react';
import {UserContext} from './context/userContext';
// import Status from './components/Status';
import LoginButton from './components/LoginButton/LoginButton';
// import LikeButton from './components/LikeButton';
import Card from './components/Card/Card';
import Login from './pages/Login';

import Home from './pages/Home.js';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
  Navigate,
} from "react-router-dom";
import { UserContextProvider } from './context/userContext';

// const spotifyApi = new SpotifyWebApi();

// class App extends Component {

//   constructor(){
//     super();
//     const params = this.getHashParams();
//     console.log(params);
//     const token = params.access_token;
//     if (token) {
//       spotifyApi.setAccessToken(token);
//       localStorage.setItem('token', token); 
//     }
//     this.state = {
//       loggedIn: token ? true : false,
//       nowPlaying: { name: 'Not Checked', albumArt: '' }
//     }
//   }
//   getHashParams() {
//     var hashParams = {};
//     var e, r = /([^&;=]+)=?([^&;]*)/g,
//         q = window.location.hash.substring(1);
//     e = r.exec(q)
//     while (e) {
//        hashParams[e[1]] = decodeURIComponent(e[2]);
//        e = r.exec(q);
//     }
//     return hashParams;
//   }

//   getNowPlaying(){
//     spotifyApi.getMyCurrentPlaybackState()
//       .then((response) => {
//         this.setState({
//           nowPlaying: { 
//               name: response.item.name, 
//               albumArt: response.item.album.images[0].url
//             }
//         });
//       })
//   }

//   render() {
//     return (
//       <div className="App">
//         {this.state.loggedIn ? (
//           <>
//             <div>
//               <h1>Logged In</h1>
//             </div>
//           </>
//         ) : (<a href='http://localhost:8888' > Login to Spotify </a>)}
        
//         <div>
//           Now Playing: { this.state.nowPlaying.name }
//         </div>
//         <div>
//           <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
//         </div>
//         { this.state.loggedIn &&
//           <button onClick={() => this.getNowPlaying()}>
//             Check Now Playing
//           </button>
//         }
//       </div>
//     );
//     }
//   }

function App(){

  console.log("App.js is being rendered");

  const {user, dispatch } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  // console.log("user in app from context is " + user.user.email);
  // console.log("token in app from context is " + user.token);
  // console.log("isLoggedIn is " + user.isLoggedIn);

  useEffect(() => {
    try {
      if(!user.isLoggedIn){
        setIsLoading(false);
      };
    } catch (error) {
      console.log("there is no user in app component", error);
    }   
    
  }, [user])

  // user.isLoggedIn ? <Home /> : <Navigate replace to = {"/login"} />
  return (
    <div className="App">
      {/* {isLoading ? <div>Loading...</div> : */}
    <Router>

      <Routes>
        <Route exact path="/login" element = {
        // isLoading ? <Navigate replace to = {"/"} /> : 
        <Login />
        } />
        <Route path="/" element = {
          // isLoading ? <Navigate replace to = {"/login"} /> :
         <Home />
        } />   
      </Routes>
    </Router> 
      {/* } */}
    </div>

          

    // <div>
    //   {access_token ? (
    //   <>
    //   <Card />
    //   {/* <Chat theme={'messaging light'} /> */}
    //   </>
    //    ): (
    //   <div className='loginContainer'>
    //     <div className='loginWrapper'>
    //       <p className='loginHeader'>Login using Spotify</p>
    //       <LoginButton />
    //       <a href="http://localhost:8888/login">Log in to Spotify</a>
    //     </div>
    //   </div>
    //   )}
    // </div>
  );
}

export default App;

