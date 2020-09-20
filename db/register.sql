INSERT INTO users 
(username, hash, profile_pic)
VALUES ($1, $2, $3)
returning id, username, profile_pic;