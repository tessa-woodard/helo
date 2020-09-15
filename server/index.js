require("dotenv").config()

const express = require('express')
const massive = require('massive')
const session = require('express-session')
const app = express()
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const ctrl = require('./controller')

app.use(express.json())

const port = SERVER_PORT

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('DB connected.')
})

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.post('/api/auth/register', ctrl.register)
app.post('/api/auth/login', ctrl.login)
app.post('/api/auth/logout', ctrl.logout)

app.get('/api/posts/:userid', ctrl.getPosts)

app.listen(port, () => console.log(`Listening on port ${port}!`))