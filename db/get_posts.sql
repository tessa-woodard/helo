SELECT p.id, p.title, p.author_id , u.username, u.profile_pic FROM posts p
JOIN users u ON p.author_id = u.id;