const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/home');
    }

};

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/home');
    } else {
        return next();
    }

};

module.exports = { auth, isAuth }