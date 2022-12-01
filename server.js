/*********************************************************************************
 * WEB322 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Pusit Treeraganont Student ID: 146566211 Date: 30/11/2022
 *
 * Online (Cyclic) Link: https://real-cow-jumpsuit.cyclic.app
 *
 ********************************************************************************/

const express = require('express')
const path = require('path')

const exphbs = require('express-handlebars')
const clientSessions = require('client-sessions')

const authService = require('./data-service-auth.js')
const dataService = require('./data-service.js')

const authRoutes = require('./routes/auth.routes.js')
const studentRoutes = require('./routes/student.routes.js')
const imageRoutes = require('./routes/image.routes.js')
const programRoutes = require('./routes/program.routes.js')

const app = express()

const PORT = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'hbs')

app.engine(
	'hbs',
	exphbs.engine({
		extname: 'hbs',
		defaultLayout: 'main',
		helpers: {
			navLink: function (url, options) {
				return (
					'<li' +
					(url == app.locals.activeRoute ? ' class="active" ' : '') +
					'><a href="' +
					url +
					'">' +
					options.fn(this) +
					'</a></li>'
				)
			},
			equal: function (lvalue, rvalue, options) {
				if (arguments.length < 3)
					throw new Error('Handlebars Helper equal needs 2 parameters')
				if (lvalue != rvalue) {
					return options.inverse(this)
				} else {
					return options.fn(this)
				}
			},
		},
	})
)

app.use(clientSessions({
	cookieName: 'session',
	secret: 'web322secret',
	duration: 2 * 60 * 1000,
	activeDuration: 1000 * 60
}))

app.use((req, res, next) => {
	let route = req.baseUrl + req.path
	app.locals.activeRoute = route == '/' ? '/' : route.replace(/\/$/, '')
	res.locals.session = req.session;
	next()
})

app.get('/', (_, res) => {
	res.render('home')
})

app.get('/about', (_, res) => {
	res.render('about')
})

app.use('/', authRoutes)
app.use('/', studentRoutes)
app.use('/', imageRoutes)
app.use('/', programRoutes)

app.get('*', (_, res) => {
	res.status(404).send('Page Not Found')
})

dataService
	.initialize()
	.then(authService.initialize)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Express http server listening on ${PORT}`)
		})
	})
	.catch((err) => {
		console.log(err)
	})
