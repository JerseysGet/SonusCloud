from flask import Flask, render_template, request
from song_db import Database
import json

app = Flask(__name__)


def get_primes(upper_limit: int) -> list[int]:
    return [p for p in range(2, 1000) if all(p % i != 0 for i in range(2, p))]


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
    song_id = db.get_songs()
    db.close()

    return render_template("album.html", **data, album_index=album_index)


@app.route("/add_song", methods=["POST"])
def add_song():
    print(json.loads(request.get_data().decode("UTF-8")))
    return {}


if __name__ == "__main__":
    app.run(debug=True)
