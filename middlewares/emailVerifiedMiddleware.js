const User = require('../models/User');

const requireEmailVerified = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isEmailVerified) {
            return res.status(403).json({ error: 'Please verify your email address before placing bids' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = requireEmailVerified;
