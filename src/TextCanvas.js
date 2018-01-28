import React, { Component } from 'react';
import { render } from 'react-dom';
import firebase from './firebase'


class TextCanvas extends Component {

  constructor() {
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
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onload = this.onload.bind(this)
  }

  getGameDetails() {
    const gamesRef = firebase.database().ref('games');
    let firebaseKey = 0, player1 = {}, player2 = {}, player3 = {}, player4 = {}, status = '', currentRound = {}
    let gameId = +this.props.gameId
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
            firebaseKey, gameId, player1, player2, player3, player4, status, currentRound
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
    let text = event.target.textVal.value ? event.target.textVal.value : 'no text'
    let currentRoundNum = this.props.currentRoundNum
    let currentPlayer = 'player' + this.props.playerNum

    let roundsObj = {
      1: {
        contentType: 'image1',
        screenToGrabFrom: {
          player1: 'player1',
          player2: 'player2',
          player3: 'player3',
          player4: 'player4'
        }
      },
      2: {
        contentType: 'text1',
        screenToGrabFrom: {
          player1: 'player4', // example: player1's drawing text will be on player2's screen
          player2: 'player1',
          player3: 'player2',
          player4: 'player3'
        }
      },
      3: {
        contentType: 'image2',
        screenToGrabFrom: {
          player1: 'player3',
          player2: 'player4',
          player3: 'player1',
          player4: 'player2'
        }
      },
      4: {
        contentType: 'text2',
        screenToGrabFrom: {
          player1: 'player2',
          player2: 'player3',
          player3: 'player4',
          player4: 'player1'
        }
      }
    }


    const gamesRef = firebase.database().ref('games')

    // add image to player's object
    let urlContentType = roundsObj[currentRoundNum].contentType
    let playerToUpdate = roundsObj[currentRoundNum].screenToGrabFrom[currentPlayer]
    gamesRef.child(`/${this.props.firebaseKey}/${playerToUpdate}/${urlContentType}`).set(text)

    // update view to show drawing canvas for next round
    gamesRef.child(`/${this.props.firebaseKey}/currentRound/allPlayers`).set('draw')

    // update the current round player values
    let endOfRoundViewObj = {
      1: {
        player1: 'player2',
        player2: 'player3',
        player3: 'player4',
        player4: 'player1'
      },
      2: {
        player1: 'player2',
        player2: 'player3',
        player3: 'player4',
        player4: 'player1'
      },
      3: {
        player1: 'player2',
        player2: 'player3',
        player3: 'player4',
        player4: 'player1'
      },
    }

    if (currentRoundNum === 4) {
      for (var i = 1; i <= 4; i++) {
        gamesRef.child(`/${this.props.firebaseKey}/currentRound/player${i}`).set('')
      }
    } else {
      gamesRef.child(`/${this.props.firebaseKey}/currentRound/${endOfRoundViewObj[currentRoundNum][currentPlayer]}`).set(text)
    }
  }

  onload() {
    let element = document.getElementById('textCanvasForm')
    let submitEvent = new Event('submit')
    if (element) {
      setTimeout(function() { element.dispatchEvent(submitEvent) }, 15000)
    }
  }

  render() {
    let currentPlayerName = this.state[`player${this.props.playerNum}`].name
    return (
      <div>
        <h1 className="mediumTitle left-margin singleGameHeading">{currentPlayerName} - Round No {this.props.currentRoundNum} - Go!</h1>
        <form onSubmit={this.handleSubmit} id="textCanvasForm" >
          <input className="ui input" id="textCanvasInput" name="textVal" placeholder="Enter text here" />
        </form>
        <script type="text/javascript">
          {
            this.onload()
          }
        </script>
      </div>
    )
  }
}

export default TextCanvas
