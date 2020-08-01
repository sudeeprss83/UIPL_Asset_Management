const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

require("dotenv").config();

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
        res.status(200).json({ accessToken, refreshToken });
      } else {
        res.status(401).send("Username or password did not matched");
      }
    } else {
      res.status(200).send("Username or password did not match");
    }
  })();
}

function RegenerateAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    (async () => {
      const savedToken = await tokenRepo.findRefreshToken(token);
      if (savedToken.isExpire == 1) {
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
              await tokenRepo.saveRefreshToken({ id: user.id, refreshToken });
            })();
            res.status(200).send({ accessToken, refreshToken });
          }
        );
      } else {
        res.status(403).send("Refresh Token Expired");
      }
    })();
  }
}

function userForgotPassword(req, res, next) {
  (async () => {
    const user = await userRepo.findUserByEmail(req.body.email);
    const data = await validationToken.generateValidationToken(user.email);
    await valRepo.saveValidationData(data);
    const options = {
      from: "no-reply@gmail.com",
      to: user.dataValues.email,
      subject: "Reset Account password",
      text: "Please click this link to reset your password!",
      html: `<b>${process.env.URL}/users/reset-password/${data.validation_hash}</b>`,
    };
    mail.sendMailToUser(options);
  })();
}

function userResetPassword(req, res, next) {
  jwt.verify(req.params.token, process.env.ACCESS_SECRET_KEY, (err, user) => {
    (async () => {
      if (user) {
        const data = await valRepo.findValidationData(user.email);
        console.log(data);
        if (
          data.validation_hash === req.params.token &&
          data.is_expired === 1
        ) {
          const result = passwordCheck(
            req.body.newPassword,
            req.body.cnfNewPassword
          );
          if (result) {
            const newPass = md5(req.body.newPassword);
            const user = await userRepo.findUserByEmail(data.ref_email);
            await userRepo.updateUserPasswordById(user.id, newPass);
            await valRepo.updateValidationStatus(data.ref_email);
          }
        }
      } else {
        res.status(404).send("Token Invalid");
      }
    })();
  });
}

function userUpdatePassword(req, res, next) {
  (async () => {
    const user = await userRepo.findUserByEmail(req.user.email);
    if (user.password === md5(req.body.oldPassword)) {
      if (user.password === md5(req.body.newPassword)) {
        res
          .status(403)
          .send("new password should be different from old password ");
      } else {
        const result = passwordCheck(
          req.body.newPassword,
          req.body.cnfNewPassword
        );
        if (result) {
          const newPass = md5(req.body.newPassword);
          await userRepo.updateUserPasswordById(req.user.id, newPass);
          res.status(200).send("new password updated successfully ");
        }
      }
    } else {
      res.status(403).send("old password did not match");
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
      console.log("user logged out");
      res.status(200).send("user logged out");
    } else {
      console.log("user logged out");
      res.status(200).send("user is still active");
    }
  })();
}

function userLogout(req, res, next) {
  (async () => {
    const token = await tokenRepo.findTokenByUserId(req.user.id);
    await tokenRepo.updateTokenById(token.id);
    res.status(200).send("User Logged out");
  })();
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_SECRET_KEY);
}

function passwordCheck(newPassword, cnfNewPassword) {
  const resetSchema = Joi.object().keys({
    newPassword: Joi.string()
      .min(5)
      .max(20)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
      .required(),
    cnfNewPassword: Joi.any().valid(Joi.ref("newPassword")).required(),
  });

  const report = resetSchema.validate({ newPassword, cnfNewPassword });
  if (report.error) {
    if (report.error.message.includes("cnfNewPassword")) {
      console.log("password did not match");
    }
    if (report.error.message.includes("fails to match")) {
      console.log("password must include capital,small and special characters");
    }
  } else {
    return true;
  }
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
