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
    res.sendStatus(403)
  }
}