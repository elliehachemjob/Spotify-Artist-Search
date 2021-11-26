import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ArtistAlbums } from "./page/ArtistAlbums";
import { Dashboard } from "./page/Dashboard";
import { useLocalstorage } from "rooks";

function App() {
  const [token, setToken, removeToken] = useLocalstorage("accessToken");

  const SPOTIFY_ENDPOINT_AUTHORIZATION =
    "https://accounts.spotify.com/authorize";

  const CLIENT_ID: any = "eae2c519c3084b16a48056ce021a5ae2";
  const REDIRECT_URI: any = "http://localhost:3000/dashboard/";
  const SCOPES: any = [
    "user-read-playback-state",
    "user-read-currently-playing",
    "playlist-read-private",
  ];
  const DELIMITER: any = "%20";
  const SCOPE_URI_PARAM: any = SCOPES.join(DELIMITER);

  const handleLogin = () => {
    // @ts-ignore
    window.location = `${SPOTIFY_ENDPOINT_AUTHORIZATION}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE_URI_PARAM}&response_type=token&show_dialog=true`;
    // var x = localStorage.getItem("accessToken");
    // console.log(`access token is ${x}`);
  };

  const getReturnParamsFromSpotifyAuth = (hash: any) => {
    const stringAfterHash = hash.substring(1);
    const paramsInUrl = stringAfterHash.split("&");
    const paramsSplitUp = paramsInUrl.reduce(
      (accumulator: any, currentValue: any) => {
        console.log(currentValue);
        const [key, value] = currentValue.split("=");
        accumulator[key] = value;
        return accumulator;
      },
      {}
    );
    return paramsSplitUp;
  };

  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnParamsFromSpotifyAuth(window.location.hash);
      console.log({ access_token });
      localStorage.clear();
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("expiresIn", expires_in);
      localStorage.setItem("tokenType", token_type);
    }
  });

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
    }
  }, []);

  const useStyles = makeStyles({
    login: {
      display: "grid",
      placeItems: "center",
      height: "100vh",
      backgroundColor: "black",

      "& img": {
        width: "50%",
      },

      "& a": {
        padding: "20px",
        borderRadius: "99px",
        backgroundColor: "#1db954",
        fontWeight: 600,
        color: "white",
        textDecoration: "none",
      },

      "& a:hover": {
        backgroundColor: " white",
        borderColor: "#1db954",
        color: "#1db954",
      },
    },
  });
  const classes = useStyles();

  const Login = () => {
    return (
      <div className={classes.login}>
        <img
          src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
          alt="Spotify-Logo"
        />
        <a onClick={handleLogin}>LOGIN WITH SPOTIFY</a>
      </div>
    );
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/artist/albums/">
          <ArtistAlbums />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
