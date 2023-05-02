import sqlite3

primes = [p for p in range(2,1000) if all(p%i!=0 for i in range(2,p))]

class Database:
    def __init__(self):
        self.connection = sqlite3.connect('sonuscloud.db')
        self.cursor = self.connection.cursor()
    
    def insert_song(self, song_id):
        self.cursor.execute(f'INSERT INTO SONGS(ID) VALUES({song_id})')
        self.connection.commit()
    
    def close(self):
        self.connection.close()
db = Database()

db.close()



