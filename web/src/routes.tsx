import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './pages/Home'
import Profile from './pages/Profile'

function Router() {
    return (
        <BrowserRouter forceRefresh={true} >
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/:nickname" exact component={Profile} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router