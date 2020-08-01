const md5 = require("md5");

const pwdChk = require("../helpers/passwordCheck");
const userRepo = require("../repositories/userRepositories");
const roleRepo = require("../repositories/roleRepositories");

function dashboard(req, res, next) {
  res.send("this is super-admin's dashboard");
}

function addAdminOrSubAdmin(req, res, next) {
  if (req.user.roleId === 1) {
    (async () => {
      const roleId = await roleRepo.findRoleId(req.body.role);
      const admin = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password),
        roleId: roleId,
      };
      await userRepo.createUser(admin);
      res.status(200).send(`${req.body.role} successfully created`);
    })();
  } else {
    res.status(401).send("Access Denied!!");
  }
}

function allAdminsOrSubAdmins(req, res, next) {
  if (req.user.roleId === 1) {
    (async () => {
      const data = await userRepo.findAllAdmins();
      res.status(200).json({ data });
    })();
  } else {
    res.status(401).send("Access Denied!!");
  }
}

function specificAdminOrSubAdmin(req, res, next) {
  if (req.user.roleId === 1) {
    (async () => {
      const data = await userRepo.findAdminById(req.params.id);
      res.status(200).json({ data });
    })();
  } else {
    res.status(401).send("Access Denied!!");
  }
}

function blockAdminOrSubAdmin(req, res, next) {
  if (req.user.roleId === 1) {
    (async () => {
      const user = await userRepo.findAdminById(req.params.id);
      if (user.status === "Blocked") {
        res.status(403).send("User is already Blocked!!");
      } else {
        await userRepo.blockAdmin(req.params.id);
        res.status(200).send("User Blocked!!");
      }
    })();
  } else {
    res.status(401).send("Access Denied!!");
  }
}

function unblockAdminOrSubAdmin(req, res, next) {
  if (req.user.roleId === 1) {
    (async () => {
      const user = await userRepo.findAdminById(req.params.id);
      if (user.status === "Blocked") {
        await userRepo.unblockAdmin(req.params.id);
        res.status(200).send("User Unblocked!!");
      } else {
        res.status(403).send("User is already Active!!");
      }
    })();
  } else {
    res.status(401).send("Access Denied!!");
  }
}

function changeAdminOrSubAdminPassword(req, res, next) {
  if (req.user.roleId === 1) {
    const result = pwdChk.passwordCheck(
      req.body.newPassword,
      req.body.cnfNewPassword
    );
    if (result) {
      const newPass = md5(req.body.newPassword);
      (async () => {
        await userRepo.updateUserPasswordById(req.params.id, newPass);
        res.status(200).send("new password updated successfully ");
      })();
    }
  } else {
    res.status(401).send("Access Denied!!");
  }
}

function editAdmin(req, res, next) {
  res.send("this is your dashboard");
}

function createRole(req, res, next) {
  res.send("this is your dashboard");
}

function assignRole(req, res, next) {
  res.send("this is your dashboard");
}

module.exports = {
  dashboard,
  addAdminOrSubAdmin,
  allAdminsOrSubAdmins,
  specificAdminOrSubAdmin,
  blockAdminOrSubAdmin,
  unblockAdminOrSubAdmin,
  editAdmin,
  createRole,
  assignRole,
  changeAdminOrSubAdminPassword,
};
