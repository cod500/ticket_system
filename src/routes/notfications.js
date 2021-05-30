const express = require('express');
const router = express.Router();
const pool = require('../../database/db');
const { auth, isAuth } = require('../../auth/auth');
const moment = require('moment');

// Delete notification from database
router.delete('/delete/notification/:number', auth, async (req, res) => {

    try {
        console.log("number " + req.body.delete + " deleted");
        await pool.query("DELETE FROM notifications WHERE number = $1", [req.body.delete])
        res.send(req.body.delete)
    } catch (e) {
        console.log(e);
    }
});


//Delete all notifications from database
router.delete('/notifications/delete', auth, async (req, res) => {

    try {
        await pool.query("DELETE FROM notifications");
        console.log("All notifications deleted")
        res.send()
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;