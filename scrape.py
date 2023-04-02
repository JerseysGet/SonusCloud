import spotipy
import requests
from rich import print
from spotipy.oauth2 import SpotifyClientCredentials


spotify = spotipy.Spotify(
    client_credentials_manager=SpotifyClientCredentials())

artist_name = "chainsmokers"
artist_id = "69GGBxA162lTqCwzJG5jLp"

albums = spotify.artist_albums(artist_id, album_type='album')

for i, album in enumerate(albums["items"], start=1):
    album_year = album["release_date"][:4]
    with open(f"./src/assets/images/{artist_name}/a{i}.jpg", "wb") as f:
        f.write(requests.get(album["images"][0]["url"]).content)
    x = spotify.album_tracks(album["id"])
    songs = [item["name"] for item in x["items"]]
    newline = "\n"
    artist_html = f'''
    <div class="album">
      <div class="container">
        <div class="top">
          <img src="../../assets/images/{artist_name}/a{i}.jpg" alt="" />
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
      <div class="inside">
        <div class="contents">
          <h2>Songs</h2>
          <ol class="songs_list">
            {newline.join(["<li>"+song+"</li>" for song in songs])}
          </ol>
        </div>
      </div>
    </div>
    '''
    print(artist_html)

