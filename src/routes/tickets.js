const express = require('express');
const router = express.Router();
const pool = require('../../database/db');
const { auth, isAuth } = require('../../auth/auth');
const moment = require('moment');

//Mobile single ticket page
router.get('/ticket/:number', async (req, res) => {
    try {
        let ticket = await pool.query("SELECT * FROM tickets WHERE number = $1", [req.params.number]);
        let notifications = await pool.query("SELECT * FROM notifications ORDER BY number ASC;");
        console.log(ticket.rows[0])

        res.render('single-ticket', {
            ticket: ticket.rows[0],
            notifications: notifications.rows,
            moment
        });
    } catch (e) {
        console.log(e)
    }
});

//Add ticket page
router.get('/add', auth, async (req, res) => {
    try {
        let notifications = await pool.query("SELECT * FROM notifications ORDER BY number ASC;");
        console.log(notifications);

        res.render('add-ticket', {
            notifications: notifications.rows,
            moment: moment
        });
    } catch (e) {
        console.log(e)
    }
});

// Add trouble ticket so database
router.post('/add', auth, async (req, res) => {
    try {
        //New ticket
        const newTicket = await pool.query(`INSERT INTO tickets (title, priority, submitted_by, details, date_added) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
            [req.body.title, req.body.priority, req.body.employee, req.body.details]);

        //Add new ticket to top of notificaitons
        const newNotification = await pool.query(`INSERT INTO notifications (title, priority, submitted_by, date_added) VALUES($1, $2, $3, CURRENT_TIMESTAMP)`,
            [req.body.title, req.body.priority, req.body.employee]);

        req.flash("success", "Ticket Added!");
        res.redirect('/home');
    } catch (e) {
        console.log(e)
    }
});

// Delete trouble ticket from database
router.delete('/delete/:number', auth, async (req, res) => {

    try {
        console.log("number " + req.body.delete + " deleted");
        await pool.query("DELETE FROM tickets WHERE number = $1", [req.body.delete])
        res.send(req.body.delete)
    } catch (e) {
        console.log(e);
    }
});

// Close ticket 
router.put('/submit/:number', auth, async (req, res) => {
    console.log(req.body.status);
    await pool.query("UPDATE tickets SET status = $1 WHERE number = $2",
        [true, req.body.status]
    );

    await pool.query("UPDATE tickets SET date_closed = CURRENT_TIMESTAMP WHERE number = $1",
        [req.body.status]
    );

    ticket = await pool.query("SELECT * FROM tickets WHERE number = $1", [req.body.status]);
    console.log(ticket.rows[0])

    await pool.query(`INSERT INTO notifications (title, priority, submitted_by, date_added, status, date_closed ) VALUES($1, $2, $3, $4, $5, $6)`,
        [ticket.rows[0].title, ticket.rows[0].priority, ticket.rows[0].submitted_by, ticket.rows[0].date_added, ticket.rows[0].status, ticket.rows[0].date_closed]);

    res.send(req.body.status);
})


module.exports = router;