const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/people')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('./build'))

//Morgan request logger
morgan.token('content', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (req, res) => {
	Person.find({})
		.then(results => {
			res.json(results)
		})
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body

	if(!body.name || !body.number) {
		return res.status(400).json({
			error: 'Name or number missing'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save()
		.then(result => {
			console.log('sucess')
			res.json(result)
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body

	const person = {
		number: body.number
	}

	Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
		.then(updatedNote => {
			res.json(updatedNote)
		})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	Person.findById(id)
		.then(result => {
			res.json(result)
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).send()
		})
		.catch(error => next(error))
})

app.get('/info', (req, res) => {
	Person.countDocuments({})
		.then(count => {
			res.send(`Phonebook contains ${count} persons. </br>
			${new Date().toString()}`)
		})
})

const errorHandler = (error, req, res) => {
	if(error.name === 'CastError') {
		res.status(400).send({ error: 'bad formatted id' })
	} else if(error.name === 'ValidationError') {
		res.status(400).send({ error: error.message })
	}
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on localhost:${PORT}`)
})