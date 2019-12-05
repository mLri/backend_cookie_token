const jwt = require('jsonwebtoken')

module.exports.auth = (req, res, next) => {
  const authToken = req.headers['authorization']
  if(!authToken) return res.sendStatus(403)
  const token = authToken.split(' ')[1]

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified
    next()
  } catch (err) {
    console.log(err)
    res.status(403).json(err)
  }
}

module.exports.createAccessToken = (payload) => {
  return jwt.sign({ ...payload }, process.env.TOKEN_SECRET, { expiresIn: '1m' })
}

module.exports.createRefreshToken = (payload) => {
  return jwt.sign({ ...payload }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}