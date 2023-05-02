import sqlite3

primes = [p for p in range(2, 1000) if all(p % i != 0 for i in range(2, p))]

class Database:
    def __init__(self):
        self.connection = sqlite3.connect('sonuscloud.db')
        self.cursor = self.connection.cursor()

    def insert_song(self, song_id):
        self.cursor.execute(f'INSERT INTO SONGS(SONG_ID) VALUES({song_id})')
        self.connection.commit()

    def remove_song(self, song_id):
        self.cursor.execute(f"SELECT * FROM SONGS WHERE SONG_ID = {song_id}")
        song = self.cursor.fetchall()
        if len(song) != 0:
            self.cursor.execute(f"DELETE FROM SONGS WHERE SONG_ID = {song_id}")
            self.connection.commit()

    def get_songs(self):
        self.cursor.execute(f"SELECT * FROM SONGS")
        return [song[0] for song in self.cursor.fetchall()]

    def close(self):
        self.connection.close()
