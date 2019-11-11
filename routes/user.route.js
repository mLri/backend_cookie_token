const router = require('express').Router()
const userController = require('../controllers/user.controller')

/* include authorization */
const authorization = require('../global_function/verifyToken')

/* include libary validate data */
const { validateBody } = require('../validation/validation')
const { schemasUser } = require('../validation/schema/user.validate')

router.post('/signin',
  validateBody(schemasUser.signin),
  userController.signin)

router.post('/signup',
  validateBody(schemasUser.signup),
  userController.signup)

router.get('/account',
  authorization.auth,
  userController.getMyUser)

module.exports = router