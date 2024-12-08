const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireStudentAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check JWT Exists and Verified
    if (token) {
        jwt.verify(token, 'IvyTechAuthenticationWithJWT', async (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                let user = await User.findById(decodedToken.id);
                if (user.jobCode === 1) {
                    next();
                } else {
                    res.redirect('/');
                }
            }
        });
    } else {
        res.redirect('/login');
    }
}

const requireTeacherAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check JWT Exists and Verified
    if (token) {
        jwt.verify(token, 'IvyTechAuthenticationWithJWT', async (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                let user = await User.findById(decodedToken.id);
                if (user.jobCode === 2) {
                    next();
                } else {
                    res.redirect('/');
                }
            }
        });
    } else {
        res.redirect('/login');
    }
}

// Check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'IvyTechAuthenticationWithJWT', async (err, decodedToken) => {
            if (err) {
                console.error(err);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireStudentAuth, requireTeacherAuth, checkUser };