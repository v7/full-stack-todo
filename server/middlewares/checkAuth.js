const EV = require('./../config/ev')
const jwt = require('jsonwebtoken')

function checkAuth(req, res, next) {
	const token = req.headers['authorization']
	if(token) {

		req.token = token
		jwt.verify(req.token,EV.SECRET, (err, data) => {
			if(err) {
				res.json({message: 'please login again'})
			} else {
				req.user = data
				next()
			}
		})
	} else {
		res.json({message: 'please login'})
	}
}

module.exports = checkAuth