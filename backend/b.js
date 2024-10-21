const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const { Schema, model } = mongoose;

// Define schema and model for user registration
const userSchema = new Schema({
    name: String,
    email: String,
    phone: String
});

const User = model('User ', userSchema);

// Define schema and model for course enrollment
const enrollmentSchema = new Schema({
    username: String,
    email: String,
    phone: String,
    courseName: String,
    courseCost: String,
    paymentMethod: String,
    enrolledAt: { type: Date, default: Date.now }
});

const Enrollment = model('Enrollment', enrollmentSchema);

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://vinnujella:vinnu@cluster0.t29fk.mongodb.net/multiback')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Nodemailer setup

// POST: User registration
// POST: Register a new user
app.post('/api/register', async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if user already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(409).json({ message: 'User  already exists. Please log in.' });
        }

        const newUser = new User({ name, email, phone });
        await newUser.save();
        res.status(201).json({ message: 'User  registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user.', error: error.message });
    }
});

// GET: Retrieve registered users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users.', error: error.message });
    }
});

const courseVideos = [
    { title: 'HTML & CSS Course', url: 'https://www.youtube.com/embed/ts1DDgJyWTk?si=-eRYr8y3B9l0T_8R', courseName: 'HTML Basics' },
    { title: 'Java Tutorial Course', url: 'https://www.youtube.com/embed/BGTx91t8q50?si=V0aaVwVSytdFbiRp', courseName: 'Java Tutorial Course' },
    { title: 'JavaScript Course', url: 'https://www.youtube.com/embed/9M4XKi25I2M?si=QUgjx74OtoYnLePq', courseName: 'JavaScript 101' },
    { title: 'Machine Learning', url: 'https://www.youtube.com/embed/GwIo3gDZCVQ?si=V3wy9REpZJAKYUBJ', courseName: 'Machine Learning' },
    { title: 'App Development Course', url: 'https://www.youtube.com/embed/CzRQ9mnmh44?si=137t0Jb4clT-lNY8', courseName: 'App Development Course' },
    { title: 'Angular Js', url: 'https://www.youtube.com/embed/CGLdH5ORX-Y?si=JJs9JgYSxsalPg_O', courseName: 'Machine Learning' },
    { title: 'Python Course', url: 'https://www.youtube.com/embed/XKHEtdqhLK8?si=KeZHMo7QqaUeL72I', courseName: 'Python Course' }
];

// Middleware

// GET: Retrieve course videos
app.get('/api/course-videos', (req, res) => {
    res.json(courseVideos);
});

// POST: Course enrollment
// POST: Course enrollment
app.post('/api/enroll', async (req, res) => {
    const { username, email, phone, courseName, courseCost, paymentMethod } = req.body;

    if (!username || !email || !phone || !courseName || !courseCost || !paymentMethod) {
        return res.status(400).json({ message: 'All fields are required for enrollment.' });
    }

    try {
        // Check if the user is already enrolled in the same course
        const existingEnrollment = await Enrollment.findOne({ username, courseName });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'User  already enrolled in this course.' });
        }

        const newEnrollment = new Enrollment({
            username,
            email,
            phone,
            courseName,
            courseCost,
            paymentMethod
        });
        await newEnrollment.save();
        res.status(200).json({ message: 'Enrollment successful!', data: newEnrollment });
    } catch (error) {
        res.status(500).json({ message: 'Error saving enrollment data.', error: error.message });
    }
});

// DELETE: Remove an enrollment by ID
app.delete('/api/enrollment/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEnrollment = await Enrollment.findByIdAndDelete(id);
        if (!deletedEnrollment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }

        res.status(200).json({ message: 'Enrollment deleted successfully!', data: deletedEnrollment });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting enrollment.', error: error.message });
    }
});

// GET: Retrieve all enrollments
app.get('/api/enrollments', async (req, res) => {
    try {
        const enrollments = await Enrollment.find();
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving enrollments.', error: error.message });
    }
});

