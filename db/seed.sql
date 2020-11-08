DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

create table users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20),
    hash VARCHAR(20),
    profile_pic text
);

create table if not exists posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(45),
    img TEXT,
    content TEXT,
    author_id INT REFERENCES users(id)
);

ALTER TABLE users
ALTER COLUMN hash TYPE TEXT;