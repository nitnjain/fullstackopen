const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method)
  logger.info('Path  : ', req.path)
  logger.info('Body  : ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'endpoint not found' })
}

const errorHandler = (error, req, res, next) => {
  if(error.name === 'CastError') {
    return res.status(400).json({ error: 'bad formmated id' })
  } else if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if(error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else {
    return res.status(400).json({ error: error.name })
  }
}

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if(auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
  }

  next()
}

const userExtractor = async (req, res, next) => {
  if(req.token !== undefined) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if(!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)
    req.user = user
  }
  next()
}

module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor }