const bcrypt = require('bcrypt')

module.exports = {
    register: async (req, res) => {
        const { username, password } = req.body
        const db = req.app.get('db')

        let authorizedUser = await db.check_username(username)
        authorizedUser = authorizedUser[0]
        if (authorizedUser) {
            res.status(409).send('Email already exists')
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)

        let newUser = await db.register({ username, password: hash })
        newUser = newUser[0]
        res.status(200).send(newUser)
    },

    login: async (req, res) => {
        const { username, password } = req.body
        const db = req.app.get('db')
        let authorizedUser = await db.get_user({ username })
        authorizedUser = authorizedUser[0]

        if (!authorizedUser) {
            res.status(400).send('Email does not exist')
        }
        const authenticated = bcrypt.compareSync(password, authorizedUser.password)

        if (authenticated) {
            delete authorizedUser.password;
            req.session.user = authorizedUser;
            res.status(202).send(req.session.user)
        } else {
            res.status(401).send('Password is incorrect')
        }

        res.status(200).send(authorizedUser)
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },

    grabPosts: async (req, res) => {
        const { userId } = req.params
        const db = req.app.get('db')

        let posts = await db.grab_posts()

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