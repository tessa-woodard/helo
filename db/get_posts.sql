SELECT p.id, p.author_id, p.title, p.img, p.content, u.profile_pic
FROM posts p
JOIN users u ON u.id = p.author_id