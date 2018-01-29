
exports.valSignup = (req,res,next) =>{
	req.sanitizeBody('name')
	req.checkBody('name', 'please enter a name').notEmpty()
	req.checkBody('email', 'please enter your email').isEmail()
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	})
	req.checkBody('password', 'please enter a password').notEmpty()
	let errors = req.validationErrors()
	if(errors){
		res.json({message: errors.reduce((prev, err)=> { return prev + ' ' +  err.msg }, '')})
	}else{
		next()
	}
}
exports.valLogin = (req,res,next) =>{
	req.checkBody('email', 'please enter your email').isEmail()
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	})
	req.checkBody('password', 'please enter a password').notEmpty()
	let errors = req.validationErrors()
	if(errors){
		res.json({message: errors.reduce((prev, err)=> { return prev + ' ' +  err.msg }, '')})
	}else{
		next()
	}
}
exports.valTOdo = (req,res,next) =>{
	req.sanitizeBody('text')
	req.checkBody('text', 'please enter a text').notEmpty()
	let errors = req.validationErrors()
	if(errors){
		res.json({message: errors.reduce((prev, err)=> { return prev + ' ' +  err.msg }, '')})
	}else{
		next()
	}
}