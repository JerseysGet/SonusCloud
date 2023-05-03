import sqlite3
import os


class Database:
    def __init__(self) -> None:
        self.connection = sqlite3.connect("sonuscloud.db")
        self.cursor = self.connection.cursor()
        if not self.__table_exists():
            self.__create_table()

    def __table_exists(self) -> bool:
        self.cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='SONGS'"
        )
        return len(self.cursor.fetchall()) == 1

    def __create_table(self) -> None:
        self.cursor.execute(
            "CREATE TABLE SONGS(ARTIST_ID INTEGER NOT NULL, ALBUM_ID INTEGER NOT NULL, SONG_ID INTEGER NOT NULL, PRIMARY KEY(ARTIST_ID, ALBUM_ID, SONG_ID));"
        )
        self.connection.commit()

    def __delete_table(self) -> None:
        self.cursor.execute("DROP TABLE SONGS")
        self.connection.commit()
    
    def __song_exists(self, artist_id: int, album_id: int, song_id: int) -> bool:
        self.cursor.execute(f"SELECT FROM SONGS WHERE ARTIST_ID = {artist_id} AND ALBUM_ID = {album_id} AND SONG_ID = {song_id}")     
        return len(self.cursor.fetchall()) != 0
     
    def __insert_song(self, artist_id: int, album_id: int, song_id: int) -> None:
        self.cursor.execute(f"INSERT INTO SONGS(ARTIST_ID, ALBUM_ID, SONG_ID) VALUES({artist_id}, {album_id}, {song_id})")
        self.connection.commit()

    def __remove_song(self, artist_id: int, album_id: int, song_id: int) -> None:
        self.cursor.execute(f"DELETE FROM SONGS WHERE ARTIST_ID = {artist_id} AND ALBUM_ID = {album_id} AND SONG_ID = {song_id}")     
        self.connection.commit()  

    def get_songs(self) -> list[int]:
        self.cursor.execute(f"SELECT * FROM SONGS")
        return [song[0] for song in self.cursor.fetchall()]

    def close(self) -> None:
        self.connection.close()


if __name__ == "__main__":
    db = Database()
    db.toggle_song(1, 1, 1)
    db.close()
