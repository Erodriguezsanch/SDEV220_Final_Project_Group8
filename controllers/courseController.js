// NPM Imports
const jwt = require("jsonwebtoken");

// DB Imports
const Course = require("../models/Course");
const User = require("../models/User");

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

// Course Routes
module.exports.add_get = (req, res) => {
    res.render('addCourse', {title: "Add a Course"});
}

module.exports.add_post = async (req, res) => {
    const userId = await fetchUserId(req.cookies.jwt);

    const course = await Course.create(req.body);

    await User.findByIdAndUpdate(userId, {
        $push: { "courses": course._id }
    });
    
    res.redirect('/teachers');
}

module.exports.update_get = async (req, res) => {
    const courseId = req.params.id;

    const course = await Course.findById(courseId)
        .catch(err => console.error(err));
    
    res.render('updateCourse', {title: "Update a Course", course});
}

module.exports.update_post = async (req, res) => {
    const course = req.body;

    await Course.findByIdAndUpdate(course.id, {
        title: course.title,
        code: course.code,
        credits: course.credits,
        description: course.description
    })
    .catch(err => console.error(err));

    res.redirect('/teachers');
}

module.exports.delete_get = async (req, res) => {
    const courseId = req.params.id;

    const course = await Course.findById(courseId)
        .catch(err => console.error(err));
    
    res.render('deleteCourse', {title: "Delete a Course", course});
}

module.exports.delete_post = async (req, res) => {
    const course = req.body;

    await Course.findByIdAndDelete(course.id)
        .catch(err => console.error(err));

    res.redirect('/teachers');
}