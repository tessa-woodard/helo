const bcrypt = require('bcrypt')

module.exports = {
    register: async (req, res) => {
        const { username, password } = req.body
        const db = req.app.get('db')

        const [user] = await db.check_username([username])
        if (user) return res.status(409).send('User exists')

        const profile_pic = `https://robohash.org/${username}.png`

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const [newUser] = await db.register([username, hash, profile_pic])
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
        const { username, password } = req.body
        const db = req.app.get('db')
        const [existingUser] = await db.check_username([username])
        if (!existingUser) {
            return res.status(409).send('User does not exist')
        }

        const isAuthenticated = bcrypt.compareSync(password, existingUser.password)
        if (!isAuthenticated) {
            return res.status(403).send('Incorrect username or password')
        }

        delete existingUser.password
        req.session.user = existingUser

        res.status(200).send(req.session.user)

    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },

    getPosts: async (req, res) => {
        const { userId } = req.params
        const db = req.app.get('db')

        let posts = await db.get_posts()

        if (req.query.posts === true && req.query.search) {
            posts = posts.filter(e => e.title === req.query.search)
            return posts
        }
        if (req.query.user === false && !req.query.search) {
            posts = posts.filter(e => e.author_id !== userId)
            return posts
        }
        if (req.query.posts === false && req.query.search) {
            posts = posts.filter(e => e.title === req.query.search && e.author_id !== userId)
            return posts
        }
        if (req.query.posts === true && !req.query.search) {
            return posts
        }
        res.status(200).send(posts)
    }
}