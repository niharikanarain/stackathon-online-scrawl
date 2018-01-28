import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Router } from 'react-router-dom'
import history from './history'
import LandingPage from './LandingPage'
import NewGame from './NewGame'
import SingleGame from './SingleGame'
import GameEntry from './GameEntry'
import Instructions from './Instructions'
import GameResults from './GameResults'

class App extends Component {

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/instructions" component={Instructions} />
          <Route exact path="/new-game" component={NewGame} />
          <Route exact path="/game-entry/:code" component={GameEntry} />
          <Route exact path="/games/:code/players/:playerNum" component={SingleGame} />
        </Switch>
      </Router>
    )
  }
}

export default App;
