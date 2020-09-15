import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Auth from './Components/Auth/Auth'
import Dashboard from './Components/Dashboard/Dashboard'
import Post from './Components/Post/Post'
import Form from './Components/Form/Form'

export default (
    <Switch>
        <Route path='/' exact component={Auth} />
        <Route path='/Dashboard' component={Dashboard} />
        <Route path='/post/:id' component={Post} />
        <Route path='/new' component={Form} />
    </Switch>
)