const express = require('express')
const fs = require('fs')
const multer = require('multer')
const { ensureLogin } = require('../middleware/index.js')

const router = express.Router()

router.use('/', ensureLogin)

const storage = multer.diskStorage({
	destination: './public/images/uploaded',
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
	},
})

const upload = multer({ storage: storage })

router.get('/images/add', (_, res) => {
	res.render('addImage')
})

router.post('/images/add', upload.single('imageFile'), (_, res) => {
	res.redirect('/images')
})

router.get('/images', (_, res) => {
	const images = []
	fs.readdir('./public/images/uploaded', function (err, items) {
		images.push(...items)
		res.render('images', { images })
	})
})

module.exports = router
