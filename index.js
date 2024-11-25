// Package Imports
const express = require("express");

// Express
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.get('/students', (req, res) => {
    res.render("students");
});

app.get('/teachers', (req, res) => {
    res.render("teachers");
});

app.listen(3000, () => {
    console.log("Server listening on port 3000!");
});