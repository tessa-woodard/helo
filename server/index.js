require("dotenv").config()

const express = require('express')
const massive = require('massive')
const session = require('express-session')

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const ctrl = require('./controller')
const postCtrl = require('./postController')

const app = express()
app.use(express.json())

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

app.get('/api/posts/:id', postCtrl.getPosts)
app.post('/api/posts', postCtrl.addPost)
app.delete('/api/posts/:post_id', postCtrl.deletePost)
app.get('/api/post/:id', postCtrl.getPost)

massive({
    connectionString:
        CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(dbInstance => {
    app.set('db', dbInstance)
    console.log('DB working')
    app.listen(SERVER_PORT, () =>
        console.log(`Server listening on port ${SERVER_PORT}`))
}).catch(err => console.log(err))