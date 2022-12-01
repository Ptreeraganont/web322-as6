const express = require('express')
const authService = require('../data-service-auth.js')
const { ensureLogin } = require('../middleware/index.js')

const router = express.Router()

router.get('/login', (req, res) => {
	res.render('login')
})

router.get('/register', (req, res) => {
	res.render('register')
})

router.post('/register', (req, res) => {
	authService
		.registerUser(req.body)
		.then(() => {
			res.render('register', { successMessage: 'User created' })
		})
		.catch((err) => {
			res.render('register', { errorMessage: err, userName: req.body.userName })
		})
})

router.post('/login', (req, res) => {
	req.body.userAgent = req.get('User-Agent');
	authService
		.checkUser(req.body)
		.then((user) => {
			req.session.user = {
				userName: user.userName,// authenticated user's userName
				email: user.email, // authenticated user's email
				loginHistory: user.loginHistory// authenticated user's loginHistory
			}
		
			res.redirect('/students');
		})
		.catch((err) => {
			res.render('login', { errorMessage: err, userName: req.body.userName })
		})
})

router.get('/logout', (req, res) => {
	req.session.reset();
	res.redirect('/');
})

router.get('/userHistory', ensureLogin, (req, res) => {
	res.render('userHistory')
})

module.exports = router
