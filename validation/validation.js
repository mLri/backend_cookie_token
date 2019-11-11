module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {

      const { value, error } = schema.validate(req.body);

      if (error) {
        console.log('error -> ', error.details[0].message)
        return res.status(400).json({
          error: true,
          message: error.details[0].message
        });
      }

      next();
    }
  }
}