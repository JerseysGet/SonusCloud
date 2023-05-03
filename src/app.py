from flask import Flask, render_template, request
from song_db import Database
import json

app = Flask(__name__)
artists_map = {
    "5sos": 0,
    "chainsmokers": 1,
    "radwimps": 2,
    "queen": 3,
    "kitri": 4,
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/artists")
def artists():
    return render_template("artists.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/search")
def search():
    return render_template("search.html")


@app.route("/spotlight")
def spotlight():
    return render_template("spotlight.html")


@app.route("/<name>")
def artist(name: str):
    with app.open_resource(f"static/artists/{name}.json") as f:
        data = json.load(f)

    return render_template("artist.html", **data)


@app.route("/<name>/<int:album_index>")
def album(name: str, album_index: int):
    with app.open_resource(f"static/artists/{name}.json") as f:
        data = json.load(f)

    db = Database()
    songIDs = db.get_songs(artists_map[name], album_index)
    db.close()
    return render_template(
        "album.html", **data, album_index=album_index, songIDs=songIDs
    )


@app.route("/toggle_song", methods=["POST"])
def toggle_song():
    song_data = json.loads(request.get_data().decode("UTF-8"))
    db = Database()
    db.toggle_song(song_data["artistID"], song_data["albumID"], song_data["songID"])
    db.close()
    return {}


@app.route("/playlist")
def playlist():
    # db = Database()
    # songs = db.get_all_songs()
    # # map tuple to artist,album,song
    return render_template("playlist.html")


if __name__ == "__main__":
    app.run(debug=True)
