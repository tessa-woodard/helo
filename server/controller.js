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
        console.log('hit logout')
        console.log(req.session)
        req.session.destroy();
        console.log(req.session)
        res.sendStatus(200)
    },

    getPosts: async (req, res) => {
        const { userid } = req.params
        const db = req.app.get('db')

        let posts = await db.get_posts()

        if (req.query.userposts === true && req.query.search) {
            posts = posts.filter(e => e.title === req.query.search)
            return posts
        }
        if (req.query.userposts === false && !req.query.search) {
            posts = posts.filter(e => e.author_id !== userid)
            return posts
        }
        if (req.query.userposts === false && req.query.search) {
            posts = posts.filter(e => e.title === req.query.search && e.author_id !== userid)
            return posts
        }
        if (req.query.userposts === true && !req.query.search) {
            return posts
        }
        res.status(200).send(posts)
    }
}