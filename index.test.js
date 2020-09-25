const supertest = require("supertest");
const { app } = require("./index");

// This requires the cookie-session MOCK, not the npm package cookie-session:
const cookieSession = require("cookie-session");

test("GET /welcome: when fakeCookieForDemo cookie is sent, p tag is received as response", () => {
    // Here we're sending a cookie called "fakeCookieForDemo" as part of the request, and in index.js "fakeCookieForDemo" will be attached to req.ression; i.e. "fakeCookieForDemo" will be true in index.js req.session.

    cookieSession.mockSessionOnce({
        fakeCookieForDemo: true
    });
    return supertest(app)
        .get("/welcome")
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe("<p>Wow you have a cookie</p>");
        });
});
