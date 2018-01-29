const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
let UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
	}
})
UserSchema.pre('save', function(next){
	let user = this
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {
				return next(err)
			}
			user.password = hash
			next()
		})
	})
})
const User = mongoose.model('User', UserSchema)
module.exports = User