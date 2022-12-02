const express = require('express')
const dataService = require('../data-service.js')
const { ensureLogin } = require('../middleware/index.js')

const router = express.Router()

router.use('/', ensureLogin)

router.get('/students', (req, res) => {
	const { status, program, credential } = req.query
	if (status !== undefined) {
		dataService
			.getStudentsByStatus(status)
			.then((data) => {
				if (data.length > 0) {
					res.render('students', { students: data })
				} else {
					res.render('students', { message: 'no results' })
				}
			})
			.catch(() => {
				res.render('students', { message: 'no results' })
			})
	} else if (program !== undefined) {
		dataService
			.getStudentsByProgramCode(program)
			.then((data) => {
				if (data.length > 0) {
					res.render('students', { students: data })
				} else {
					res.render('students', { message: 'no results' })
				}
			})
			.catch(() => {
				res.render('students', { message: 'no results' })
			})
	} else if (credential !== undefined) {
		dataService
			.getStudentsByExpectedCredential(credential)
			.then((data) => {
				if (data.length > 0) {
					res.render('students', { students: data })
				} else {
					res.render('students', { message: 'no results' })
				}
			})
			.catch(() => {
				res.render('students', { message: 'no results' })
			})
	} else {
		dataService
			.getAllStudents()
			.then((data) => {
				if (data.length > 0) {
					res.render('students', { students: data })
				} else {
					res.render('students', { message: 'no results' })
				}
			})
			.catch(() => {
				res.render('students', { message: 'no results' })
			})
	}
})

router.get('/student/:studentId', (req, res) => {
	const { studentId } = req.params
	let viewData = {}
	dataService
		.getStudentById(studentId)
		.then((data) => {
			if (data) {
				viewData.student = data
			} else {
				viewData.student = null
			}
		})
		.catch(() => {
			viewData.student = null
		})
		.then(dataService.getPrograms)
		.then((data) => {
			viewData.programs = data
			for (let i = 0; i < viewData.programs.length; i++) {
				if (viewData.programs[i].programCode == viewData.student.program) {
					viewData.programs[i].selected = true
				}
			}
		})
		.catch(() => {
			viewData.programs = []
		})
		.then(() => {
			if (viewData.student === null) {
				res.render('student', { message: 'no results' })
			} else {
				res.render('student', { viewData })
			}
		})
		.catch(() => {
			res.render('student', { message: 'Unable to Show Students' })
		})
})

router.get('/intlstudents', (_, res) => {
	dataService
		.getInternationalStudents()
		.then((data) => {
			res.render('students', { students: data })
		})
		.catch((err) => {
			res.json({ message: err })
		})
})

router.get('/students/add', (_, res) => {
	dataService
		.getPrograms()
		.then((data) => {
			res.render('addStudent', { programs: data })
		})
		.catch(() => {
			res.render('addStudent', { programs: [] })
		})
})

router.post('/students/add', (req, res) => {
	dataService
		.addStudent(req.body)
		.then(() => {
			res.redirect('/students')
		})
		.catch((err) => {
			res.json({ message: err })
		})
})

router.get('/students/delete/:studentID', (req, res) => {
	dataService
		.deleteStudentById(req.params.studentID)
		.then(() => {
			res.redirect('/students')
		})
		.catch(() => {
			res.status(500).send('Unable to Remove Student / Student not found)')
		})
})

router.post('/student/update', (req, res) => {
	dataService.updateStudent(req.body).then(() => {
		res.redirect('/students')
	})
})

module.exports = router
