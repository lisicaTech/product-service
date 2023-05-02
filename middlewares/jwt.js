const jwt = require("express-jwt");
//const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const authenticate = jwt({
	secret: secret
});

module.exports = authenticate;