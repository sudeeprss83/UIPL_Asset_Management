const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.generateValidationToken = (email) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ email }, process.env.ACCESS_SECRET_KEY, (err, token) => {
      data = {
        ref_email: email,
        validation_hash: token,
        is_expired: 1,
        is_verified: 1,
      };
      resolve(data);
      if (err) {
        reject(err);
      }
    });
  });
};
