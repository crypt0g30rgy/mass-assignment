const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({AccessTokenException: "JWT Error"});
  }

  // Strip "Bearer" prefix from token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = userId; //we added userId property to the req

    next();
  } catch (err) {
    console.error(err);

    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ AccessTokenException: 'JWT has expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ AccessTokenException: 'Bad JWT' });
    }

    return res.status(500).json({ error: 'Error' });
  }
}

module.exports = auth;
