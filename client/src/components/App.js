import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Search from './components/Search';
import Insert from './components/Insert';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/search" component={Search} />
                <Route path="/insert" component={Insert} />
            </Switch>
        </Router>
    );
}

export default App;