import { createContext, useState, useEffect,useContext, useReducer } from "react";
import { spotifyApi } from "../spotify/spotify";
import { getHashParams } from "../util/util";
import axios from "axios";

export const UserContext = createContext();

// const initialState = {
//     user: null,
//     playlists: [],
//     playing: false,
//     item: null,
//     // token: null,
// }

export function UserContextProvider({ children }) {
    // const [state, dispatch] = useReducer(reducer, initialState);

    // console.log("UserContextProvider is being run ");
    const [user, setUser] = useState({token: null,
                                      isLoggedIn: false,
                                      user: null});
    const [isLoading, setIsLoading] = useState(true);

    const params = getHashParams();
    const token = params.access_token;
    const userID = params.userID;

    // // const res = axios.get(`http://localhost:8888/users/?userID=${userID}`);
    // console.log("res data is", res.data);
    // setUser({token: token,
    //                 isLoggedIn: true,
    //                 user: res.data});
    // localStorage.setItem('token', token);

    console.log("params in userContextProvider are", params);
    console.log("token in userContextProvideris", token);
    console.log("userID in userContextProvideris", userID);
    
    // useEffect(() => {
    //   if (!user){
    //     console.log("no user yet in context");
    //   }
    // }, [user])

    // axios.get(`http://localhost:8888/users/?userID=${userID}`).then((res) => {
    //       console.log("res is", res.data);
    //       var userFromApi = res.data;
    //       console.log("userFromApi is", userFromApi);
    //       setUser({token: token,
    //                 isLoggedIn: true,
    //                 user: userFromApi});
    //       setIsLoading(false);
    //   });

    useEffect(() => {
    //     // const fetchUser = async () => {
    //     //     if( !token ){
    //     //         console.log("no token");
    //     //         // return;
    //     //     };
    //     //     const res = await axios.get(`http://localhost:8888/users/?userID=${userID}`);
    //     //     console.log("res data is", res.data);
            
    //     //     return;
            
    //     //     // return res.data;
    //     // };
    //     // fetchUser();

        console.log("useEffect is being run");
        axios.get(`http://localhost:8888/users/?userID=${userID}`).then((res) => {
            console.log("res is", res);
            var userFromApi = res;
            console.log("userFromApi is", userFromApi);
            setUser({token: token,
                      isLoggedIn: true,
                      user: userFromApi});
            setIsLoading(false);
        });

    }, []);

  //   //   console.log("fetchUser is being run");
  //   //   fetchUser().then((res) => {
  //   //     console.log("res is", res);
  //   //     var userFromApi = res;
  //   //     console.log("userFromApi is", userFromApi);
  //   //     setUser({token: token,
  //   //     isLoggedIn: true,
  //   //     user: userFromApi});
  //   // })
  // }, [userID]);

  console.log("user in userContextProvider is", user);


    // response = .json();response
    // console.log("response is", response);
    // setCurrentUser({ token: token,
                    //  userID: userID});
    // console.log("user token in context is", user);
    
    // useEffect(() => { 
    //   var response = fetch(`http://localhost:8888/users/?userID=${userID}`);
    // //   response = response.json();
    //   setCurrentUser(response);
    // }, [userID])
  
    return (
      <UserContext.Provider value={{user, isLoading}}>
        {children}
      </UserContext.Provider>
    )
  }

  export function useAPI() {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error("Context must be used within a Provider");
    }
    return context;
  }
//     return (
//         <UserContext.Provider value={{ state, dispatch }}>
//             {children}
//         </UserContext.Provider>
//     );
// }



