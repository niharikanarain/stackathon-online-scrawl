import React, { Component } from 'react';
import { render } from 'react-dom';
import firebase from './firebase'
import { clearInterval } from 'timers';

class DrawingCanvas extends Component {

  constructor() {
    super()
    this.state = {
      paint: false,
      clickX: [],
      clickY: [],
      clickDrag: [],
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
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.addClick = this.addClick.bind(this)
    this.redraw = this.redraw.bind(this)
    this.clearCanvas = this.clearCanvas.bind(this)
    this.saveImage = this.saveImage.bind(this)
    this.getGameDetails = this.getGameDetails.bind(this)
    this.isCanvasBlank = this.isCanvasBlank.bind(this)
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

  handleMouseDown(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    this.setState({
      paint: true
    })
    this.addClick(mouseX, mouseY);
    this.redraw();
  }

  handleMouseMove(e) {
    let canvas = document.getElementById('canvasDiv')
    if (this.state.paint){
      this.addClick(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
      this.redraw();
    }
  }

  handleMouseUp(e) {
    this.setState({
      paint: false
    })
  }

  handleMouseLeave(e) {
    this.setState({
      paint: false
    })
  }

  addClick(x, y, dragging) {
    let curClickX = this.state.clickX
    let curClickY = this.state.clickY
    let curClickDrag = this.state.clickDrag
    this.setState({
      clickX: [...curClickX, x],
      clickY: [...curClickY, y],
      clickDrag: [...curClickDrag, dragging]
    })
  }

  redraw() {
    let canvas = document.getElementById('canvasDiv')
    let context = canvas.getContext('2d')
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.strokeStyle = '#9370DB';
    context.lineJoin = 'round';
    context.lineWidth = 5;
    for (var i = 0; i < this.state.clickX.length; i++) {
      context.beginPath();
      if (this.state.clickDrag[i] && i){
        context.moveTo(this.state.clickX[i - 1], this.state.clickY[i - 1]);
       } else {
         context.moveTo(this.state.clickX[i] - 1, this.state.clickY[i]);
       }
       context.lineTo(this.state.clickX[i], this.state.clickY[i]);
       context.closePath();
       context.stroke();
    }
  }

  clearCanvas() {
    let canvas = document.getElementById('canvasDiv')
    let context = canvas.getContext('2d')
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    this.setState({
      paint: false,
      clickX: [],
      clickY: [],
      clickDrag: []
    })
  }

  isCanvasBlank(canvas) {
    var blank = document.createElement('canvas');
    blank.className="canvasClass"
    if (canvas) {
      blank.width = canvas.width;
      blank.height = canvas.height;
      return canvas.toDataURL() === blank.toDataURL();
    }
  }

  saveImage() {
    let canvas = document.getElementById('canvasDiv')
    if (canvas) {
      let image = this.isCanvasBlank(canvas) ? 'no image' : canvas.toDataURL('image/png')
      let currentRoundNum = this.props.currentRoundNum
      console.log('CURRENT ROUND NUM: ', currentRoundNum, 'CURRENT CANVAS BLANK? :', this.isCanvasBlank(canvas), '---------')
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
      console.log('CURRENT ROUND NUM: ', currentRoundNum, 'URL CONTENT TYPE :', urlContentType, 'PLAYER TO UPDATE: ', playerToUpdate)
      gamesRef.child(`/${this.props.firebaseKey}/${playerToUpdate}/${urlContentType}`).set(image)

      // update view to show text canvas for next round
      gamesRef.child(`/${this.props.firebaseKey}/currentRound/allPlayers`).set('text')

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
        gamesRef.child(`/${this.props.firebaseKey}/currentRound/${endOfRoundViewObj[currentRoundNum][currentPlayer]}`).set(image)
      }
    }
  }

  onload() {
    setTimeout(this.saveImage, 15000)
  }

  render() {
    let currentPlayerName = this.state[`player${this.props.playerNum}`].name
    return (
      <div>
        <h1 className="mediumTitle left-margin singleGameHeading">{currentPlayerName} - Round No {this.props.currentRoundNum} - Go!</h1>
        <h1 className="mediumTittle" id="countdown" />
        <div className="inline-column left-margin">
          <canvas
              id="canvasDiv"
              width="400"
              height="400"
              className="canvasClass"
              onMouseDown={this.handleMouseDown}
              onMouseMove={this.handleMouseMove}
              onMouseUp={this.handleMouseUp}
              onMouseLeave={this.handleMouseLeave} />
            <button className="ui purple button" id="button-style" onClick={this.clearCanvas}>Clear</button>
        </div>
        <script>
          {
            this.onload()
          }
        </script>
      </div>
    )
  }
}

export default DrawingCanvas
