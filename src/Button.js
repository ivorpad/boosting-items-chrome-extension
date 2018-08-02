import React, { Component } from 'react'

export default class Button extends Component {
  render() {
    return (
     <React.Fragment>
        {this.props.isLoggedIn ? 
          <button className="logout" onClick={this.props.handleLogout}>Logout</button> :
          <button className="login" onClick={this.props.handleLogin}>Login with Google</button>
        }
      </React.Fragment>
    )
  }
}
