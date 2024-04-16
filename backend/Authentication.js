 
const jwt = require("jsonwebtoken");
const secretKey = process.env.ACCESS_TOKEN_SECRET;
const authenticate = (req, res, next) => {
  // Check for the token in the request headers
  const token = req.headers.authorization?.split(" ")[1]; // Assuming the token is sent as "Bearer <token>"

  // If there's no token, deny access
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // Verify the token using the secret key
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // If token verification fails, deny access
      return res.status(403).json({ error: "Unauthorized: Invalid token" });
    }

    // Store the decoded user data in the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};
module.exports = authenticate;
