const validate = (schema, source = "body") => {
  return (req, res, next) => {
    let dataToValidate;

    switch (source) {
      case "query":
        dataToValidate = req.query;
        break;
      case "params":
        dataToValidate = req.params;
        break;
      case "body":
      default:
        dataToValidate = req.body;
        break;
    }

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    // Replace req data with validated and sanitized data
    switch (source) {
      case "query":
        req.query = value;
        break;
      case "params":
        req.params = value;
        break;
      case "body":
      default:
        req.body = value;
        break;
    }

    next();
  };
};
module.exports = validate;
