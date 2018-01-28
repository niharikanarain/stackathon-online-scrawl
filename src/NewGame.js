import React, { Component } from 'react'
import { Link } from 'react-router'
import firebase from './firebase'
import history from './history'
import Navbar from './Navbar'

class NewGame extends Component {

  constructor() {
    super()
    this.state = {
      gameId: 0
    }
    this.createGame = this.createGame.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  createGame() {
    let newGameId = Math.floor(Math.random() * 10000)
    this.setState({
      gameId: newGameId
    })
  }

  componentDidMount() {
    this.createGame()
  }

  handleSubmit(event) {
    event.preventDefault()
    let name = event.target.name.value
    const gamesRef = firebase.database().ref('games')
    const game = {
      gameId: this.state.gameId,
      player1: {
        name: name,
        image1: '',
          text1: '',
          image2: '',
          text2: ''
      },
      player2: {
        name: '',
        image1: '',
        text1: '',
        image2: '',
        text2: ''
      },
      player3: {
        name: '',
        image1: '',
        text1: '',
        image2: '',
        text2: ''
      },
      player4: {
        name: '',
        image1: '',
        text1: '',
        image2: '',
        text2: ''
      },
      status: 'open',
      currentRound: {
        allPlayers: 'draw',
        player1: '',
        player2: '',
        player3: '',
        player4: ''
      }
    }
    gamesRef.push(game)
    history.push(`/games/${this.state.gameId}/players/${1}`)
  }

  render() {
    return (
      <div className="no-scroll">
        <Navbar />
        <img className="background-image" src='/images/sheep.png' />
        <div className="home-content">
          { this.state.gameId && (
            <h2 className="mediumTitle">Your game code: {this.state.gameId}</h2>
          )}
          <form onSubmit={this.handleSubmit} className="inline-column">
            <h2 className="mediumTitle">Enter your name below</h2>
            <input className="ui input" name="name" placeholder="Enter name here" />
            <button type="submit" className="ui purple button">Go to game</button>
          </form>
        </div>
      </div>
    )
  }
}

export default NewGame;

