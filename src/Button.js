import React, { Component } from 'react'

export default class Button extends Component {
  render() {
    return (
     <React.Fragment>
        {this.props.isLoggedIn ? 
          <button onClick={this.props.handleLogout}>Logout</button> :
          <button onClick={this.props.handleLogin}>Login with Google</button>
        }
      </React.Fragment>
    )
  }
}
