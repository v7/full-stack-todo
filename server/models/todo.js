const mongoose = require('mongoose')
const Schema = mongoose.Schema

let todoSchema = new Schema({
	createrID: String,
	text: {
		type: String,
		required: true,
		trim: true
	},
	status: Boolean
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo