// Package Imports
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
require("dotenv").config();

// DB Imports
const Course = require("./models/Course");

// Express
const app = express();
const { requireStudentAuth, requireTeacherAuth, checkUser } = require('./middleware/authMiddleware');

// Import Routes
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");

// MongoDB
mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log("Database Connected!")
        app.listen(3000, () => {
            console.log("Server is now listening on http://localhost:3000 ! ");
        });
    })
    .catch(err => console.error(err));

// Set View Engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.get('*', checkUser);

app.get('/', (req, res) => {
    res.render("index", {title: "Home"});
});

app.get('/students', requireStudentAuth, async (req, res) => {
    const courses = await Course.find({})
        .catch(err => console.error(err));
    res.render("students", {title: "Student's Dashboard", courses});
});

app.get('/teachers', requireTeacherAuth, async (req, res) => {
    const courses = await Course.find({})
        .catch(err => console.error(err));
    res.render("teachers", { title: "Teachers Dashboard", courses });
});

// Auth Routes
app.use(authRoutes);

// Course Routes
app.use('/courses', courseRoutes);