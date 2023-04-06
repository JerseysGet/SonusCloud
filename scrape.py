import spotipy
import requests
import datetime
from pathlib import Path
from spotipy.oauth2 import SpotifyClientCredentials


spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

artist_name = input("Name: ")
artist_id = input("ID: ")

artist = spotify.artist(artist_id)
name = artist["name"]
genre = artist["genres"][0]


Path(f"./src/artists/{artist_name}/albums").mkdir(parents=True, exist_ok=True)
Path(f"./src/assets/images/{artist_name}").mkdir(parents=True, exist_ok=True)

with open(f"./src/assets/images/{artist_name}/{artist_name}.jpg", "wb") as f:
    f.write(requests.get(artist["images"][0]["url"]).content)

albums = spotify.artist_albums(artist_id, album_type="album")

i = 1
L = []
newline = "\n"
for album in albums["items"]:
    album_year = album["release_date"][:4]
    res = input(f"{album['name']} y/n: ").lower()
    if res == "n":
        continue
    with open(f"./src/assets/images/{artist_name}/a{i}.jpg", "wb") as f:
        f.write(requests.get(album["images"][0]["url"]).content)
    songs = spotify.album_tracks(album["id"])["items"]

    tracks_html = []
    for song in songs:
        seconds, ms = divmod(song["duration_ms"], 1000)
        minutes, seconds = divmod(seconds, 60)
        length = f"{minutes}:{seconds:02}"
        tracks_html.append(
            f"""
                <div class="track">
                  <div class="track_info">
                    <li class="track_number">{song["name"]}</li>
                    <div class="track_length">{length}</div>
                  </div>
                </div>"""
        )

    album_page = f"""
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Albums | {album["name"]}</title>
        <link rel="stylesheet" href="../../../style.css" />
      </head>
      <body>
        <div class="navbar">
          <img
            src="../../../assets/images/logo_big_light.png"
            alt="SoC"
            class="logo"
          />
          <nav>
            <a href="../../../index.html">HOME</a>
            <a href="../../../artists.html">ARTISTS</a>
            <a href="../../../about.html">ABOUT</a>
            <div class="dot"></div>
          </nav>
        </div>

        <div class="album_container">
          <div class="album_hero">
            <div class="album_art_border">
              <div
                class="album_art"
                style="
                  background-image: url(../../../assets/images/{artist_name}/a{i}.jpg);
                "
              ></div>
            </div>

            <div class="album_info">
              <div class="album_name">{album["name"]}</div>
              <div class="album_details">
                <div class="release_date">{datetime.datetime.strptime(album["release_date"], "%Y-%m-%d").strftime("%B %Y")}</div>
                <div class="song_count">{album["total_tracks"]} Songs</div>
              </div>
            </div>
          </div>

          <div class="track_container">
            <div class="song_label">Songs</div>
            <ol class="track_list">
              {newline.join(tracks_html)}
            </ol>
          </div>
        </div>

        <footer>
          <a href="./about.html">ABOUT</a>
          <div class="text">Made by Praneeth Jain & Mohammed Faisal</div>
          <img src="../../../assets/images/logo_small_light.png" alt="logo" />
        </footer>
      </body>
    </html>
    """

    with open(f"./src/artists/{artist_name}/albums/album{i}.html", "w") as f:
        f.write(album_page)

    song_names = [song["name"] for song in songs]
    album_html = f"""
    <div class="album">
      <a href="./albums/album{i}.html">
        <div class="container">
          <div class="top">
            <img src="../../assets/images/{artist_name}/a{i}.jpg" alt="{name}" />
          </div>
          <div class="bottom">
            <div class="details">
              <h1>{album["name"]}</h1>
              <p>{album_year}</p>
            </div>
            <div class="album_button">
              <svg
                width="24"
                height="24"
                fill-rule="evenodd"
                clip-rule="evenodd"
              >
                <path
                  d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"
                />
              </svg>
            </div>
          </div>
        </div>
      </a>
      <div class="inside">
        <div class="contents">
          <h2>Songs</h2>
          <ol class="songs_list">
            {newline.join(["<li>"+song+"</li>" for song in song_names])}
          </ol>
        </div>
      </div>
    </div>
    """
    L.append(album_html)
    i += 1

x = f"""
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Artists | {name}</title>
    <link rel="stylesheet" href="../../style.css" />
  </head>
  <body>
    <div class="navbar">
      <img
        src="../../assets/images/logo_big_light.png"
        alt="SoC"
        class="logo"
      />
      <nav>
        <a href="../../index.html">HOME</a>
        <a href="../../artists.html">ARTISTS</a>
        <a href="../../about.html">ABOUT</a>
        <div class="dot"></div>
      </nav>
    </div>

    <div class="artist_container">
      <div class="hero">
        <div
          class="card"
          style="background-image: url(../../assets/images/{artist_name}/{artist_name}.jpg)"
        ></div>
        <div class="artist_info">
          <div class="artist_name">{name}</div>
          <div class="artist_genre">{genre}</div>
          <div class="artist_description">
            Idk how to scrape description
          </div>
        </div>
      </div>

      <div class="transition"></div>

      <div class="albums">
        <div class="header hover_underline">Albums</div>
          {newline.join(L)}
      </div>
    </div>

    <footer>
      <a href="./about.html">ABOUT</a>
      <div class="text">Made by Praneeth Jain & Mohammed Faisal</div>
      <img src="../../assets/images/logo_small_light.png" alt="logo" />
    </footer>
  </body>
</html>
"""

with open(f"./src/artists/{artist_name}/{artist_name}.html", "w") as f:
    f.write(x)
