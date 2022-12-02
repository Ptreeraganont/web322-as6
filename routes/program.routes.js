const express = require('express')
const dataService = require('../data-service.js')
const { ensureLogin } = require('../middleware/index.js')

const router = express.Router()

router.use('/', ensureLogin)

router.get('/programs', (_, res) => {
	dataService
		.getPrograms()
		.then((data) => {
			if (data.length > 0) {
				res.render('programs', { programs: data })
			} else {
				res.render('programs', { programs: [] })
			}
		})
		.catch((err) => {
			res.json({ message: err })
		})
})

router.get('/programs/add', (_, res) => {
	res.render('addProgram')
})

router.post('/programs/add', (req, res) => {
	dataService
		.addProgram(req.body)
		.then(() => {
			res.redirect('/programs')
		})
		.catch((err) => {
			res.json({ message: err })
		})
})

router.post('/programs/update', (req, res) => {
	dataService
		.updateProgram(req.body)
		.then(() => {
			res.redirect('/programs')
		})
		.catch((err) => {
			res.json({ message: err })
		})
})

router.get('/program/:programCode', (_, res) => {
	const { programCode } = req.params
	dataService
		.getProgramByCode(programCode)
		.then((data) => {
			if (data) {
				res.render('program', { program: data })
			} else {
				res.status(404).send('Program Not Found')
			}
		})
		.catch(() => {
			res.status(404).send('Program Not Found')
		})
})

router.get('/programs/delete/:programCode', (req, res) => {
	const { programCode } = req.params
	dataService
		.deleteProgramByCode(programCode)
		.then((data) => {
			if (data) {
				res.render('programs', { program: data })
			} else {
				res.status(404).send('Unable to Remove Program / Program not found)')
			}
		})
		.catch(() => {
			res.status(500).send('Unable to Remove Program / Program not found)')
		})
})

module.exports = router
