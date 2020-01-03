const Todo = require('../models/todo.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { verify } = require('jsonwebtoken')
const { createAccessToken, createRefreshToken } = require('../global_function/token')

module.exports.addTodo = async (req, res) => {
  
  const { userId, title, completed } = req.body
  /* checking if title is already in database */
  const titleExist = await Todo.findOne({ title })
  if(titleExist) return res.status(400).json({ error: true, message: 'Title already exists!' })

  /* create new todo */
  const newTodo = new Todo({
    userId,
    title,
    completed
  })

  try {
    const saveTodo = await newTodo.save()
    res.status(200).json(saveTodo)
  } catch (err) {
    res.status(400).send(err)
  }

}

module.exports.showTodos = async (req, res) => {
  try {
    const todos = await Todo.find()
    res.status(200).json(todos)
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports.deleteTodo = async (req, res) => {
  const { id } = req.params
  if(!id || id === 'undefined') return res.status(400).json({ error: true, message: 'have no parameter!' })
  /* delete todo */
  const deleteTodo = await Todo.findOneAndDelete({ _id: id })
  if(!deleteTodo) res.status(400).json({ error: true, message: 'can not delete todo by id ' + id})
  res.status(200).json(deleteTodo)
}

module.exports.updateTodo = async (req, res) => {
  const { _id } = req.body
  /* find todo by id */
  const todoExist = await Todo.findOne({ _id })
  if(!todoExist) return res.status(400).json({ error: true, message: 'have not todo by _id' })
  /* update todo */
  const updateTodo = await Todo.updateOne({ _id }, {...req.body})
  res.status(200).json(updateTodo)
}

module.exports.completeTodo = async (req, res) => {
  const { _id } = req.body
  /* find todo */
  const todoExist = await Todo.findOne({ _id })
  if(!todoExist) return res.status(400).json({ error: true, message: 'not found todo!' })
  /* update complete todo */
  const completeTodo = await Todo.updateOne({ _id }, { completed: true })
  res.status(200).json(completeTodo)
}

module.exports.filter = async (req, res) => {
  const { limit } = req.params
  const todoLimit = await Todo.find().limit(parseInt(limit))
  res.status(200).json(todoLimit)
}