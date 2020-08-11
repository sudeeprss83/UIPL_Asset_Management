const Joi = require("@hapi/joi");

module.exports.passwordCheck = async (newPassword, cnfNewPassword) => {
  return new Promise((resolve, reject) => {
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
        const value = { err: true, message: "password did not match" };
        resolve(value);
      }
      if (report.error.message.includes("fails to match")) {
        const value = {
          err: true,
          message: "password must include capital,small and special characters",
        };
        resolve(value);
      }
    } else {
      const value = {
        err: false,
        message: "New Password Successfully Updated",
      };
      resolve(value);
    }
  });
};
