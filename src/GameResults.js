import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from './firebase'
import Navbar from './Navbar'

class GameResults extends Component {

  constructor() {
    super()
    this.state = {
      gameId: 0,
      player1: {
        name: '',
        content: [],
        showingContent: true
      },
      player2: {
        name: '',
        content: [],
        showingContent: true
      },
      player3: {
        name: '',
        content: [],
        showingContent: true
      },
      player4: {
        name: '',
        content: [],
        showingContent: true
      },
      currentPlayer: ''
    }
    this.getGameDetails = this.getGameDetails.bind(this)
    this.getPlayerGameResults = this.getPlayerGameResults.bind(this)
  }

  getGameDetails() {
    const gamesRef = firebase.database().ref('games');
    let player1 = {}, player2 = {}, player3 = {}, player4 = {}
    let gameId = +this.props.gameId
    gamesRef.on('value', (snapshot) => {
      let games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === gameId) {
          player1 = {
            name: games[game].player1.name,
            content: [games[game].player1.image1, games[game].player1.text1, games[game].player1.image2, games[game].player1.text2],
            showingContent: true
          }
          player2 = {
            name: games[game].player2.name,
            content: [games[game].player2.image1, games[game].player2.text1, games[game].player2.image2, games[game].player2.text2],
            showingContent: true
          }
          player3 = {
            name: games[game].player3.name,
            content: [games[game].player3.image1, games[game].player3.text1, games[game].player3.image2, games[game].player3.text2],
            showingContent: true
          }
          player4 = {
            name: games[game].player4.name,
            content: [games[game].player4.image1, games[game].player4.text1, games[game].player4.image2, games[game].player4.text2],
            showingContent: true
          }
          this.setState({
            gameId, player1, player2, player3, player4
          })
        }
      }
    })
  }

  componentDidMount() {
    this.getGameDetails()
  }

  getPlayerGameResults(event) {
    event.preventDefault()
    let player = event.target.value
    this.setState({
      currentPlayer: player
    })
    let element = document.getElementById('playerGameResults')
    element.className = element.className === "noShow" ? "show" : "noShow"
    // let playerContentArray = this.state[player].content
    // let currentShowingContent = this.state[player].showingContent
    // let playerContent = this.state[player].content
    // let playerName = this.state[player].name
    // let html = ''
    // if (currentShowingContent) {
    //   html = playerContentArray.map(content =>
    //     content.includes('data:image') ? `<img src=${content} style={{ width: 100 }} className="gameResultContent" /> `: `<h1 className="gameResultContent">${content}</h1>`
    //   )
    // }
    // element.innerHTML = html
    // this.setState({
    //   [player]: {
    //     name: playerName,
    //     content: playerContent,
    //     showingContent: !currentShowingContent
    //   }
    // })
  }

  render() {
    return (
      <div className="no-scroll">
        <Navbar />
        <img className="background-image" src="/images/sheep.png" />
        <div className="home-content mediumTitle">
          <h2 className="mediumTitle">All rounds have been completed</h2>
          <h2 className="mediumTitle">Click on player to see what their drawing led to!</h2>
          <div className="inline-row top-margin">
            { this.state.gameId !== 0 &&
              Object.keys(this.state).filter(key => (key !== 'gameId' && key !== 'currentPlayer')).map(player => (
                <button key={player} onClick={this.getPlayerGameResults} value={player} className="ui purple button button-style" id="add-margins">{this.state[player].name}</button>
              ))
            }
          </div>
          <div id="playerGameResults" className="noShow">
            {
              this.state.currentPlayer !== '' &&
              <div className="playerGameResultsClass">
                {
                  this.state[this.state.currentPlayer].content[0] === 'no image' ? <h1 className="gameResultContent text-content">no image</h1> : <img src={this.state[this.state.currentPlayer].content[0]} className="gameResultContent" id="image1" />
                }
                <h1 className="gameResultContent text-content">{this.state[this.state.currentPlayer].content[1]}</h1>
                {
                  this.state[this.state.currentPlayer].content[2] === 'no image' ? <h1 className="gameResultContent text-content">no image</h1> : <img src={this.state[this.state.currentPlayer].content[2]} className="gameResultContent" id="image2" />
                }
                <h1 className="gameResultContent text-content">{this.state[this.state.currentPlayer].content[3]}</h1>
              </div>
            }
          </div>

        </div>
      </div>
    )
  }
}

export default GameResults
