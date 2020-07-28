const Validation = require("../models/validation");

module.exports.saveValidationData = (data) => {
  return new Promise((resolve, reject) => {
    Validation.create(data)
      .then((savedData) => {
        resolve(savedData);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.findValidationData = (email) => {
  return new Promise((resolve, reject) => {
    Validation.findOne({ where: { ref_email: email } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.updateValidationStatus = (email) => {
  return new Promise((resolve, reject) => {
    Validation.update(
      { is_expired: 0, is_verified: 0 },
      { where: { ref_email: email } }
    )
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
