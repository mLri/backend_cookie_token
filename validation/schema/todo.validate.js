const Joi = require('@hapi/joi');

module.exports = {
  schemasTodo: {
    add: Joi.object({
      userId: Joi.string().min(3).max(30).required(),
      title: Joi.string().min(3).max(30).required(),
      completed: Joi.boolean().strict()
    })
  }
}