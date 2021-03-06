const LocalStrategy = require("passport-local").Strategy;
const pool = require("../database/db");
const bcrypt = require("bcrypt");
const passport = require('passport');

module.exports = function (passport) {
    console.log("Initialized");

    passport.use(
        new LocalStrategy(
            { usernameField: "username", passwordField: "password" }, (username, password, done) => {
                pool.query(
                    `SELECT * FROM users WHERE email = $1`,
                    [username],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }

                        if (results.rows.length > 0) {
                            const user = results.rows[0];

                            bcrypt.compare(password, user.password, (err, isMatch) => {
                                if (err) {
                                    console.log(err);
                                }
                                if (isMatch) {
                                    return done(null, user);
                                } else {
                                    //password is incorrect
                                    return done(null, false, { message: "Password is incorrect" });
                                }
                            });
                        } else {
                            // No user
                            return done(null, false, {
                                message: "No user with that email address"
                            });
                        }
                    }
                );
            })
    );
    // Stores user details inside session. serializeUser determines which data of the user
    // object should be stored in the session. The result of the serializeUser method is attached
    // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
    //   the user id as the key) req.session.passport.user = {id: 'xyz'}
    passport.serializeUser(function (user, done) {
        done(null, user.employee_id);
    });

    // In deserializeUser that key is matched with the in memory array / database or any data resource.
    // The fetched object is attached to the request object as req.user

    passport.deserializeUser((id, done) => {
        pool.query(`SELECT * FROM users WHERE employee_id = $1`, [id], (err, results) => {
            if (err) {
                return done(err);
            }
            console.log(`ID is ${results.rows[0].employee_id}`);
            return done(null, results.rows[0]);
        });
    });
}
