var radius = 2;
var r = 100;
const canvasHeight = 500;
const canvasWidth = 500;
let steps = 100;
let interval = 2 * Math.PI / steps
var canvas = document.getElementById('canvas');
canvas.width = canvasWidth + 600;
canvas.height = canvasHeight;
var ctx = canvas.getContext('2d')
var R = [];
var pseudo = [];
var fullpseudo = getData();
pseudo[0] = fullpseudo[0];
pseudo[1] = pseudo[0];
document.getElementById('pointsNumber').addEventListener('change', (e) => {
    let currentValue = e.target.value;
    let total = pseudo.length;
    ctx.clearRect(0, 0, canvasWidth + 600, canvasHeight)
    drawAxis();
    if (total < currentValue) {
        let end = pseudo.pop();
        pseudo.push(fullpseudo[currentValue - 2])
        pseudo.push(end);
        R = [];
        fillData(R);
        drawBlob(getBlob(drawSplines()))
        drawSplines()

    }
    if (total > currentValue) {
        let end = pseudo.pop();
        pseudo.pop();
        pseudo.push(end);
        R = [];
        fillData(R);
        drawBlob(getBlob(drawSplines()))
        drawSplines()
    }

})
function getData() {
    var data = [];
    for (let i = 0; i < 20; i++) {
        data.push(getValidCordinate());
    }
    data[0] = data[19] = 150;
    return data;
}
function point(x, y) {
    this.x = x;
    this.y = y;
    this.X = this.x + canvasWidth / 2;
    this.Y = -this.y + canvasHeight / 2;

}

function cos(a) {
    return Math.cos(a)
}
function sin(a) {
    return Math.sin(a)
}
function drawPoint(p, color, size) {

    let r = size ? size : radius;
    ctx.beginPath();
    if (color)
        ctx.fillStyle = color;
    else
        ctx.fillStyle = "black"
    ctx.arc(p.X, p.Y, r, 0, Math.PI * 2)
    ctx.fill();

}
function drawLine(p, p1, color, size) {
    ctx.beginPath();
    if (color)
        ctx.strokeStyle = color;
    else
        ctx.strokeStyle = "yellow"
    ctx.lineWidth = size ? size : 1;

    ctx.moveTo(p.X, p.Y)
    ctx.lineTo(p1.X, p1.Y)
    ctx.stroke();

}

function noise(a) {
    return sin(2 * a) + sin(Math.PI * a)
}
function drawAxis() {
    ctx.beginPath();
    ctx.strokeStyle = "black"
    ctx.moveTo(new point(-canvasWidth / 2, 0).X, new point(-canvasWidth / 2, 0).Y)
    ctx.lineTo(new point(canvasWidth / 2, 0).X, new point(canvasWidth / 2, 0).Y)
    ctx.moveTo(new point(0, -canvasHeight / 2).X, new point(0, -canvasHeight / 2).Y)
    ctx.lineTo(new point(0, canvasHeight / 2).X, new point(0, canvasHeight / 2).Y)
    ctx.moveTo(new point(canvasHeight / 2, -canvasHeight / 2).X, new point(canvasHeight / 2, -canvasHeight / 2).Y)
    ctx.lineTo(new point(canvasHeight / 2, canvasHeight / 2).X, new point(canvasHeight / 2, canvasHeight / 2).Y)
    ctx.stroke();
    //ctx.closePath();

}
function getSign() {
    return Math.random() > 0.5 ? 1 : -1
}
function getValidCordinate() {
    return 150 + getSign() * Math.floor(Math.random() * 100)
}
function fillData(data) {
    let step = canvasWidth / (pseudo.length - 1);
    for (let i = 0; i < pseudo.length; i++) {

        data.push(new point(-canvasWidth / 2 + step * i, pseudo[i % pseudo.length]))
    }

    return data;
}


function splines(data) {
    let n = data.length - 1;
    let a = [];
    for (let i = 0; i < n + 1; i++) {
        a[i] = data[i].y;
    }
    let b = [];
    let d = [];
    let h = [];
    let alpha = [];
    let c = [];
    let l = [];
    let u = [];
    let z = [];
    for (let i = 0; i < n; i++) {
        //console.log(data[i + 1].x - data[i].x)
        h[i] = data[i + 1].x - data[i].x;
    }
    //console.table(h)
    for (let i = 1; i < n; i++) {
        alpha[i] = (3 * (a[i + 1] - a[i]) / h[i]) - (3 * (a[i] - a[i - 1]) / h[i - 1]);
    }

    l[0] = 1;
    u[0] = 0;
    z[0] = 0;
    for (let i = 1; i < n; i++) {
        l[i] = 2 * (data[i + 1].x - data[i - 1].x) - h[i - 1] * u[i - 1];

        u[i] = h[i] / l[i];
        z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];

    }

    l[n] = 1;
    c[n] = 0;
    z[n] = 0;

    for (let j = n - 1; j >= 0; j--) {
        c[j] = z[j] - u[j] * c[j + 1]

        //console.log(z[j] - u[j])
        b[j] = ((a[j + 1] - a[j]) / h[j]) - (h[j] * (c[j + 1] + 2 * c[j]) / 3)
        d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }
    let output_set = [];
    for (let i = 0; i < n + 1; i++) {

        output_set.push({ a: a[i], b: b[i], c: c[i], d: d[i], x: data[i].x });
    }
    return output_set;
}
function domainCalculator(j, domain) {
    return domain.a + domain.b * (j - domain.x) + domain.c * Math.pow((j - domain.x), 2) + domain.d * Math.pow((j - domain.x), 3)
}

function drawSplines() {
    let s = splines(R);
    var points = [];
    for (let i = 0; i < s.length - 1; i++) {
        let domain = s[i];
        let end = s[i + 1].x;
        for (let j = domain.x; j < end; j++) {
            let y = domainCalculator(j, domain)
            points.push(new point(i, y))
            drawPoint(new point(j, y))

        }
    }
    return points;
}

function perlinNoise(list) {
    // alert(list.length)
    let blockSize = 5;
    let col = canvasWidth / 2;

    for (let i = -col; i < col; i += blockSize) {
        for (let j = -col; j < col; j += blockSize) {

            let index = (i + col);
            let color = 'rgb(' + list[index % list.length].y + ',' + list[index % list.length].y + ',' + list[index % list.length].y + ')';
            // index++;

            drawPoint(new point(i, j), color, blockSize)
        }

    }
}
function getBlob(list) {

    let teta = 0;
    let blob = []
    interval = 2 * Math.PI / list.length
    for (let i = 0; i < list.length; i++) {

        let RADIUS = Math.abs(list[i].y);
        teta = interval * i;
        let p = new point(RADIUS * cos(teta), RADIUS * sin(teta))
        blob.push(p)
    }
    return blob;
}

function drawBlob(shapeCordinates) {
    ctx.beginPath();
    ctx.fillStyle = "pink"
    ctx.moveTo(shapeCordinates[0].X + 600, shapeCordinates[0].Y)
    for (let i = 1; i < shapeCordinates.length; i++) {
        ctx.lineTo(shapeCordinates[i].X + 600, shapeCordinates[i].Y)
    }
    ctx.fill()

}
fillData(R)
drawAxis()
drawBlob(getBlob(drawSplines()))
