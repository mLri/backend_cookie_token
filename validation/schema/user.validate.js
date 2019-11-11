const Joi = require('@hapi/joi');

module.exports = {
  schemasUser: {
    signup: Joi.object({
      firstName: Joi.string().min(3).max(30).required(),
      lastName: Joi.string().min(3).max(30).required(),
      password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    }),
    signin: Joi.object({
      password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    })
  }
}