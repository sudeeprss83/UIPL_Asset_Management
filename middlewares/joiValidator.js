//@sudip saha roy 

const Joi = require("@hapi/joi");

function registrationValidator(req, res, next) {
  const userSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(2).max(15).required(),
    email: Joi.string()
      .min(7)
      .max(100)
      .regex(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required(),
    password: Joi.string()
      .min(5)
      .max(20)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
      .required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    cnfPassword: Joi.any().valid(Joi.ref("password")).required(),
  });

  const result = userSchema.validate(req.body);
  if (result.error) {
    if (result.error.message.includes("name")) {
      return res.send("name mustbe atleast 2 character long");
    }
    if (result.error.message.includes("email")) {
      return res.send("Email not valid");
    }
    if (result.error.message.includes("phone")) {
      return res.send("phone must contains number and should be 10 digit long");
    }
    if (result.error.message.includes("cnfPassword")) {
      return res.send("password did not match");
    }
    if (result.error.message.includes("fails to match")) {
      return res.send(
        "password must include capital,small and special characters"
      );
    }
  } else {
    next();
  }
}



module.exports = {
  registrationValidator,
};
