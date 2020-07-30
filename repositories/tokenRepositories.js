const Token = require("../models/refresh_token");

module.exports.saveRefreshToken = async (token) => {
  return new Promise((resolve, reject) => {
    Token.create(token)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.findRefreshToken = async (token) => {
  return new Promise((resolve, reject) => {
    Token.findOne({ where: { refreshToken: token } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.findTokenByUserId = async (id) => {
  return new Promise((resolve, reject) => {
    Token.findOne({ where: { id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.updateTokenById = async (id) => {
  return new Promise((resolve, reject) => {
    Token.update({ isExpire: 0 }, { where: { id, isExpire: 1 } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.findTokenByIdAndStatus = async (id) => {
  return new Promise((resolve, reject) => {
    Token.findOne({ where: { id, isExpire: 1 } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
