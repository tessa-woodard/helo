const bcrypt = require('bcrypt')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get("db")
        const { username, password } = req.body

        const [user] = await db.check_user([username])

        if (user) {
            return res.status(409).send("Username taken")
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const [newUser] = await db.register_user([username, hash])

        req.session.user = newUser

        res.status(200).send(req.session.user)
    },

    getUser: (req, res) => {
        if (req.session.user) {
            res.status(200).send(req.session.user)
        } else {
            res.status(404).send('No session found')
        }
    },

    login: async (req, res) => {
        const db = req.app.get("db")

        const { username, password } = req.body

        const [existingUser] = await db.check_user([username])

        if (!existingUser) {
            return res.status(404).send("User does not exist")
        }

        const isAuthenticated = bcrypt.compareSync(password, existingUser.hash)

        if (!isAuthenticated) {
            return res.status(403).send("Incorrect username or password")
        }

        delete existingUser.hash

        req.session.user = existingUser

        res.status(200).send(req.session.user)
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },

    me: async (req, res) => {
        const db = req.app.get("db")
        const { user_id } = req.session
        const { username, profile_pic } = req.session
        const user = await db.me(user_id, username, profile_pic)
        res.status(200).send(req.session.user)
    },

    getPosts: async (req, res) => {
        const db = req.app.get("db")

        const { id } = req.session.user
        const { search, user_posts } = req.query

        const posts = await db.get_posts()

        if (user_posts === "true" && search) {
            const lowerSearch = search.toLowerCase()
            const filteredPosts = posts.filter((post) =>
                post.title.toLowerCase().includes(lowerSearch)
            )
            return res.status(200).send(filteredPosts)
        } else if (user_posts === "false" && !search) {
            const filteredPosts = posts.filter((post) => post.author_id != id)
            return res.status(200).send(filteredPosts)
        } else if (user_posts === "false" && search) {
            const lowerSearch = search.toLowerCase()
            const filteredPosts = posts.filter(
                (post) =>
                    post.author_id != id && post.title.toLowerCase().includes(lowerSearch)
            )
            return res.status(200).send(filteredPosts);
        } else {
            return res.status(200).send(posts)
        }
    },

    getPostById: async (req, res) => {
        const db = req.app.get("db")

        const { id } = req.params

        const post = await db.get_post_by_id([id])

        res.status(200).send(post)
    },

    writePost: async (req, res) => {
        const db = req.app.get("db")
        const { id } = req.session.user
        const { title, img, content } = req.body
        await db.write_post([id, title, img, content])
        const posts = await db.get_posts()
        res.status(200).send(posts)
    },

    deletePost: async (req, res) => {
        const db = req.app.get("db")
        const { id } = req.params
        await db.delete_post([id])
        const posts = await db.get_posts()
        res.status(200).send(posts)
    },
}