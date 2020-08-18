//@sudip saha roy

const md5 = require("md5");

const pwdChk = require("../helpers/passwordCheck");
const userRepo = require("../repositories/userRepositories");
const roleRepo = require("../repositories/roleRepositories");

//for route protection testing
function dashboard(req, res, next) {
  console.log(req.user);
  res.json({ status: 200, msg: "this is super-admin's dashboard" });
}

// no-->11.1(view admin)-->(visible to super-admin)
function viewAdmin(req, res, next) {
  (async () => {
    const role = await roleRepo.findRoleById(req.user.roleId);
    if (role === "super_admin") {
      (async () => {
        try {
          const roleId = 2;
          const admins = await userRepo.findUsers(roleId);
          res.status(200).json({ status: 200, admins });
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      res.status(403).json({ status: 403, message: "Access Denied" });
    }
  })();
}

// no-->11.2(edit admin)-->(accessible by super-admin)
function editAdmin(req, res, next) {
  (async () => {
    const role = await roleRepo.findRoleById(req.user.roleId);
    if (role === "super_admin") {
      (async () => {
        try {
          const roleId = await roleRepo.findRoleId(req.body.role);
          const user = {
            name: req.body.name,
            email: req.body.email,
            roleId: roleId,
          };
          await userRepo.updateUser(req.params.id, user);
          res
            .status(200)
            .json({ status: 200, msg: `User details successfully updated` });
        } catch (error) {
          res.status(403).send({ status: 403, msg: error.message });
        }
      })();
    } else {
      res.status(403).json({ status: 403, message: "Access Denied" });
    }
  })();
}

// no-->11.3(add sub-admin)-->(accessible by super-admin and admin)
function createSubAdmin(req, res, next) {
  (async () => {
    const role = await roleRepo.findRoleById(req.user.roleId);
    if (role === "super_admin") {
      (async () => {
        const subAdmin = {
          name: req.body.name,
          email: req.body.email,
          password: md5(req.body.password),
          roleId: 3,
        };
        try {
          await userRepo.createUser(subAdmin);
          res
            .status(200)
            .json({ status: 200, msg: `sub_admin successfully created` });
        } catch (error) {
          res.status(403).send({ status: 403, msg: error.message });
        }
      })();
    } else {
      res.status(403).json({ status: 403, message: "Access Denied" });
    }
  })();
}

// no-->11.4(edit sub-admin)-->(accessible by super-admin and admin)
function editSubAdmin(req, res, next) {
  (async () => {
    const role = await roleRepo.findRoleById(req.user.roleId);
    if (role === "super_admin" || role === "admin") {
      (async () => {
        const user = await userRepo.findUserById(req.params.id);
        const role = await roleRepo.findRoleById(user.roleId);
        if (role === "sub_admin") {
          try {
            const roleId = await roleRepo.findRoleId(req.body.role);
            const user = {
              name: req.body.name,
              email: req.body.email,
              roleId: roleId,
            };
            await userRepo.updateUser(req.params.id, user);
            res
              .status(200)
              .json({ status: 200, msg: `User details successfully updated` });
          } catch (error) {
            res.status(403).send({ status: 403, msg: error.message });
          }
        } else {
          res
            .status(403)
            .json({ status: 403, message: "user is not sub_admin" });
        }
      })();
    } else {
      res.status(403).json({ status: 403, message: "Access Denied" });
    }
  })();
}

// no-->11.5(change sub-admin password)-->(accessible by super-admin and admin)
function changeSubadminPassword(req, res, next) {
  (async () => {
    const role = await roleRepo.findRoleById(req.user.roleId);
    if (role === "super_admin" || role === "admin") {
      (async () => {
        const user = await userRepo.findUserById(req.params.id);
        const role = await roleRepo.findRoleById(user.roleId);
        if (role === "sub_admin") {
          (async () => {
            const result = await pwdChk.passwordCheck(
              req.body.newPassword,
              req.body.cnfNewPassword
            );
            if (result.err === false) {
              const newPass = md5(req.body.newPassword);
              (async () => {
                await userRepo.updateUserPassword(req.params.id, newPass);
                res.status(200).json({
                  status: 200,
                  message: result.message,
                });
              })();
            } else {
              res.status(403).send({ status: 403, msg: result.message });
            }
          })();
        } else {
          res
            .status(403)
            .json({ status: 403, message: "user is not sub_admin" });
        }
      })();
    } else {
      res.status(403).json({ status: 403, message: "Access Denied" });
    }
  })();
}

// no-->11.6(block sub-admin)-->(accessible by super-admin and admin)
function blockSubadmin(req, res, next) {
  (async () => {
    const role = await roleRepo.findRoleById(req.user.roleId);
    if (role === "super_admin" || role === "admin") {
      (async () => {
        const user = await userRepo.findUserById(req.params.id);
        const role = await roleRepo.findRoleById(user.roleId);
        if (role === "sub_admin") {
          if (user.status === "Blocked") {
            res
              .status(403)
              .json({ status: 403, msg: "User is already Blocked!!" });
          } else {
            await userRepo.blockAdmin(req.params.id);
            res.status(200).json({ status: 200, msg: "User Blocked!!" });
          }
        } else {
          res
            .status(403)
            .json({ status: 403, message: "user is not sub_admin" });
        }
      })();
    } else {
      res.status(403).json({ status: 403, message: "Access Denied" });
    }
  })();
}

//no-->11.7  create role
function createRole(req, res, next) {
  (async () => {
    const role = await roleRepo.findRoleById(req.user.roleId);
    if (role === "super_admin" || role === "admin") {
      (async () => {
        const role = {
          roleId: req.body.roleId,
          roleName: req.body.roleName,
        };
        try {
          await roleRepo.createRole(role);
          res
            .status(200)
            .json({ status: 200, message: "role created successfully" });
        } catch (error) {
          res
            .status(403)
            .json({ status: 200, message: "error in creating role" });
        }
      })();
    } else {
      res.status(403).json({ status: 403, message: "Access Denied" });
    }
  })();
}

//no-->11.8  edit role
function editRole(req, res, next) {
  res.json("this is your dashboard");
}

//no-->11.9  assign role
function assignRole(req, res, next) {
  res.json("this is your dashboard");
}

// no-->11.10(unblock sub-admin)-->(accessible by super-admin and admin)
function unblockSubadmin(req, res, next) {
  (async () => {
    const role = await roleRepo.findRoleById(req.user.roleId);
    if (role === "super_admin" || role === "admin") {
      (async () => {
        const user = await userRepo.findUserById(req.params.id);
        const role = await roleRepo.findRoleById(user.roleId);
        if (role === "sub_admin") {
          const user = await userRepo.findUserById(req.params.id);
          if (user.status === "Blocked") {
            await userRepo.unblockAdmin(req.params.id);
            res.status(200).json({ status: 200, msg: "User Unblocked!!" });
          } else {
            res
              .status(403)
              .json({ status: 403, msg: "User is already Active!!" });
          }
        } else {
          res
            .status(403)
            .json({ status: 403, message: "user is not sub_admin" });
        }
      })();
    } else {
      res.status(403).json({ status: 403, message: "Access Denied" });
    }
  })();
}

//============================================================================//

//Super-Admin,admin,sub-admin can change password from profile
function userUpdatePassword(req, res, next) {
  (async () => {
    const user = await userRepo.findUserByEmail(req.user.email);
    if (user.password === md5(req.body.oldPassword)) {
      if (user.password === md5(req.body.newPassword)) {
        res.status(403).send({
          status: 403,
          msg: "new password should be different from old password",
        });
      } else {
        const result = await pwdChk.passwordCheck(
          req.body.newPassword,
          req.body.cnfNewPassword
        );
        console.log(result);
        if (result.err === false) {
          const newPass = md5(req.body.newPassword);
          await userRepo.updateUserPassword(req.user.id, newPass);
          res.status(200).send({ status: 200, msg: result.message });
        } else {
          res.status(403).send({ status: 403, msg: result.message });
        }
      }
    } else {
      res.status(403).send({
        status: 403,
        msg: "old password did not match",
      });
    }
  })();
}
//=================================================================================

module.exports = {
  dashboard,
  viewAdmin,
  editAdmin,
  createSubAdmin,
  editSubAdmin,
  changeSubadminPassword,
  blockSubadmin,
  createRole,
  editRole,
  assignRole,
  unblockSubadmin,
  userUpdatePassword,
};
