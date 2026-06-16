const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../mail/sendEmail');

const generateVerificationToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const sendVerificationEmail = async (user) => {
    const token = generateVerificationToken(user._id);

    // Persist token and expiry on the user document
    user.emailVerificationToken = token;
    user.emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await sendEmail(
        user.email,
        'Verify your email address',
        'emailVerification',
        { userName: user.userName, verificationLink }
    );
};

exports.generateVerificationToken = generateVerificationToken;
exports.sendVerificationEmail = sendVerificationEmail;

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ message: 'Verification token is required' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        const user = await User.findById(decoded.id).select('+emailVerificationToken +emailVerificationExpiry');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(200).json({ message: 'Email already verified' });
        }

        if (user.emailVerificationToken !== token) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

exports.resendVerification = async (req, res) => {
    try {
        let user;

        if (req.user && req.user.id) {
            // Authenticated request — look up by user ID from token
            user = await User.findById(req.user.id).select('+emailVerificationToken +emailVerificationExpiry');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        } else {
            // Unauthenticated request — require email in body
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
            user = await User.findOne({ email }).select('+emailVerificationToken +emailVerificationExpiry');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        await sendVerificationEmail(user);

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};
