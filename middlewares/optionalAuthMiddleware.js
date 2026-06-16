const jwt = require('jsonwebtoken');

/**
 * Optional auth middleware — attaches req.user if a valid Bearer token is
 * present, but does NOT reject the request when no token is provided.
 * Useful for endpoints that work both for authenticated and anonymous users.
 */
const optionalAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id };
        }
    } catch {
        // Invalid or expired token — treat as unauthenticated
    }
    next();
};

module.exports = optionalAuthMiddleware;
