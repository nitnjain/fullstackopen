const jwt = require('jsonwebtoken')
const User = require('../models/user')
const loginRouter = require('express').Router()
const bcrypt = require('bcryptjs')

loginRouter.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({ username: body.username })

  const passwordMatch = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

  if(!(user && passwordMatch)) {
    res.status(401).json({ error: 'invalid username or password' })
  }
  
  const tokenData = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(tokenData, process.env.SECRET)
  
  res.json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter