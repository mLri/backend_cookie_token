const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

  /* checking user */
  const user = await User.findOne({ email })
  if(!user) return res.status(401).json({ error: true, message: 'user not found!' })

  /* checking password */
  const comparePassword = await bcrypt.compare(password, user.password)
  if(!comparePassword) return res.status(401).json({ error: true, message: 'password was wrong!' })

  /* genarate token */
  const token = await jwt.sign({
    userId: user._id
  }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 })

  res.status(200).header('Authorization', token).json({ token })
}

module.exports.getMyUser = async (req, res) => {
  const { userId } = req.user
  const user = await User.findOne({ _id: userId })
  res.status(200).json(user)
}