// GET: Retrieve course videos
app.get('/api/course-videos', async (req, res) => {
    try {
        const courseVideos = [
            { title: 'HTML & CSS Course', url: 'https://www.youtube.com/embed/ts1DDgJyWTk?si=-eRYr8y3B9l0T_8R', courseName: 'HTML Basics' },
            { title: 'Java Tutorial Course', url: 'https://www.youtube.com/embed/BGTx91t8q50?si=V0aaVwVSytdFbiRp', courseName: 'Java Tutorial Course' },
            { title: 'JavaScript Course', url: 'https://www.youtube.com/embed/9M4XKi25I2M?si=QUgjx74OtoYnLePq', courseName: 'JavaScript 101' },
            { title: 'Machine Learning', url: 'https://www.youtube.com/embed/GwIo3gDZCVQ?si=V3wy9REpZJAKYUBJ', courseName: 'Machine Learning' },
            { title: 'App Development Course', url: 'https://www.youtube.com/embed/CzRQ9mnmh44?si=137t0Jb4clT-lNY8', courseName: 'App Development Course' },
            { title: 'Angular Js', url: 'https://www.youtube.com/embed/CGLdH5ORX-Y?si=JJs9JgYSxsalPg_O', courseName: 'Machine Learning' },
            { title: 'Python Course', url: 'https://www.youtube.com/embed/ts1DDgJyWTk?si=-eRYr8y3B9l0T_8R', courseName: 'Python Course' }
        ];
        res.status(200).json(courseVideos);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving course videos.', error: error.message });
    }
});

let messages = [];

// POST: Contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Store the message
    messages.push({ name, email, subject, message, date: new Date() });

    // Optionally send an email using Nodemailer (if needed)
    // nodemailer setup and email sending logic here...

    res.status(200).json({ message: 'Message received successfully!' });
});

async function enrollInCourse(courseData) {
    try {
        const response = await fetch('http://localhost:3000/api/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        // Enrollment successful, update the dashboard
        updateDashboard();

    } catch (error) {
        alert(error.message); // Display the error message to the user
    }
}

// Route to view messages (admin page)
app.get('/admin/messages', (req, res) => {
    res.json(messages);
});

// POST: User login
app.post('/api/login', async (req, res) => {
    const { email, phone } = req.body;

    if (!email || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const user = await User.findOne({ email, phone });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({ message: 'Login successful!', user });
    } catch (error) {
        res.status(500).json({ message: 'Error during login.', error: error.message });
    }
});

// GET: Dashboard details
// Assuming you have a MongoDB model for User and Enrollments

app.get('/api/dashboard', async (req, res) => {
    try {
        console.log(req.user);
        // Fetch user and their enrolled courses based on their user ID (assuming the user is authenticated)
        const userId = req.user.id; // You'll need to have user authentication in place
        const user = await User.findById(userId).select('name email phone');
        const enrollments = await Enrollment.find({ user }).select('courseName courseCost');
        console.log(user);
        res.json({
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            enrollments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST: User login
app.post('/api/login', async (req, res) => {
    const { username, email, phone } = req.body;
    if (!username || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const user = await User.findOne({ username, email, phone });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({ message: 'Login successful!', user });
    } catch (error) {
        res.status(500).json({ message: 'Error during login.', error: error.message });
    }
});

// GET: Retrieve enrollments for a specific user
app.get('/api/enrollments/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const enrollments = await Enrollment.find({ username });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving enrollments.', error: error.message });
    }
});

// GET: User-specific dashboard
app.get('/api/dashboard/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        const enrollments = await Enrollment.find({ username }); // Fetch enrollments by username

        if (!user) {
            return res.status(404).json({ message: 'User  not found.' });
        }

        res.json({
            user: {
                username: user.username,
                email: user.email,
                phone: user.phone
            },
            enrollments
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});