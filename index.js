// Package Imports
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
require("dotenv").config();

// DB Imports
const Course = require("./models/Course");
const User = require("./models/User");

// Express
const app = express();
const { requireStudentAuth, requireTeacherAuth, checkUser } = require('./middleware/authMiddleware');

// Import Routes
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");

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

// Helper Functions
const fetchUserId = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'IvyTechAuthenticationWithJWT', async (err, decodedToken) => {
            if (err) {
                reject("No user found.");
            } else {
                let user = await User.findById(decodedToken.id);
                resolve(user);
            }
        });
    });
}

// Routes
app.get('*', checkUser);

app.get('/', (req, res) => {
    res.render("index", {title: "Home"});
});

app.get('/students', requireStudentAuth, async (req, res) => {
    const userId = await fetchUserId(req.cookies.jwt);
    const user = await User.findById(userId);

    const courses = await Course.find({})
        .catch(err => console.error(err));

    let availableCourses = [];
    courses.forEach(course => {
        if (user.courses.includes(course._id)) return;
        if (user.cart.includes(course._id)) return;
        availableCourses.push(course);
    });

    const enrolledCourses = await Course.find({ _id: { $in: user.courses }})
        .catch(err => console.error(err));

    res.render("students", {title: "Student's Dashboard", courses: availableCourses, enrolledCourses, cartSize: user.cart.length });
});

app.get('/teachers', requireTeacherAuth, async (req, res) => {
    const userId = await fetchUserId(req.cookies.jwt);

    const user = await User.findById(userId);

    const courses = await Course.find({ _id: { $in: user.courses } })
        .catch(err => console.error(err));
    res.render("teachers", { title: "Teachers Dashboard", courses });
});

app.get('/course/drop/:id', async (req, res) => {
    const courseId = req.params.id;
    const userId = await fetchUserId(req.cookies.jwt);

    const course = await Course.findById(courseId);
    if (!course) {
        req.flash('error', "Unable to find course.");
        return res.redirect('/students');
    }

    await User.findByIdAndUpdate(userId, { $pull: { courses: courseId } });

    res.redirect('/students');
});

// Auth Routes
app.use(authRoutes);

// Course Routes
app.use('/courses', requireTeacherAuth, courseRoutes);

// Cart Routes
app.use('/cart', requireStudentAuth, cartRoutes);