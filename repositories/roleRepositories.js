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

module.exports.createRole = async (data) => {
  return new Promise((resolve, reject) => {
    Role.create({
      roleId: data.roleId,
      role: data.roleName,
    })
      .then((role) => {
        resolve(role);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
