const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGO_URI

mongoose.connect(url)
	.then(result => {
		console.log('Connected to mongodb')
		return result
	})
	.catch(e => {
		console.log('Connection error: ', e.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		unique: true
	},
	number: {
		type: String,
		required: true,
		minlength: 8
	}
})
personSchema.plugin(uniqueValidator)
	
personSchema.set('toJSON', {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id
		delete returnedObj._id
		delete returnedObj.__v
	}
})

module.exports = mongoose.model('Person', personSchema)