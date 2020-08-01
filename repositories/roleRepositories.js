const Role = require("../models/role");

module.exports.findRoleId = async (role) => {
  return new Promise((resolve, reject) => {
    Role.findOne({ where: { role } })
      .then((role) => {
        resolve(role.roleId);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
