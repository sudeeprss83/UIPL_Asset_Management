const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

require("dotenv").config();

const mail = require("../helpers/sendMail");

const tokenRepo = require("../repositories/tokenRepositories");
const userRepo = require("../repositories/userRepositories");

function userLogin(req, res, next) {
  userRepo
    .findUserByEmail(req.body.email)
    .then((user) => {
      if (user) {
        if (user.password === md5(req.body.password)) {
          const newuser = { id: user.id, email: user.email, role: user.role };
          console.log(newuser);
          const accessToken = generateAccessToken(newuser);
          const refreshToken = generateRefreshToken(newuser);
          tokenRepo
            .saveRefreshToken({ id: newuser.id, refreshToken })
            .then(() => {
              console.log("token saved");
            })
            .catch((err) => {
              console.log("Error occured", err.message);
            });
          res.status(200).json({ accessToken, refreshToken });
        } else {
          res.status(401).send("Username or password did not matched");
        }
      } else {
        res.status(200).send("Username or password did not match");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function RegenerateAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    tokenRepo
      .findRefreshToken(token)
      .then((savedToken) => {
        if (savedToken.dataValues.isExpire == 1) {
          jwt.verify(
            savedToken.dataValues.refreshToken,
            process.env.REFRESH_SECRET_KEY,
            (err, user) => {
              const accessToken = generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
              });
              const refreshToken = generateRefreshToken({
                id: user.id,
                email: user.email,
                role: user.role,
              });

              tokenRepo
                .findTokenByIdAndStatus(user.id)
                .then((data) => {
                  tokenRepo
                    .updateTokenById(data.dataValues.id)
                    .then((data) => {
                      tokenRepo
                        .saveRefreshToken({ id: user.id, refreshToken })
                        .then((data) => {
                          console.log("new refresh token saved");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });

              res.status(200).send({ accessToken, refreshToken });
            }
          );
        } else {
          res.status(403).send("Refresh Token Expired");
        }
      })
      .catch((err) => {
        console.log("error occured", err.message);
      });
  }
}

function userForgotPassword(req, res, next) {
  userRepo
    .findUserByEmail(req.body.email)
    .then((user) => {
      const options = {
        from: "no-reply@gmail.com",
        to: user.dataValues.email,
        subject: "Reset Account password",
        text: "Please click this link to reset your password!",
        html: `<b>${process.env.URL}/users/reset-password/${user.dataValues.id}</b>`,
      };
      mail.sendMailToUser(options);
    })
    .catch((err) => {
      console.log(err);
    });
}

function userResetPassword(req, res, next) {
  const result = passwordCheck(req.body.newPassword, req.body.cnfNewPassword);
  if (result) {
    const newPass = md5(req.body.newPassword);
    userRepo
      .updateUserPasswordById(req.params.id, newPass)
      .then((data) => {
        console.log("password successfully updated", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function userUpdatePassword(req, res, next) {
  userRepo
    .findUserByEmail(req.user.email)
    .then((data) => {
      if (data.dataValues.password === md5(req.body.oldPassword)) {
        if (data.dataValues.password === md5(req.body.newPassword)) {
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
            userRepo
              .updateUserPasswordById(req.user.id, newPass)
              .then((data) => {
                console.log("password successfully updated", data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      } else {
        res.status(403).send("old password did not match");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function userAutoLogout(req, res, next) {
  tokenRepo
    .findTokenByIdAndStatus(1)
    .then((data) => {
      const now = new Date();
      const currentTime = now.getTime() + 5.5 * 60 * 60 * 1000;

      const userTokenTime = new Date(data.dataValues.createdAt);
      const lastTokenTime = userTokenTime.getTime() + 5.5 * 60 * 60 * 1000;
      const timeDifference = Math.floor(
        (currentTime - lastTokenTime) / (60 * 1000)
      );
      console.log(timeDifference);
      if (timeDifference > 3) {
        tokenRepo
          .updateTokenById(data.dataValues.id)
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function userLogout(req, res, next) {
  tokenRepo
    .findTokenByUserId(req.user.id)
    .then((data) => {
      tokenRepo
        .updateTokenById(data.dataValues.id)
        .then((data) => {
          res.status(200).send("User Logged out");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: "2m" });
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
