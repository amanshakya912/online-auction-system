const User = require('../models/User');

const requireNotSuspended = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.isSuspended) {
            return res.status(403).json({ error: 'Your account has been suspended. You cannot perform this action.' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = requireNotSuspended;
