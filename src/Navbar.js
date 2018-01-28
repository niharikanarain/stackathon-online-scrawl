import React from 'react'
import { Link } from 'react-router-dom'


function Navbar(props) {
  return (
    <div id="navbar" className="ui menu">
      <Link to="/"><h1 className="mediumFlavorsTitle item" id="no-padding">Doodlee</h1></Link>
      <div className="right menu">
        {
          props.toggleInstructionsOff ? null : <Link to="/instructions" className="right-margin"><button className="ui teal button button-style">Instructions</button></Link>
        }
        <Link to="/" className="right-margin"><button className="ui teal button button-style">Home</button></Link>
      </div>
  </div>
  )
}

export default Navbar
