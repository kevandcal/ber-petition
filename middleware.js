exports.requireNoSignature = function (req, res, next) {
    if (req.session.sigId) {
        res.redirect("/thanks");
    } else {
        next();
    }
};

exports.requireSignature = function (req, res, next) {
    if (!req.session.sigId) {
        res.redirect("/signature");
    } else {
        next();
    }
};

exports.redirectToRegistration = function (req, res, next) {
    if (
        !req.session.userId &&
        req.url != "/registration" &&
        req.url != "/login"
    ) {
        res.redirect("/registration");
    } else {
        next();
    }
};

exports.redirectAwayFromRegistration = function (req, res, next) {
    if (req.session.userId) {
        if (req.url == "/registration" || req.url == "/login") {
            res.redirect("/signature");
        } else {
            console
                .log
                ();
            next();
        }
    } else {
        next();
    }
};
