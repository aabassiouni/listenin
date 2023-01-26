import { createContext, useState, useEffect,useContext, useReducer,useMemo } from "react";
import { spotifyApi } from "../spotify/spotify";
import { getHashParams } from "../util/util";
import axios from "axios";

export const UserContext = createContext();

const initialState = {
    access_token: null,
    refresh_token: null,
    isLoggedIn: false,
    user: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {access_token: null,
        refresh_token: null,
        isLoggedIn: false,
        user: action.payload
        }
    case 'LOGOUT':
      return {access_token: null,
        refresh_token: null,
        isLoggedIn: false,
        user: null}
    default:
      return state
  }
};


export function UserContextProvider({ children }) {

  const [state, dispatch] = useReducer(authReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  useEffect(() => {

      console.log("useEffect in user context is being run");
      console.log("state is", state);
      if(!state.isLoggedIn){
          console.log("user is null");
          const params = getHashParams();
          const access_token = params.access_token;
          const refresh_token = params.refresh_token;
          const userID = params.userID;
          console.log("params are", params);
          console.log("token is", access_token);
          console.log("userID is", userID);
          console.log("refresh_token is", refresh_token);

          if (!userID) {
              console.log("no userID");
              return;
          }

          axios.get(`http://localhost:8888/users/?userID=${userID}`).then((res) => {
              console.log("res is", res);
              var userFromApi = res.data;
              console.log("userFromApi is", userFromApi);
              dispatch({type: 'LOGIN',   payload: {access_token: access_token,
                                                    refresh_token: refresh_token,
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

  export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error("Context must be used within a Provider");
    }
    return context;
  }



