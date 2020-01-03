const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

require('dotenv').config()

const app = express()

/* midleware */
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mongoURI = `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`

mongoose
  .connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(err);
  });

/* midleware route */
app.use('/api/user', require('./routes/user.route'))
app.use('/api/todo', require('./routes/todo.route'))

app.listen(3000, () => console.log(`server up and running on port ${process.env.PORT}`))
