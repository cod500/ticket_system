const express = require('express');
const router = express.Router();
const pool = require('../../database/db');
const { auth, isAuth } = require('../../auth/auth');

router.get('/add', auth, async (req, res) => {
    res.render('add-ticket');
});

// Add trouble ticket so database
router.post('/add', auth, async (req, res) => {
    try {
        const newTicket = await pool.query(`INSERT INTO tickets (title, priority, submitted_by, details, date_added) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
            [req.body.title, req.body.priority, req.body.employee, req.body.details]);

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

router.put('/submit/:number', auth, async (req, res) => {
    console.log(req.body.status);
    await pool.query("UPDATE tickets SET status = $1 WHERE number = $2",
        [true, req.body.status]
    );

    await pool.query("UPDATE tickets SET date_closed = CURRENT_TIMESTAMP WHERE number = $1",
        [req.body.status]
    );
    res.send(req.body.status);
})


module.exports = router;