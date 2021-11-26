const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
  const body = req.body

  if(body.password.length < 3) {
    return res.status(400).json({ error: 'bad password length' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, likes: 1, url: 1})
  res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('blogs', { title: 1, author: 1, likes: 1, url: 1})
  res.json(user)
})

module.exports = usersRouter