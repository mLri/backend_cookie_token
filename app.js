const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()

/* midleware */
app.use(express.json())

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

app.listen(3000, () => console.log(`server up and running on port ${process.env.PORT}`))
