import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import DrawingCanvas from './DrawingCanvas'
import TextCanvas from './TextCanvas'
import firebase from './firebase'
import GameResults from './GameResults'
import Navbar from './Navbar'

class SingleGame extends Component {

  constructor () {
    super()
    this.state = {
      firebaseKey: 0,
      currentPlayerNum: 0,
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
      status: '',
      currentRound: {
        allPlayers: '',
        byPlayerView: []
      }
    }
    this.getGameDetails = this.getGameDetails.bind(this)
  }

  getGameDetails() {
    let currentPlayerNum = this.props.match.params.playerNum
    const gamesRef = firebase.database().ref('games');
    let firebaseKey = 0, player1 = {}, player2 = {}, player3 = {}, player4 = {}, status = '', currentRound = {}
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
          currentRound = {
            allPlayers: games[game].currentRound.allPlayers,
            byPlayerView: [games[game].currentRound.player1, games[game].currentRound.player2, games[game].currentRound.player3, games[game].currentRound.player4]
          }
          status = games[game].status
          this.setState({
            firebaseKey, currentPlayerNum, gameId, player1, player2, player3, player4, status, currentRound
          })
        }
      }
    })
  }

  componentDidMount() {
    this.getGameDetails()
  }

  render() {

    let currentNumberOfPlayers = 0
    let readyToPlay = false
    let numberNeededToPlay = 0

    if (this.state.gameId !== 0) {
      currentNumberOfPlayers = Object.keys(this.state).filter(key => key.includes('player')).filter(player => this.state[player].name).length
      readyToPlay = currentNumberOfPlayers === 4
      numberNeededToPlay = 4 - currentNumberOfPlayers
    }

    let currentRound = this.state.player1.content.filter(content => content !== '').length + 1
    // let drawOrText = this.state.currentRound.allPlayers
    let drawOrText = 'draw'
    if (currentRound === 1 || currentRound === 3) {
      drawOrText = 'draw'
    } else if (currentRound === 2 || currentRound === 4) {
      drawOrText = 'text'
    }
    let currentImageOrText = this.state.currentRound.byPlayerView[this.state.currentPlayerNum - 1]

    console.log('CURRENT ROUND: ', currentRound, 'DRAW OR TEXT: ', drawOrText)

    if (readyToPlay && currentRound !== 5) {
      if (drawOrText === 'draw' ) {
        return (
          <div className="no-scroll">

            <Navbar />
            <img className="background-image" src='/images/sheep.png' />

              <div className="inline-row" id="singleGameView">

                { (currentRound === 1) ? <div /> : (
                  currentImageOrText.includes('data:image') ? (
                    <img className="previousPlayerContent left-margin right-margin" src={currentImageOrText} />
                  ) : (<h1 className="mediumTitle previousPlayerContent left-margin right-margin text-content">{currentImageOrText}</h1>)
                )
                }

                <DrawingCanvas
                  playerNum={this.state.currentPlayerNum}
                  gameId={this.state.gameId}
                  firebaseKey={this.state.firebaseKey}
                  currentRoundNum={this.state.player1.content.filter(content => content !== '').length + 1} />

              </div>

          </div>
        )
      } else {
        return (
          <div className="no-scroll">

            <Navbar />
            <img className="background-image" src='/images/sheep.png' />

            <div className="inline-row" id="singleGameView2">

            { (currentRound === 1) ? <div /> : (
              currentImageOrText.includes('data:image') ? (
                <img className="previousPlayerContent left-margin right-margin" src={currentImageOrText} />
              ) : (<h1 className="mediumTitle previousPlayerContent left-margin right-margin text-content">{currentImageOrText}</h1>)
            )
            }

                <TextCanvas
                  playerNum={this.state.currentPlayerNum}
                  gameId={this.state.gameId}
                  firebaseKey={this.state.firebaseKey}
                  currentRoundNum={this.state.player1.content.filter(content => content !== '').length + 1} />
            </div>

          </div>
        )
      }
    } else if (currentRound === 5) {
      return (
        <GameResults
          gameId={this.state.gameId} />
      )
    } else if (this.state.firebaseKey === 0) {
      return (
        <div />
      )
    } else {
      return (
        <div className="no-scroll">
          <Navbar />
          <img className="background-image" src='/images/sheep.png' />
          <div className="home-content mediumTitle">
            <ul>
              <li>You currently have <span className="bold-bright">{currentNumberOfPlayers}</span> player(s) in the game.</li>
              <li>You need <span className="bold-bright">{numberNeededToPlay}</span> more player(s) to join the game to begin.</li>
              <li>Players should use code <span className="bold-bright">{this.state.gameId}</span> to join this game.</li>
            </ul>
          </div>
        </div>
      )
    }

  }
}

export default SingleGame;
