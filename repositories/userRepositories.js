const User = require("../models/user");
const user = require("../models/user");

module.exports.createUser = async (user) => {
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

module.exports.updateUserPassword = async (id, password) => {
  return new Promise((resolve, reject) => {
    User.update({ password }, { where: { id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.updateUser = async (id, newUser) => {
  return new Promise((resolve, reject) => {
    User.update(newUser, { where: { id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.findUserByEmail = async (email) => {
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

module.exports.findUsers = async (roleId) => {
  return new Promise((resolve, reject) => {
    User.findAll({ where: { roleId } })
      .then((admins) => {
        resolve(admins);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.findUserById = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOne({ where: { id } })
      .then((admin) => {
        resolve(admin);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.blockAdmin = async (id) => {
  return new Promise((resolve, reject) => {
    User.update({ status: "Blocked" }, { where: { id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.unblockAdmin = async (id) => {
  return new Promise((resolve, reject) => {
    User.update({ status: "Active" }, { where: { id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.findAllAdmins = async () => {
  return new Promise((resolve, reject) => {
    User.findAll({ where: { roleId: 2 } })
      .then((admins) => {
        resolve(admins);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.findAdminById = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOne({ where: { id } })
      .then((admin) => {
        resolve(admin);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.blockAdmin = async (id) => {
  return new Promise((resolve, reject) => {
    User.update({ status: "Blocked" }, { where: { id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.unblockAdmin = async (id) => {
  return new Promise((resolve, reject) => {
    User.update({ status: "Active" }, { where: { id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
