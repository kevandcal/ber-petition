exports.requireNoSignature = function(req, res, next) {
    if (req.session.sigId) {
        res.redirect("/thanks");
    } else {
        next();
    }
};

exports.requireSignature = function(req, res, next) {
    if (!req.session.sigId) {
        res.redirect("/signature");
    } else {
        next();
    }
};

exports.redirectToRegistration = function(req, res, next) {
    // console.log("redirectToRegistration is running");
    if (
        !req.session.userId &&
        req.url != "/registration" &&
        req.url != "/login"
    ) {
        // console.log("redirectToRegistration if code block is running");
        res.redirect("/registration");
    } else {
        // console.log("redirectToRegistration else code block is running");
        next();
    }
};

// exports.redirectToRegistration = function(req, res, next) {
//     if (!req.session.userId) {
//         if (req.url == "/login") {
//             return;
//         } else if (req.url != "registration") {
//             res.redirect("/registration");
//         } else {
//             next();
//         }
//     } else {
//         next();
//     }
// };

// exports.redirectToRegistration = function(req, res, next) {
//     if (!req.session.userId) {
//         if (req.url != "/login" && req.url != "/registration") {
//             res.redirect("/registration");
//         } else {
//             next();
//         }
//     } else {
//         next();
//     }
// };

exports.redirectAwayFromRegistration = function(req, res, next) {
    // console.log("redirectAwayFromRegistration is running");
    if (req.session.userId) {
        // console.log("redirectAwayFromRegistration if code block is running");
        if (req.url == "/registration" || req.url == "/login") {
            res.redirect("/signature");
        } else {
            console
                .log
                // "redirectAwayFromRegistration else code block is running"
                ();
            next();
        }
    } else {
        next();
    }
};
