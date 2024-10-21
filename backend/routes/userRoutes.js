import express from 'express';
import User from '../model/usermodel.js'; // Correctly include .js extension

const router = express.Router();

// POST route for user registration
router.post('/register', async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newUser = new User({ name, email, phone });
        await newUser.save();
        res.status(200).json({ message: 'Registration successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving data.', error: error.message });
    }
});

export default router; // Use default export
