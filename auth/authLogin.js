const jwt = require("jsonwebtoken");

const authLogin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, "senhaDass");
    req.userId = decoded.userId;
    req.admin = decoded.admin;
    next();
  } catch (error) {
    res.status(401).redirect("/login");
  }
};

module.exports = authLogin;
