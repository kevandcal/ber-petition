new TypeIt("#type-effect", {
    speed: 150,
    startDelay: 2200
})
    .type("a nature reserve")
    .pause(1500)
    .delete()
    .pause(100)
    .type("affordable housing")
    .pause(1000)
    .delete()
    .pause(100)
    .type("a bird sanctuary")
    .pause(1000)
    .delete()
    .pause(100)
    .type("an amusement park")
    .pause(1000)
    .delete()
    .pause(100)
    .type("basically anything else...")
    .go();

const startDate = new Date("Oct 30, 2011 00:00:00").getTime();

const timer = setInterval(() => {
    let now = new Date().getTime();
    let t = now - startDate;

    let years = Math.floor(t / (1000 * 60 * 60 * 24 * 365.25));
    let days = Math.floor(
        (t % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24)
    );
    let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    let secs = Math.floor((t % (1000 * 60)) / 1000);

    document.getElementById("timer-years").innerHTML =
        years + "<span class='timer-label'>&thinsp; years</span>";

    document.getElementById("timer-days").innerHTML =
        days + "<span class='timer-label'>&thinsp; days</span>";

    document.getElementById("timer-hours").innerHTML =
        ("0" + hours).slice(-2) + "<span class='timer-label'>&thinsp; h</span>";

    document.getElementById("timer-mins").innerHTML =
        ("0" + mins).slice(-2) +
        "<span class='timer-label'>&thinsp; min</span>";

    document.getElementById("timer-secs").innerHTML =
        ("0" + secs).slice(-2) + "<span class='timer-label'>&thinsp; s</span>";
}, 1000);

// setInterval();
