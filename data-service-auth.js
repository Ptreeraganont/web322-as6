const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

/**
 * @type {Schema}
 */
const userSchema = new Schema({
	userName: {
		type: String,
		unique: true,
	},
	password: String,
	email: String,
	loginHistory: [{
		dateTime: Date,
		userAgent: String,
	}]
})

/**
 * @type {mongoose.Model}
 */
let User;

const initialize = () => new Promise((resolve, reject) => {
	let db = mongoose.createConnection("mongodb+srv://ptreeraganont:Pt15031981@senecaweb.ql5vzig.mongodb.net/test");

	db.on('error', (err) => {
		reject(err); // reject the promise with the provided error
	});

	db.once('open', () => {
		User = db.model("users", userSchema);
		console.log('connect mongodb successfully')
		resolve();
	});
})

const registerUser = (userData) => new Promise(async (resolve, reject) => {
	const { password, password2 } = userData
	if (password !== password2) {
		reject('Passwords do not match');
	}

	bcrypt
		.genSalt(10)
		.then(salt => bcrypt.hash(password, salt))
		.then(hash => {
			userData.password = hash;

			/**
			 * @type {mongoose.Document}
			 */
			let newUser = new User(userData);

			newUser.save()
				.then(() => resolve())
				.catch((err) => {
					if (err.code === 11000) {
						reject();
					} else {
						reject('There was an error creating the user: ' + err);
					}
				})
		})
		.catch(() => {
			reject('There was an error encrypting the password')
		});
		

	
})

const checkUser = (userData) => new Promise(async (resolve, reject) => {
	User
		.find({ userName: userData.userName })
		.exec()
		.then((users) => {
			if (users.length === 0) {
				reject('Unable to find user: ' + userData.userName)
			} else {
				bcrypt
					.compare(userData.password, users[0].password)
					.then((result) => {
						if (result === false) {
							reject('Incorrect Password for user: ' + userData.userName)
						}
					})
				users[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent })

				User
					.updateOne({ 
						userName: users[0].userName 
					}, { 
						$set: {
							loginHistory: users[0].loginHistory
						}
					})
					.exec()
					.then(() => {
						resolve(users[0])
					})
					.catch((err) => reject('There was an error verifying the user: ' + err))
			}
		})
		.catch(() => {
			reject('Unable to find user: ' + userData.userName)
		})
})




module.exports = {
	initialize,
	registerUser,
	checkUser,
}
