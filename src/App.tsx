import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [token, setToken] = useState<any>("");
  const [data, setData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>("deadmau5");
  const [popularity, setPopularity] = useState<string>("");
  const [followers, setFollowers] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [id, setId] = useState<string>("");

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

  const getPlaylist = () => {
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

  const getArtist = () => {
    axios
      .get(
        "https://api.spotify.com/v1/artists?ids=2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(
          // `main data  ${JSON.stringify(response)}`,
          `Id Of the user is  ${JSON.stringify(response.data.artists[0].id)}`,
          `name is ${JSON.stringify(response.data.artists[0].name)}`,
          `popularity is ${JSON.stringify(
            response.data.artists[0].popularity
          )}`,
          `followers count is ${JSON.stringify(
            response.data.artists[0].followers.total
          )}`,
          `image is  ${JSON.stringify(response.data.artists[0].images[0].url)}`
        );

        // setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchArtist = () => {
    axios
      .get(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=track%2Cartist`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(
          // `main data  ${JSON.stringify(response)}`,
          `followers is ${JSON.stringify(
            response.data.artists.items[0].followers.total
          )}`,
          `image is ${JSON.stringify(
            response.data.artists.items[0].images[0].url
          )}`,
          `popularity is  ${JSON.stringify(
            response.data.artists.items[0].popularity
          )}`,
          `id is   ${JSON.stringify(response.data.artists.items[0].id)}`
        );

        setPopularity(
          JSON.stringify(response.data.artists.items[0].popularity)
        );
        setFollowers(
          JSON.stringify(response.data.artists.items[0].followers.total)
        );
        setId(JSON.stringify(response.data.artists.items[0].id));
        setImage(JSON.stringify(response.data.artists.items[0].images[0].url));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const AlbumSearch = () => {
    axios
      .get(
        `https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/albums?include_groups=single%2Cappears_on&market=ES&limit=10&offset=5`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        console.log(`album name ${response.data.items[1].name}`);
        console.log(`release date ${response.data.items[1].release_date}`);
        console.log(`total tracks ${response.data.items[1].total_tracks}`);
        console.log(
          `preview album link ${response.data.items[1].external_urls.spotify}`
        );
        console.log(
          `Artits included  ${response.data.items[1].artists[0].name}`
        );
        console.log(`Album cover is  ${response.data.items[1].images[0].url}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <button onClick={handleLogin}>Login</button>
      <button onClick={getPlaylist}>Get playlist</button>
      <button onClick={getArtist}>Get Artist</button>
      <button onClick={searchArtist}>Search Artist </button>
      <button onClick={AlbumSearch}>Album Search </button>

      <input
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
      <table>
        <tr>
          <th>Image</th>
          <th>Poplurity</th>
          <th>Followers</th>
        </tr>
        <tr>
          <td>{image}</td>
          <td>{popularity}</td>
          <td>{followers}</td>
        </tr>
      </table>
    </div>
  );
}

export default App;
