const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { verify } = require('jsonwebtoken')
const { createAccessToken, createRefreshToken } = require('../global_function/token')

module.exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  /* checking if user is already in database. */
  const userExist = await User.findOne({ email })
  if(userExist) return res.status(400).json({ error: true, message: 'Email already exists!' })

  /* hash password */
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)

  /* create new user */
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashPassword
  })

  try {
    const saveUser = await newUser.save()
    res.status(200).json(saveUser)
  } catch (err) {
    res.status(400).send(err)
  }
  
}

module.exports.signin = async (req, res) => {
  const { email, password } = req.body 
  console.log('email -> ', email)
  console.log('password -> ', password)

  /* checking user */
  const user = await User.findOne({ email })
  if(!user) return res.status(401).json({ error: true, message: 'user not found!' })

  /* checking password */
  const comparePassword = await bcrypt.compare(password, user.password)
  if(!comparePassword) return res.status(401).json({ error: true, message: 'password was wrong!' })

  /* genarate access token */
  const accessToken = createAccessToken({ userId: user._id })

  /* genarate refresh token */
  const refreshToken = createRefreshToken({ userId: user._id })

  /* save refresh token to DB */
  user.refreshToken = refreshToken
  user.save()

  /* send refresh token back */
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    // path: '/api/user/refresh_token',
  })

  /* send access token back */
  res.send({
    accessToken,
    email,
    userId: user._id
  })
}

module.exports.logout = (_req, res) => {
  res.clearCookie('refreshtoken'
  // , 
  //   {
  //    path: '/api/user/refresh_token' 
  //   }
  )
  return res.send({
    message: 'logged out'
  })
}

module.exports.getRefreshToken = async (req, res) => {
  try {
    if (!req.cookies) throw new Error("have no cookie!")
  } catch (err) {
    res.send({ error: err.message })
  }

  const refreshtoken = req.cookies.refreshtoken
  if (!refreshtoken) return res.send({ accessToken: '1' })

  let payload = null
  try {
    payload = verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET)
  } catch (err) {
    return res.send({ accessToken: '2' })
  }

  /* token is valid, check user exist */
  const user = await User.findOne({ _id: payload.userId })
  if (!user) return res.send({ accessToken: '3' })

  /* user exist, check if refresh token exist on user */
  if (user.refreshToken != refreshtoken) return res.send({ accessToken: '4' })

  /* token exist, create new refresh- and access token */
  /* genarate access token */
  const accessToken = createAccessToken({ userId: user._id })

  /* genarate refresh token */
  const refreshToken = createRefreshToken({ userId: user._id })

  /* save refresh token to DB */
  user.refreshToken = refreshToken
  user.save()

  /* send refresh token back */
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    // path: '/api/user/refresh_token'
  })

  return res.send({ 
    accessToken,
    email: user.email,
    userId: user._id 
  })
}

module.exports.getMyUser = async (req, res) => {
  const { userId } = req.user
  const user = await User.findOne({ _id: userId })
  res.status(200).json(user)
}