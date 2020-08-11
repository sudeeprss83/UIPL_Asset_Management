const md5 = require("md5");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const pwd = require("../helpers/passwordCheck");
const mail = require("../helpers/sendMail");
const validationToken = require("../helpers/validationToken");

const tokenRepo = require("../repositories/tokenRepositories");
const userRepo = require("../repositories/userRepositories");
const valRepo = require("../repositories/validationRepositories");

function userLogin(req, res, next) {
  (async () => {
    const user = await userRepo.findUserByEmail(req.body.email);
    if (user) {
      if (user.password === md5(req.body.password)) {
        const newuser = { id: user.id, email: user.email, roleId: user.roleId };
        const accessToken = generateAccessToken(newuser);
        const refreshToken = generateRefreshToken(newuser);
        await tokenRepo.saveRefreshToken({
          id: newuser.id,
          refreshToken,
        });
        res.status(200).json({
          status: 200,
          msg: "Sucessfully logged in",
          data: {
            id: user.id,
            roleID: user.roleId,
            email: user.email,
            name: user.name,
            status: user.status,
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        });
      } else {
        res
          .status(401)
          .send({ status: 401, msg: "Username or password did not match" });
      }
    } else {
      res
        .status(401)
        .send({ status: 401, msg: "Username or password did not match" });
    }
  })();
}

function RegenerateAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    (async () => {
      const savedToken = await tokenRepo.findRefreshToken(token);
      if (savedToken && savedToken.isExpire == 1) {
        jwt.verify(
          savedToken.refreshToken,
          process.env.REFRESH_SECRET_KEY,
          (err, user) => {
            myuser = user;
            const accessToken = generateAccessToken({
              id: user.id,
              email: user.email,
              roleId: user.roleId,
            });
            const refreshToken = generateRefreshToken({
              id: user.id,
              email: user.email,
              roleId: user.roleId,
            });
            (async () => {
              const userData = await tokenRepo.findTokenByIdAndStatus(user.id);
              await tokenRepo.updateTokenById(userData.id);
              try {
                await tokenRepo.saveRefreshToken({ id: user.id, refreshToken });
              } catch (error) {
                console.log(error);
              }
            })();
            res.status(200).json({
              status: 200,
              data: {
                access_token: accessToken,
                refresh_token: refreshToken,
              },
            });
          }
        );
      } else {
        res.status(403).json({
          status: 403,
          msg: "refresh token expired",
        });
      }
    })();
  }
}

function userForgotPassword(req, res, next) {
  (async () => {
    const user = await userRepo.findUserByEmail(req.body.email);
    if (user) {
      const data = await validationToken.generateValidationToken(user.email);
      await valRepo.saveValidationData(data);
      const options = {
        from: "no-reply@gmail.com",
        to: user.dataValues.email,
        subject: "Reset Account password",
        text: "Please click this link to reset your password!",
        html: `<b>${process.env.URL}/users/reset-password/${data.validation_hash}</b>`,
      };
      const sent = await mail.sendMailToUser(options);
      if (sent) {
        res
          .status(200)
          .send({ status: 200, msg: "Mail sent! Please check your email" });
      } else {
        res.status(403).json({
          status: 403,
          msg: "Email address invalid",
        });
      }
    } else {
      res.status(403).json({
        status: 403,
        msg: "Email is not registered",
      });
    }
  })();
}

function userResetPassword(req, res, next) {
  jwt.verify(req.params.token, process.env.ACCESS_SECRET_KEY, (err, user) => {
    (async () => {
      if (user) {
        const data = await valRepo.findValidationData(user.email);
        if (
          data.validation_hash === req.params.token &&
          data.is_expired === 1
        ) {
          const result = await pwd.passwordCheck(
            req.body.newPassword,
            req.body.cnfNewPassword
          );
          if (result.err === false) {
            const newPass = md5(req.body.newPassword);
            const user = await userRepo.findUserByEmail(data.ref_email);
            await userRepo.updateUserPasswordById(user.id, newPass);
            await valRepo.updateValidationStatus(data.ref_email);
            res
              .status(200)
              .send({ status: 200, msg: "Password Successfully changed" });
          } else {
            res.status(403).send({ status: 403, msg: result.message });
          }
        }
      } else {
        res
          .status(403)
          .send({ status: 403, msg: "Oops, Something went wrong" });
      }
    })();
  });
}

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
        const result = await pwd.passwordCheck(
          req.body.newPassword,
          req.body.cnfNewPassword
        );
        console.log(result);
        if (result.err === false) {
          const newPass = md5(req.body.newPassword);
          await userRepo.updateUserPasswordById(req.user.id, newPass);
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

function userAutoLogout(req, res, next) {
  (async () => {
    const data = await tokenRepo.findTokenByIdAndStatus(req.user.id);
    const now = new Date();
    const currentTime = now.getTime() + 5.5 * 60 * 60 * 1000;
    const userTokenTime = new Date(data.dataValues.createdAt);
    const lastTokenTime = userTokenTime.getTime() + 5.5 * 60 * 60 * 1000;
    const timeDifference = Math.floor(
      (currentTime - lastTokenTime) / (60 * 1000)
    );
    if (timeDifference > 3) {
      await tokenRepo.updateTokenById(data.dataValues.id);
      res.status(200).send({ status: 200, msg: "user logged out" });
    } else {
      res.status(403).send({ status: 403, msg: "user is still active" });
    }
  })();
}

function userLogout(req, res, next) {
  (async () => {
    const token = await tokenRepo.findTokenByUserId(req.user.id);
    await tokenRepo.updateTokenById(token.id);
    res.status(200).send({ status: 200, msg: "user logged out" });
  })();
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_SECRET_KEY);
}

module.exports = {
  userLogin,
  RegenerateAccessToken,
  userForgotPassword,
  userUpdatePassword,
  userAutoLogout,
  userLogout,
  userResetPassword,
};
