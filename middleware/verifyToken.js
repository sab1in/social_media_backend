const jwt = require("jsonwebtoken");
const asyncFunction = require("../utils/asyncCatch");

const verifyToken = asyncFunction(async (req, res, next) => {
  const bearerHeader = req.headers.token;
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, process.env.JWT_SEC, (err, authData) => {
      if (err) {
        res.status(403).send({ msg: "Forbidden" });
      }
      res.user = authData;
    });
    next();
  } else {
    res.status(401).send({ msg: "not authenticated" });
  }
});

const verifyTokenAndAuthorize = asyncFunction(async (req, res, next) => {
  verifyToken(req, res, () => {
    if (res.user.id === req.params.id || res.user.isAdmin) {
      next();
    } else res.status(403).send({ msg: "Forbidden" });
  });
});

const verifyTokenAndAdmin = asyncFunction(async (req, res, next) => {
  verifyToken(req, res, () => {
    if (res.user.isAdmin) {
      next();
    } else res.status(403).send({ msg: "Forbidden" });
  });
});

module.exports = { verifyToken, verifyTokenAndAuthorize, verifyTokenAndAdmin };
