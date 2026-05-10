CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  genre TEXT,
  minPlayers INTEGER,
  maxPlayers INTEGER,
  playTime INTEGER,
  difficulty TEXT,
  description TEXT,
  imageUrl TEXT,
  isFavorite INTEGER DEFAULT 0
);
