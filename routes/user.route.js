const router = require('express').Router()
const userController = require('../controllers/user.controller')

/* include authorization */
const authorization = require('../global_function/token')

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

router.post('/logout',
  userController.logout)

router.post('/refresh_token',
  userController.getRefreshToken)

module.exports = router