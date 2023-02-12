const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cors = require('cors')
const authController = require('./controllers/authController')
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const commentController = require('./controllers/commentController')
const uploadController = require('./controllers/uploadController')
const app = express()

// connect database
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, () => console.log('DB is connected successfully'))
app.use('/images', express.static('public/images'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', authController)
app.use('/user', userController)
app.use('/post', postController)
app.use('/comment', commentController)
app.use('/upload', uploadController)


// connect backend app
app.listen(process.env.PORT, () => console.log('Server is connected successfully'))