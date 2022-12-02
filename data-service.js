const Sequelize = require('sequelize')

/**
 * @type {Sequelize.Sequelize}
 */
var sequelize = new Sequelize(
	'vtgipzfs',
	'vtgipzfs',
	'4vlhUac4XkSBiEgC9r-qc15J19x1uM8R',
	{
		host: 'peanut.db.elephantsql.com',
		dialect: 'postgres',
		port: 5432,
		dialectOptions: {
			ssl: { rejectUnauthorized: false },
		},
		query: { raw: true },
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
	}
)

const Student = sequelize.define('Student', {
	studentID: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	email: Sequelize.STRING,
	phone: Sequelize.STRING,
	addressStreet: Sequelize.STRING,
	addressCity: Sequelize.STRING,
	addressState: Sequelize.STRING,
	addressPostal: Sequelize.STRING,
	isInternationalStudent: Sequelize.BOOLEAN,
	expectedCredential: Sequelize.STRING,
	status: Sequelize.STRING,
	registrationDate: Sequelize.STRING,
})

const Program = sequelize.define('Program', {
	programCode: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	programName: Sequelize.STRING,
})

Program.hasMany(Student, { foreignKey: 'program' })

const initialize = () =>
	new Promise((resolve, reject) => {
		sequelize
			.authenticate()
			.then(function () {
				console.log('Connection has been established successfully.')
				resolve()
			})
			.catch(function (err) {
				console.error('Unable to connect to the database:' + err)
				reject()
			})
	})

const getAllStudents = () =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Student.findAll()
					.then((res) => resolve(res))
					.catch(() => reject('no results returned'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const getInternationalStudents = () =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Student.findAll({ where: { isInternationalStudent: true } })
					.then((res) => resolve(res))
					.catch(() => reject('no results returned'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const getPrograms = () =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Program.findAll()
					.then((res) => resolve(res))
					.catch(() => reject('no results returned'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const addStudent = (studentData) =>
	new Promise((resolve, reject) => {
		studentData.isInternationalStudent = studentData.isInternationalStudent
			? true
			: false
		for (key in studentData) {
			if (key === '') {
				studentData[key] = null
			}
		}
		sequelize
			.sync()
			.then(() => {
				Student.create(studentData)
					.then((res) => resolve(res))
					.catch(() => reject('unable to create student'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const getStudentsByStatus = (status) =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Student.findAll({ where: { status } })
					.then((res) => resolve(res))
					.catch(() => reject('no results returned'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const getStudentsByProgramCode = (programCode) =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Student.findAll({ where: { programCode } })
					.then((res) => resolve(res))
					.catch(() => reject('no results returned'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const getStudentsByExpectedCredential = (credential) =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Student.findAll({ where: { expectedCredential: credential } })
					.then((res) => resolve(res))
					.catch(() => reject('no results returned'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const getStudentById = (sid) =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Student.findAll({ where: { studentID: sid } })
					.then((res) => resolve(res[0]))
					.catch(() => reject('no results returned'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const updateStudent = (studentData) =>
	new Promise((resolve, reject) => {
		studentData.isInternationalStudent = studentData.isInternationalStudent
			? true
			: false
		for (key in studentData) {
			if (key === '') {
				studentData[key] = null
			}
		}
		sequelize
			.sync()
			.then(() => {
				Student.update(studentData, { where: { studentID: studentData.studentID } })
					.then((res) => resolve(res))
					.catch(() => reject('unable to update student'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const addProgram = (programData) =>
	new Promise((resolve, reject) => {
		for (key in programData) {
			if (key === '') {
				programData[key] = null
			}
		}
		sequelize
			.sync()
			.then(() => {
				Program.create(programData)
					.then((res) => resolve(res))
					.catch(() => reject('unable to create program'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const updateProgram = (programData) =>
	new Promise((resolve, reject) => {
		for (key in programData) {
			if (key === '') {
				programData[key] = null
			}
		}
		sequelize
			.sync()
			.then(() => {
				Program.update(programData)
					.then((res) => resolve(res))
					.catch(() => reject('unable to update program'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const getProgramByCode = (pcode) =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Program.findAll({ where: { programCode: pcode } })
					.then((res) => resolve(res[0]))
					.catch(() => reject('no results returned'))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const deleteProgramByCode = (pcode) =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Program.destroy({ where: { programCode: pcode } })
					.then(() => resolve('destroyed'))
					.catch((err) => reject(err))
			}).catch(() => {
				reject('failed to sync')
			})
	})

const deleteStudentById = (id) =>
	new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(() => {
				Student.destroy({ where: { studentID: id } })
					.then(() => resolve('destroyed'))
					.catch((err) => reject(err))
			}).catch(() => {
				reject('failed to sync')
			})
	})

module.exports = {
	initialize,
	getAllStudents,
	getInternationalStudents,
	getPrograms,
	addStudent,
	getStudentsByStatus,
	getStudentsByProgramCode,
	getStudentsByExpectedCredential,
	getStudentById,
	updateStudent,
	addProgram,
	updateProgram,
	getProgramByCode,
	deleteProgramByCode,
	deleteStudentById,
}
