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

module.exports.cart_get = async (req, res) => {
    const userId = await fetchUserId(req.cookies.jwt);

    const user = await User.findById(userId);

    const courses = await Course.find({ _id: { $in: user.cart } })
        .catch(err => console.error(err));

    res.render('cart', { title: "Cart", courses });
}

module.exports.cartAdd_get = async (req, res) => {
    const courseId = req.params.id;
    const userId = await fetchUserId(req.cookies.jwt);

    const course = await Course.findById(courseId);
    if (!course) {
        req.flash('error', "Unable to find course.");
        return res.redirect('/students');
    }

    await User.findByIdAndUpdate(userId, { $push: { cart: courseId } });

    res.redirect('/students');
}

module.exports.cartRemove_get = async (req, res) => {
    const courseId = req.params.id;
    const userId = await fetchUserId(req.cookies.jwt);

    const course = await Course.findById(courseId);
    if (!course) {
        req.flash('error', "Unable to find course.");
        return res.redirect('/cart');
    }

    await User.findByIdAndUpdate(userId, { $pull: { cart: courseId } });

    res.redirect('/cart');
}

module.exports.enroll_get = async (req, res) => {
    const userId = await fetchUserId(req.cookies.jwt);

    const user = await User.findById(userId);

    user.cart.forEach(course => {
        user.courses.push(course)
    });

    user.cart = []
    await user.save()
        .catch(err => console.error(err));

    res.redirect('/students');
}