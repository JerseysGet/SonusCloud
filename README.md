#  SonusCloud: Phase 1

SonusCloud is an **Internet Music Database**, with current functionality of viewing various artists, their albums and songs.


## Usage Instructions
Download the *src* folder, and open index.html to view the website.

## Directory structure
All files used directly in the website reside in the *src* folder.
- *src/assets* contains the images and fonts used in the website
- *src/assets/fonts* contains the fonts used in the website.
- *src/assets/images* contains logos of the website, and images of artists and album covers for each artist

*src* also contains *style.css* which contains the CSS for the entire website, along with the html files for home, artists and about pages.
- *src/artists* contains the files for each artist, with an artist page and several album pages for each artist.
- *src/artists/<artist_name>/albums* contains the album pages for each artist.

Outside *src*, *scrape.py* and *requirements.txt* are used for scraping data (album cover, song names etc.) for populating the artist and album pages.
