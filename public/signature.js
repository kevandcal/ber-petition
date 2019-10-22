var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
var sig = document.getElementById("sig");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
ctx.strokeStyle = "black";
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = 2;
var isDrawing = false;
canvas.addEventListener("mousedown", e => {
    console.log("mousedown event handler is running");
    isDrawing = true;
    ctx.moveTo(e.offsetX, e.offsetY);
});
canvas.addEventListener("mousemove", function draw(e) {
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});
// canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    sig.value = canvas.toDataURL();
    console.log(sig.value);
});
