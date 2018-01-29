const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const expressValidator = require('express-validator')
const checkAuth = require('./middlewares/checkAuth')
const EV = require('./config/ev') // env variables
const TOdo = require('./models/todo')
const User = require('./models/user')
const {valLogin, valSignup, valTOdo} = require('./middlewares/validators')
const app = express()
const PORT = EV.PORT
mongoose.Promise = global.Promise // there is bug on mongoose promise so use the native one
mongoose.connect(EV.MONGO_URL)
app.use('/', express.static(path.join(__dirname , '../client/build'))) // serve the static files
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator()) // make validation methods to avalable on req

app.post('/auth/login', valLogin ,(req, res) => { // validate then take the info and see if its true & return token to the client
	let { email, password } = req.body
	User.findOne({ email }, (err, foundUser) => {
		if (err) {
			res.json({ message: 'something went worng please try again later' })
		}
		if (foundUser) {
			bcrypt.compare(password, foundUser.password).then(cryptRes => {
				if (cryptRes) {
					jwt.sign(
						{
							email: foundUser.email,
							name: foundUser.name,
							_id: foundUser._id
						},
						EV.SECRET,
						{ expiresIn: '1 days' },
						(err, token) => {
							res.json({
								token
							})
						}
					)
				} else {
					res.json({ message: 'worng password' })
				}
			})
		} else {
			res.json({
				message: 'you don\'t have account with this email signup please'
			})
		}
	})
})
app.post('/auth/signup',valSignup, (req, res) => { // validate input then save it to db then send token to the client
	let { name, email, password } = req.body
	let user = { email, name, password }
	User.findOne({ email }, (err, foundUser) => {
		if (err) {
			res.json({ message: 'something went worng please try again later' })
		}
		if (foundUser) {
			res.json({ message: 'you alrady have account please go to login page' })
		} else {
			User.create(user, (err, user) => {
				if (err) throw err
				bcrypt.compare(password, user.password).then(cryptRes => {
					if (cryptRes) {
						jwt.sign(
							{
								email: user.email,
								name: user.name,
								_id: user._id
							},
							EV.SECRET,
							{ expiresIn: '1 days' },
							(err, token) => {
								res.json({
									token
								})
							}
						)
					} else {
						res.json({
							message: 'something went worng please go to login page'
						})
					}
				})
			})
		}
	})
})
app.get('/auth/check', checkAuth, (req, res) => { // endpoit to validate the token and return the result to the client
	if (req.user) {
		res.json({ user: req.user })
	} else {
		res.json({ auth: false })
	}
})
app.get('/api/todos', checkAuth, (req, res) => {  // check auth then return all todos created by the user _id
	TOdo.find({ createrID: req.user._id }, (err, todos) => {
		res.json({ todos })
	})
})
app.post('/api/todos', checkAuth, valTOdo ,(req, res) => {  // check auth then create todo with the use _id
	let {text,status} = req.body
	TOdo.create(
		{ createrID: req.user._id, text, status },
		(err, added) => {
			if (err) {
				res.json({ message: 'something went worng please try again later' })
			}
			res.json({ todo: added })
		}
	)
})
app.post('/api/todos/:id', checkAuth, (req, res) => { // check auth then change todo status
	let id = req.params.id
	let status = req.body.status
	TOdo.update({ _id: id }, { $set: { status }}, (err, update)=>{
		if (err) {
			res.json({ update: false })
		}
		res.json({update: true})
	})
})

app.listen(PORT, () => {
	console.log('app is running at http://localhost:' + PORT)
})
