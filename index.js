// Package Imports
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

// DB Imports
const Course = require("./models/Course");

// Express
const app = express();

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
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.render("index", {title: "Home"});
});

app.get('/login', (req, res) => {
    res.render("login", {title: "Login"});
});

app.get('/register', (req, res) => {
    res.render("register", {title: "Registration"});
});

app.get('/students', async (req, res) => {
    const courses = await Course.find({})
        .catch(err => console.error(err));
    res.render("students", {title: "Student's Dashboard", courses});
});

app.get('/teachers', async (req, res) => {
    const courses = await Course.find({})
        .catch(err => console.error(err));
    res.render("teachers", { title: "Teachers Dashboard", courses });
});

app.get('/courses/add', (req, res) => {
    res.render('addCourse', {title: "Add a Course"});
});

app.post('/courses/add', (req, res) => {
    const course = new Course(req.body);

    course.save()
        .then(() => res.redirect('/teachers'))
        .catch(err => console.error(err));
});

app.get('/courses/update/:id', async (req, res) => {
    const courseId = req.params.id;

    const course = await Course.findById(courseId)
        .catch(err => console.error(err));
    
    res.render('updateCourse', {title: "Update a Course", course});
});

app.post('/courses/update', async (req, res) => {
    const course = req.body;

    await Course.findByIdAndUpdate(course.id, {
        title: course.title,
        code: course.code,
        credits: course.credits,
        description: course.description
    })
    .catch(err => console.error(err));

    res.redirect('/teachers');
});

app.get('/courses/delete/:id', async (req, res) => {
    const courseId = req.params.id;

    const course = await Course.findById(courseId)
        .catch(err => console.error(err));
    
    res.render('deleteCourse', {title: "Delete a Course", course});
});

app.post('/courses/delete', async (req, res) => {
    const course = req.body;

    console.log(`Deleting: ${course.id}`);

    await Course.findByIdAndDelete(course.id)
        .catch(err => console.error(err));

    res.redirect('/teachers');
});