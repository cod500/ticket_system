const express = require('express');
const router = express.Router();
const pool = require('../../database/db');
const moment = require('moment');
const { isAuth } = require('../../auth/auth')

router.get('/', isAuth, (req, res) => {
    let errors;
    if (req.session.errors) {
        console.log(req.session.errors)
        errors = req.session.errors;
        req.session.errors = null;
    }

    console.log(errors)
    res.render('index', {
        guy: 'hello',
        errors: errors
    });
});

// Get all tickets
router.get('/home', async (req, res) => {
    try {

        let tickets;
        let notifications;
        await pool.query("CREATE TABLE IF NOT EXISTS tickets (number SERIAL PRIMARY KEY, date_added TIMESTAMP NOT NULL, title VARCHAR(255), priority VARCHAR(255), submitted_by VARCHAR(255), details VARCHAR(255), status BOOLEAN DEFAULT FALSE, date_closed TIMESTAMP)");

        await pool.query("CREATE TABLE IF NOT EXISTS notifications (number SERIAL PRIMARY KEY, date_added TIMESTAMP NOT NULL, title VARCHAR(255), priority VARCHAR(255), submitted_by VARCHAR(255), status BOOLEAN DEFAULT FALSE, date_closed TIMESTAMP)");

        if (req.query.status === 'open') {
            tickets = await pool.query("SELECT * FROM tickets WHERE status = false ORDER BY number ASC;");
            notifications = await pool.query("SELECT * FROM notifications ORDER BY number ASC;");
        } else if (req.query.status === 'closed') {
            tickets = await pool.query("SELECT * FROM tickets WHERE status = true ORDER BY number ASC;");
            notifications = await pool.query("SELECT * FROM notifications ORDER BY number ASC;");
        } else {
            tickets = await pool.query("SELECT * FROM tickets ORDER BY number ASC;");
            notifications = await pool.query("SELECT * FROM notifications ORDER BY number ASC;");
        }

        console.log(notifications)

        res.render('home', {
            tickets: tickets.rows,
            notifications: notifications.rows,
            moment: moment
        });

    } catch (e) {
        console.log(e)
    }
});


//Route for chart information taken from database
router.get('/chart', async (req, res) => {
    const tickets = await pool.query("SELECT * FROM tickets WHERE status = true;");
    res.send(tickets.rows);
});

module.exports = router;