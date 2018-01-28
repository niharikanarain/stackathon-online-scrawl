import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function Instructions() {
  return (
    <div className="no-scroll">
      <Navbar toggleInstructionsOff={true} />
      <img className="background-image" src='/images/sheep.png' />
      <div className="home-content smallTitle">
        <h2 className="bigMediumTitle">Instructions</h2>
        <div id="add-margins2">
          <li>You need exactly 4 players to play this game</li>
          <li>Each player will start out by drawing something of their choice within the given time</li>
          <li>Once the timer is up, their drawing will be sent to the next player's screen, and they will see the previous player's drawing on their screen</li>
          <li>They will have to guess in words what that drawing represents within the given time</li>
          <li>These words will be sent to the next player in the rotation who will make a drawing of them, and pass it on for the last player to describe in words</li>
          <li>At the end of the game, each player will get to see what their drawing led to and share it with the other!</li>
        </div>
      </div>
    </div>
  )
}

export default Instructions
