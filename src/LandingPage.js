import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from './firebase'
import history from './history'

class LandingPage extends Component {

  constructor() {
    super()
    this.state = {
      gameIds: []
    }
    this.getGameIds = this.getGameIds.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getGameIds () {
    const gamesRef = firebase.database().ref('games');
    gamesRef.on('value', (snapshot) => {
      let games = snapshot.val()
      let newState = []
      for (let game in games) {
        newState.push(games[game].gameId)
      }
      this.setState({
        gameIds: newState
      })
    })
  }

  componentDidMount () {
    this.getGameIds()
  }

  handleSubmit(event) {
    event.preventDefault()
    let code = +event.target.gameCode.value
    if (this.state.gameIds.includes(code)) {
      let player1 = {}, player2 = {}, player3 = {}, player4 = {}, status = '', currentNumberOfPlayers = 0
      const gamesRef = firebase.database().ref('games')
      gamesRef.on('value', (snapshot) => {
        let games = snapshot.val()
        for (let game in games) {
          if (games[game].gameId === code) {
            player1 = {
              name: games[game].player1.name,
            }
            player2 = {
              name: games[game].player2.name,
            }
            player3 = {
              name: games[game].player3.name,
            }
            player4 = {
              name: games[game].player4.name,
            }
            let playerObj = {player1, player2, player3, player4}
            currentNumberOfPlayers = Object.keys(playerObj).filter(playerKey => playerObj[playerKey].name).length
          }
        }
      })
      if (currentNumberOfPlayers !== 4) {
        history.push(`/game-entry/${code}`)
      } else {
        alert('Error: The game you are trying to join is full. Please join another game or start a new game.')
      }
    } else {
      alert('Error: The game code you entered does not exist. Please try again or start a new game.')
    }
  }

  render() {
    return (
      <div className="no-scroll">
        <img className="background-image" src='/images/sheep.png' />
        <div className="home-content1">
          <div className="inline-row">
            <h1 className="bigTitle">Doodlee</h1>
            <img src='/images/pencil.png' className="pencil-image"/>
          </div>
          <h2 className="mediumTitle">Telephone game meets Pictionary!</h2>
          <h6 className="smallTitle">(Online version of Scrawl)</h6>
          <form onSubmit={this.handleSubmit} className="inline-column">
            <input name="gameCode" placeholder="Enter game code" className="ui input" />
            <button type="submit" className="ui purple button button-style">Join game</button>
          </form>
          <Link to="/new-game" className="button-link"><button className="ui purple button button-style">Start a new game</button></Link>
          <Link to="/instructions" className="button-link2"><button className="ui teal button button-style">Instructions</button></Link>
        </div>
      </div>
    )
  }
}

export default LandingPage;
