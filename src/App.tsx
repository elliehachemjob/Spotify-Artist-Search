import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [token, setToken] = useState<any>("");
  const [data, setData] = useState<any>({});

  const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

  const SPOTIFY_ENDPOINT_AUTHORIZATION =
    "https://accounts.spotify.com/authorize";

  const CLIENT_ID: any = "eae2c519c3084b16a48056ce021a5ae2";
  const REDIRECT_URI: any = "http://localhost:3000/";
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
  };

  /*
expected Url: http://localhost:3000/#access_token=BQADfrbQPCfRd-1FPIdzEs6LkLpWSIxmu-f5iMzxhhRU7uvFVysPOgZwsgU8IgPS7T1CzUbS8gv1_KpYQ_kaSSeZ5aL8mPswB7SdlKhilqsDLp1YfNj-jRgpZA3ogPNTZgCJNYg4YVJXQDHRC-g7cdTZ-k9HEROgnnFBCpA&token_type=Bearer&expires_in=3600
*/

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

  const getArtist = () => {
    axios
      .get(PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <button onClick={handleLogin}>Login</button>
      <button onClick={getArtist}>Get Artist</button>
      {data?.items
        ? data.items.map((item: any) => {
            <p>{item.name}</p>;
          })
        : null}
    </div>
  );
}

export default App;
