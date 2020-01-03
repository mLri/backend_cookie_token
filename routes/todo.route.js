const router = require('express').Router()
const todoController = require('../controllers/todo.controller')

/* include authorization */
const authorization = require('../global_function/token')

/* include libary validate data */
const { validateBody } = require('../validation/validation')
const { schemasTodo } = require('../validation/schema/todo.validate')

router.get('/',
  authorization.auth,
  todoController.showTodos)

router.post('/add',
  authorization.auth,
  validateBody(schemasTodo.add),
  todoController.addTodo)

router.put('/update',
  authorization.auth,
  todoController.updateTodo)

router.put('/complete',
  authorization.auth,
  todoController.completeTodo)

router.delete('/delete/:id',
  authorization.auth,
  todoController.deleteTodo)

router.get('/limit/:limit',
  authorization.auth,
  todoController.filter)

// router.post('/signup',
//   validateBody(schemasUser.signup),
//   userController.signup)

// router.get('/account',
//   authorization.auth,
//   userController.getMyUser)

// router.post('/logout',
//   userController.logout)

// router.post('/refresh_token',
//   userController.getRefreshToken)

module.exports = router