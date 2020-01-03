const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  userId: String,
  title: String,
  completed: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('todo', todoSchema)