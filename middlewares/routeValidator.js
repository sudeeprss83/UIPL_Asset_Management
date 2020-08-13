//@sudip saha roy 

const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
      if (err) {
        res.status(401).send(err.message);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).send("Please login to access this route");
  }
};
