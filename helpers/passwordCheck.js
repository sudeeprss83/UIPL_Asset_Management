const Joi = require("@hapi/joi");

function passwordCheck(newPassword, cnfNewPassword) {
  const resetSchema = Joi.object().keys({
    newPassword: Joi.string()
      .min(5)
      .max(20)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
      .required(),
    cnfNewPassword: Joi.any().valid(Joi.ref("newPassword")).required(),
  });

  const report = resetSchema.validate({ newPassword, cnfNewPassword });
  if (report.error) {
    if (report.error.message.includes("cnfNewPassword")) {
      console.log("password did not match");
    }
    if (report.error.message.includes("fails to match")) {
      console.log("password must include capital,small and special characters");
    }
  } else {
    return true;
  }
}

module.exports = {
  passwordCheck,
};
