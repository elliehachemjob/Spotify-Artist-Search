import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Rating from "@mui/material/Rating";
import "../App.css";

export function ArtistAlbums() {
  const [albumName, setAlbumName] = useState<any>();
  const [releaseData, setReleaseDate] = useState<any>();
  const [totalTracks, setTotalTracks] = useState<any>();
  const [albumLink, setAlbumLink] = useState<any>();
  const [artistIncluded, setArtistIncluded] = useState<any>();
  const [albumCover, setAlbumCover] = useState<any>();
  const [items, setItems] = useState<any>();
  const [value, setValue] = useState<any>();

  useEffect(() => {
    axios
      .get(
        `https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/albums?include_groups=single%2Cappears_on&market=ES&limit=10&offset=5`,
        {
          headers: {
            Authorization:
              "Bearer " +
              "BQDdOsPHDIML_0X_fZTUgl3iN4D2n3VrB4MIKeiExAdFIWP3bXvwoA_94jL9OsEPugPJM14QwcYy2x8_OEzx3Obhf2b5UvRdSab70C4hUmVkidbo5WRVCFhmM6sw1tvpS5KKhqRf7p3d82fZM5uqsHQn57V0Icgc2znZyNbkXM3QZsjPvg&token",
          },
        }
      )
      .then((response) => {
        setItems(response.data);
      })

      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      {items
        ? items.items.map((item: any) => {
            return (
              <div>
                <Card className="item" sx={{ maxWidth: 300 }}>
                  <CardContent>
                    {item.images
                      .filter((img: any) => img.height === 300)
                      .map((img: any) => {
                        return (
                          <CardMedia
                            component="img"
                            height="200"
                            image={img.url}
                            alt="album cover"
                          />
                        );
                      })}

                    <Typography>{item.name}</Typography>

                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {/* {item.name} */}
                    </Typography>
                    <Typography
                      sx={{ position: "relative", top: 35 }}
                      color="text.secondary"
                    >
                      {item.release_date}
                    </Typography>
                    <Typography
                      sx={{ position: "relative", top: 30 }}
                      color="text.secondary"
                    >
                      {item.total_tracks} tracks
                    </Typography>
                    <Typography
                      sx={{ position: "relative", top: 25 }}
                      color="text.secondary"
                    >
                      {item.artists.map((artistsIncluded: any) => {
                        return <span> {artistsIncluded.name} /</span>;
                      })}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() => {
                        window.open(item.external_urls.spotify);
                      }}
                      size="small"
                    >
                      Preview On Spotify
                    </Button>
                  </CardActions>
                </Card>
              </div>
            );
          })
        : null}
    </div>
  );
}
