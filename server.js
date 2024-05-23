require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://khizer:khizer786110@cluster0.ea7gtw9.mongodb.net/') 

app.set('view engine', 'ejs')
app.set('views', './views')

const port = process.env.SERVER_PORT || 3000

const userRouter = require('./routes/userRoutes')
const authRouter = require('./routes/authRoute')

app.use('/api', userRouter)
app.use('/', authRouter)

app.listen(port, () => {
    console.log(`Port listening at http://localhost:${port}`)
})