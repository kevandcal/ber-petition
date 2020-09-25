const express = require("express");
const app = (exports.app = express());
const db = require("./utils/db");
const mw = require("./middleware");
const { hash, compare } = require("./utils/bc");
const hb = require("express-handlebars");
const cs = require("cookie-session");
const csurf = require("csurf");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
    cs({
        secret: "The sky is blue",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(express.static("./public"));
app.use(express.static("./pictures"));

app.use(mw.redirectToRegistration);

app.get("/", (req, res) => {
    res.redirect("/registration");
});

app.get("/registration", mw.redirectAwayFromRegistration, (req, res) => {
    res.render("registration", {});
});

app.post("/registration", mw.redirectAwayFromRegistration, (req, res) => {
    let fname = req.body.fname;
    fname = fname.toLowerCase();
    fname = fname.charAt(0).toUpperCase() + fname.substring(1);
    let lname = req.body.lname;
    lname = lname.toLowerCase();
    lname = lname.charAt(0).toUpperCase() + lname.substring(1);
    let email = req.body.email;
    let password = req.body.password;

    hash(password)
        .then(hash => {
            db.addUser(fname, lname, email, hash)
                .then(results => {
                    req.session.fname = fname;
                    req.session.userId = results.rows[0].id;
                    req.session.email = email;
                    res.redirect("/profile");
                })
                .catch(err => {
                    console.log(err);
                    res.render("signature", {
                        error: err
                    });
                    err;
                });
        })
        .catch(err => console.log(err));
});

app.get("/profile", (req, res) => {
    res.render("profile", {});
});

app.post("/profile", (req, res) => {
    let age = req.body.age;
    let city = req.body.city;
    city = city.charAt(0).toUpperCase() + city.substring(1);
    let url = req.body.url;
    let userId = req.session.userId;
    if (
        url != "" &&
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {
        url = "http://" + url;
    } else if (url === "") {
        url = null;
    }
    console.log("POST /profile url: ", url);
    db.addProfile(age, city, url, userId)
        .then(() => {
            res.redirect("/signature");
        })
        .catch(err => console.log(err));
});

app.get("/login", mw.redirectAwayFromRegistration, (req, res) => {
    res.render("login", {});
});

app.post("/login", mw.redirectAwayFromRegistration, (req, res) => {
    let email = req.body.email;
    db.getUserInfo(email)
        .then(results => {
            compare(req.body.password, results.rows[0].password)
                .then(match => {
                    if (match) {
                        if (results.rows[0].signature) {
                            req.session.sigId = true;
                        }
                        if (!req.session.userId) {
                            req.session.userId = results.rows[0].id;
                        }
                        req.session.fname = results.rows[0].first;
                        req.session.email = email;
                        res.redirect("/signature");
                    } else {
                        console.log("else");
                        res.render("login", {
                            error: true
                        });
                    }
                })
                .catch(err => {
                    console.log("catch: ", err);
                    res.render("login", {
                        error: true
                    });
                });
        })
        .catch(err => {
            console.log("catch: ", err);
            res.render("login", {
                error: true
            });
        });
});

app.get("/signature", mw.requireNoSignature, (req, res) => {
    res.render("signature", {});
});

app.post("/signature", (req, res) => {
    let sig = req.body.sig;
    let userId = req.session.userId;
    if (sig == "") {
        res.render("signature", {
            error: true
        });
    } else {
        db.addSignature(sig, userId)
            .then(() => {
                req.session.sigId = true;
                res.redirect("/thanks");
            })
            .catch(err => {
                console.log(err);
                res.render("signature", {
                    error: err
                });
                err;
            });
    }
});

app.get("/thanks", mw.requireSignature, (req, res) => {
    db.getSignature(req.session.userId)
        .then(results => {
            console.log("thanks get route getSignature results: ", results);
            res.render("thanks", {
                // fname: capFirstName,
                fname: results[0].first,
                sig: results[0].signature
            });
        })
        .catch(err => {
            console.log("Catch error from /thanks get request", err);
        });
});

app.post("/thanks", (req, res) => {
    db.deleteSignature(req.session.userId)
        .then(() => {
            req.session.sigId = null;
            res.redirect("/signature");
        })
        .catch(err => {
            console.log("POST /thanks catch err: ", err);
        });
});

app.get("/signers", (req, res) => {
    let signers = [];
    db.getSigners()
        .then(results => {
            console.log("GET /signers getUsers results: ", results);
            for (let i = 0; i < results.length; i++) {
                signers.push({
                    fname: results[i].first,
                    lname: results[i].last,
                    age: results[i].age,
                    city: results[i].city,
                    url: results[i].url
                });
            }
            return signers;
        })
        .then(signers => {
            console.log("signers: ", signers);
            res.render("signers", {
                signers: signers
            });
        })
        .catch(err => {
            console.log("GET /signers getUsers catch err:", err);
        });
});

app.get("/signers/:city", (req, res) => {
    let signers = [];
    db.getSignersByCity(req.params.city)
        .then(results => {
            console.log(
                "GET /signers/:city getSignersByCity results: ",
                results
            );
            for (let i = 0; i < results.length; i++) {
                signers.push({
                    fname: results[i].first,
                    lname: results[i].last,
                    age: results[i].age,
                    url: results[i].url
                });
            }
            return signers;
        })
        .then(signers => {
            res.render("city", {
                signers: signers,
                city: req.params.city
            });
        })
        .catch(err => console.log(err));
});

app.get("/profile/edit", (req, res) => {
    db.getUserProfile(req.session.userId)
        .then(results => {
            res.render("edit", {
                fname: results.rows[0].first,
                lname: results.rows[0].last,
                email: results.rows[0].email,
                password: results.rows[0].password,
                age: results.rows[0].age,
                city: results.rows[0].city,
                url: results.rows[0].url
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/profile/edit", (req, res) => {
    let url = req.body.url;
    let city = req.body.city;
    city = city.charAt(0).toUpperCase() + city.substring(1);
    if (
        url != "" &&
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {
        url = "http://" + url;
    }
    db.updateUserProfilesTable(req.session.userId, req.body.age, city, url)
        .then(() => {
            if (req.body.password === "") {
                db.updateUserTable(
                    req.session.userId,
                    req.body.fname,
                    req.body.lname,
                    req.body.email
                )
                    .then(() => {
                        res.redirect("/thanks");
                    })
                    .catch(err => {
                        console.log(
                            "POST /edit updateUserTable catch err: ",
                            err
                        );
                    });
            } else {
                hash(req.body.password)
                    .then(hash => {
                        db.updateUserTablePassword(
                            req.session.userId,
                            req.body.fname,
                            req.body.lname,
                            req.body.email,
                            hash
                        )
                            .then(() => {
                                res.redirect("/thanks");
                            })
                            .catch(err => {
                                console.log(
                                    "POST /edit updateUserTablePassword catch err: ",
                                    err
                                );
                            });
                    })
                    .catch(err => {
                        console.log("POST /edit hash catch err: ", err);
                    });
            }
        })
        .catch(err =>
            console.log("POST /edit updateUserProfilesTable catch err: ", err)
        );
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/registration");
});

app.listen(process.env.PORT || 8080, () => {
    console.log("The petition project server is running");
});
