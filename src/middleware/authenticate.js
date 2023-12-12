// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  if (req.originalUrl === '/' || req.originalUrl === '/api/v1/docs/') {
    next();
  } else {
    let token;

    // Check for token in request body or headers
    if (req.body.token) {
      token = req.body.token; // Get the token from the request body
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header
    }

    if (token) {
      req.token = token; // Set the token in the request object
      next();
    } else {
      return res.status(401).json({ error: 'Unauthorized. Token missing.' });
    }
  }
};

// Middleware to attach token in headers
const attachHeaders = (req, res, next) => {
  if (req.originalUrl === '/' || req.originalUrl === '/api/v1/docs/') {
    next();
  } else {
    if (req.body.token) {
      // Pass the token from the body to the Authorization header
      req.headers['Authorization'] = `Bearer ${req.body.token}`;
      next();
    } else {
      // Token is not in the body, continue to the next middleware
      next();
    }
  }
};

export {
  authenticateToken,
  attachHeaders
}
