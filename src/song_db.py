import sqlite3


class Database:
    def __init__(self) -> None:
        self.connection = sqlite3.connect("sonuscloud.db")
        self.cursor = self.connection.cursor()

    def insert_song(self, song_id: int) -> None:
        self.cursor.execute(f"INSERT INTO SONGS(SONG_ID) VALUES({song_id})")
        self.connection.commit()

    def remove_song(self, song_id: int) -> None:
        self.cursor.execute(f"SELECT * FROM SONGS WHERE SONG_ID = {song_id}")
        song = self.cursor.fetchall()
        if len(song) != 0:
            self.cursor.execute(f"DELETE FROM SONGS WHERE SONG_ID = {song_id}")
            self.connection.commit()

    def get_songs(self) -> list[int]:
        self.cursor.execute(f"SELECT * FROM SONGS")
        return [song[0] for song in self.cursor.fetchall()]

    def close(self) -> None:
        self.connection.close()
