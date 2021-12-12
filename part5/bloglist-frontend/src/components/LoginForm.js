import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => {
  return (
    <div>
      <h1>Login to blogs app</h1>
      <form onSubmit={handleLogin}>
        username: <input type="text" id="username" value={username} onChange={({ target }) => setUsername(target.value)} /><br />
        password: <input type="password" id="password" value={password} onChange={({ target }) => setPassword(target.value)} /><br />
        <button id='loginBtn' type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired
}

export default LoginForm