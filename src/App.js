import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import { token } from "./spotify/spotify";
import React, { useState, useEffect} from 'react';
import Status from './components/Status';
import LoginButton from './components/LoginButton';


const spotifyApi = new SpotifyWebApi();

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


  const [access_token, setAccessToken] = useState(null);

  useEffect(() => {
    setAccessToken(token);
  },[])
  
  console.log("token is " + token)
  return (

    <div>
      {access_token ? <Status /> : (
      <div className='loginContainer'>
        <div className='loginWrapper'>
          <p className='loginHeader'>Login using Spotify</p>
          <LoginButton />
          <a href="http://localhost:8888/login">Log in to Spotify</a>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;

