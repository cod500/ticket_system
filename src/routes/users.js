const express = require('express');
const router = express.Router();
const pool = require('../../database/db');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { check, validationResult } = require("express-validator");


// register user to database 
router.post('/user/register', [
    check("username")
        .not()
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
    check("password")
        .not()
        .isEmpty()
        .withMessage("Must have passowrd")
        .isLength({ min: 8 })
        .withMessage("Password must be more than 8 characters"),
    check("confirm")
        .not()
        .isEmpty()
        .withMessage("Must confirm passowrd")
], async (req, res) => {
    try {
        await pool.query("CREATE TABLE IF NOT EXISTS users (employee_id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL, password VARCHAR(255))");
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.username]);
        console.log(user.rows.length)

        let error = validationResult(req).array();

        if (error.length > 0) {
            req.session.errors = error
            res.redirect('/')
        } else if (req.body.password != req.body.confirm) {
            req.session.errors.push({ msg: "Passwords don't match" });
            res.redirect('/')
        } else if (user.rows.length > 0) {
            req.session.errors.push({ msg: "Employee email already registered" });
            res.redirect('/');
        } else {
            password = await bcrypt.hash(req.body.password, 8);
            await pool.query("INSERT INTO users (email, password) VALUES($1, $2)",
                [req.body.username, password]);

            passport.authenticate("local")(req, res, () => {
                req.flash("success", "You are registered");
                res.redirect("/home");
            });
            console.log('went through')

        }
    } catch (e) {
        console.log(e);
    }
});


// Login through passport
router.post(
    '/user/login',
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/",
        failureFlash: "Invalid username or password",
    })
);

router.get('/user/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

module.exports = router;