module.exports = (req, res, next) => {
    res.locals.deleted = req.flash('deleted')
    res.locals.registered = req.flash('registered')
    res.locals.loggedIn = req.flash('loggedIn')
    res.locals.updated = req.flash('updated')
    res.locals.error = req.flash('error')
    next()
}