const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config(); // Load environment variables from .env file

exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;
        const requiredFields = [
            { name: 'firstName', value: firstName },
            { name: 'lastName', value: lastName},
            { name: 'userName', value: userName },
            { name: 'email', value: email },
            { name: 'password', value: password },
        ];
    
        const missingFields = requiredFields
            .filter(field => !field.value)
            .map(field => field.name);
    
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: "User already registered"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ firstName, lastName, userName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
}

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const requiredFields = [
            { name: 'email', value: email },
            { name: 'password', value: password },
        ];
    
        const missingFields = requiredFields
            .filter(field => !field.value)
            .map(field => field.name);
    
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // console.log(user)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({ message: 'Signed in successfully', token, userName: user.userName, id: user._id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id, email, userName } = req.query;
        if (!id && !email && !userName) {
            return res.status(400).json({ error: 'Please provide at least one identifier (id, email, or userName)' });
        }

        let user;
        if (id) {
            user = await User.findById(id).select('-password');
        } else if (email) {
            user = await User.findOne({ email }).select('-password');
        } else if (userName) {
            user = await User.findOne({ userName }).select('-password');
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};