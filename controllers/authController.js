// NPM Import
const jwt = require('jsonwebtoken');

// DB Import
const User = require('../models/User');

// Handle Errors
const handleErrors = (err) => {
    let error = {firstname: '', lastname: '', email: '', password: ''};

    // Incorrect Email
    if (err.message === 'Incorrect Email.') {
        error.email = "That email is not registered.";
    }

    // Incorrect Password
    if (err.message === 'Incorrect Password.') {
        error.password = "That password is incorrect.";
    }

    // Duplicate Error Code
    if (err.code === 11000) {
        error.email = 'Email is already registered';
    }

    // Validation Errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }
    
    return error;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = id => {
    return jwt.sign({ id }, 'IvyTechAuthenticationWithJWT', {
        expiresIn: maxAge
    })
}

module.exports.register_get = (req, res) => {
    res.render("register", {title: "Registration"});
}

module.exports.login_get = (req, res) => {
    res.render("login", {title: "Login"});
}

module.exports.register_post = async (req, res) => {
    const { firstname, lastname, email, password, jobCode } = req.body;

    try {
        const user = await User.create({ firstname, lastname, email, password, jobCode });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true , maxAge: maxAge * 1000 });
        res.status(201).json({ id: user._id, jobCode: user.jobCode });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

   try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true , maxAge: maxAge * 1000 });
        res.status(200).json({ id: user._id, jobCode: user.jobCode });
   } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
   }
}

module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}