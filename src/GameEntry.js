import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import DrawingCanvas from './DrawingCanvas'
import firebase from './firebase'
import history from './history'
import Navbar from './Navbar'

class SingleGame extends Component {

  constructor () {
    super()
    this.state = {
      firebaseKey: 0,
      gameId: 0,
      player1: {
        name: '',
        content: []
      },
      player2: {
        name: '',
        content: []
      },
      player3: {
        name: '',
        content: []
      },
      player4: {
        name: '',
        content: []
      },
      status: ''
    }
    this.getGameDetails = this.getGameDetails.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getGameDetails() {
    const gamesRef = firebase.database().ref('games');
    let firebaseKey = 0, player1 = {}, player2 = {}, player3 = {}, player4 = {}, status = ''
    let gameId = +this.props.match.params.code
    gamesRef.on('value', (snapshot) => {
      let games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === gameId) {
          Object.keys(games).forEach(key => {
            if (games[key].gameId === gameId) {
              firebaseKey = key
            }
          })
          player1 = {
            name: games[game].player1.name,
            content: [games[game].player1.image1, games[game].player1.text1, games[game].player1.image2, games[game].player1.text2]
          }
          player2 = {
            name: games[game].player2.name,
            content: [games[game].player2.image1, games[game].player2.text1, games[game].player2.image2, games[game].player2.text2]
          }
          player3 = {
            name: games[game].player3.name,
            content: [games[game].player3.image1, games[game].player3.text1, games[game].player3.image2, games[game].player3.text2]
          }
          player4 = {
            name: games[game].player4.name,
            content: [games[game].player4.image1, games[game].player4.text1, games[game].player4.image2, games[game].player4.text2]
          }
          status = games[game].status
          this.setState({
            firebaseKey, gameId, player1, player2, player3, player4, status
          })
        }
      }
    })
  }

  componentDidMount() {
    this.getGameDetails()
  }

  handleSubmit(event) {
    event.preventDefault()
    let newPlayerName = event.target.newPlayerName.value
    let currentPlayers = []
    Object.keys(this.state).filter(key => key.includes('player')).filter(player => this.state[player].name).forEach(player => {
      currentPlayers.push(this.state[player].name)
    })
    const gamesRef = firebase.database().ref('games')
    gamesRef.child(`/${this.state.firebaseKey}/player${currentPlayers.length + 1}/name`).set(newPlayerName)
    history.push(`/games/${this.state.gameId}/players/${currentPlayers.length + 1}`)
  }

  render() {

      let currentPlayers = []
      if (this.state.gameId !== 0) {
        Object.keys(this.state).filter(key => key.includes('player')).filter(player => this.state[player].name).forEach(player => {
          currentPlayers.push(this.state[player].name)
        })
        return (
          <div>
            <Navbar />
            <img className="background-image" src='/images/sheep.png' />
            <div className="home-content">
              <h1 className="bigMediumTitle">Current Players</h1>
              { currentPlayers.map((player, index) => (
                <h2 key={index} className="mediumTitle">{player}</h2>
              ))}
              <form onSubmit={this.handleSubmit} className="inline-column">
                <input name="newPlayerName" placeholder="Enter your name here" className="ui input" />
                <button type="submit" className="ui purple button">Continue</button>
              </form>
            </div>
          </div>
        )
      } else {
        return (
          <div className="no-scroll">
            <img className="background-image" src='/images/sheep.png' />
          </div>
        )
      }

  }
}

export default SingleGame;
