const Validation = require("../models/validation");

module.exports.saveValidationData = async (data) => {
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

module.exports.findValidationData = async (email) => {
  return new Promise((resolve, reject) => {
    Validation.findOne({ where: { ref_email: email, is_expired: 1 } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.updateValidationStatus = async (email) => {
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
