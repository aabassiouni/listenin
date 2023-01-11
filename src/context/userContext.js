import { createContext, useState, useEffect,useContext, useReducer,useMemo } from "react";
import { spotifyApi } from "../spotify/spotify";
import { getHashParams } from "../util/util";
import axios from "axios";

export const UserContext = createContext();

const initialState = {
    token: null,
    isLoggedIn: false,
    user: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {token: null,
        isLoggedIn: false,
        user: action.payload
        }
    case 'LOGOUT':
      return {token: null,
        isLoggedIn: false,
        user: null}
    default:
      return state
  }
};


export function UserContextProvider({ children }) {

  const [state, dispatch] = useReducer(authReducer, initialState);
  // const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  useEffect(() => {

      console.log("useEffect is being run");
      console.log("state is", state);
      if(!state.isLoggedIn){
          console.log("user is null");
          const params = getHashParams();
          const token = params.access_token;
          const userID = params.userID;
          console.log("params are", params);
          console.log("token is", token);
          console.log("userID is", userID);
          
          axios.get(`http://localhost:8888/users/?userID=${userID}`).then((res) => {
              console.log("res is", res);
              var userFromApi = res.data;
              console.log("userFromApi is", userFromApi);
              dispatch({type: 'LOGIN',   payload: {token: token,
                                                    isLoggedIn: true,
                                                    user: userFromApi}});
          });
          return;
      }
  }, []);

  return (
    <UserContext.Provider value={{...state, dispatch}}>
      {children}
    </UserContext.Provider>
  )
}

  // export function useAPI() {
  //   const context = useContext(UserContext);
  //   if (context === undefined) {
  //     throw new Error("Context must be used within a Provider");
  //   }
  //   return context;
  // }



