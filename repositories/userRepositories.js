const User = require("../models/user");

module.exports.createUser = (user) => {
  return new Promise((resolve, reject) => {
    User.create(user)
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.updateUserPasswordById = (id, password) => {
  return new Promise((resolve, reject) => {
    User.update({ password: password }, { where: { id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ where: { email } })
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.updateAccountStatus = (email) => {
  return new Promise((resolve, reject) => {
    User.update({ status: "Active" }, { where: { email: email } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
