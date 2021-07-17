// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
let Audio1 = new Audio("a.wav")

// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

class Shape {
    constructor(x, y, velX, velY, size, color, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
        this.exists = exists;
    }
}

class Ball extends Shape {
    constructor(x, y, velX, velY, size, color, exists) {
        super(x, y, velX, velY, size, color, exists)
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (let j = 0; j < balls.length; j++) {
            if (!(this === balls[j]) && balls[j].exists) {
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + balls[j].size) {
                    balls[j].color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';

                    this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';

                    this.velX = -(this.velX) + 1;
                    this.velY = -(this.velY);
                    balls[j].velX = (balls[j].velX);
                    balls[j].velY = (balls[j].velY)
                }
            }
        }
    }
}

let balls = [];
let i = balls.length;
for (i = 0; i < 10; i++) {
    let size = random(2, 10);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-9, 9),
        random(-9, 9),
        size,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')', true
    );

    balls.push(ball);
}

let dir = -10;
var pctOpen = 100;


class EvilCircle extends Shape {
    constructor(x, y, velX, velY, size) {
        super(x, y, velX, velY, size)
    }


    draw(pctOpen) {

        // Convert percent open to a float
        var fltOpen = pctOpen / 100;

        // An arc which stops at a specific percent to allow for the
        // open mouth to be drawn
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, (fltOpen * 0.2) * Math.PI, (2 - fltOpen * 0.2) * Math.PI);

        // The line leading back to the center and then closing the
        // path to finish the open mouth.
        ctx.lineTo(this.x, this.y);
        ctx.closePath();

        // Fill pacman's head yellow
        ctx.fillStyle = "#FF0";
        ctx.fill();

        // Outline the head
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // A circle for the eye
        var angle = Math.PI * (0.3 + fltOpen * 0.2),
            xDelta = (this.x + (this.size / 4)),
            yDelta = (this.y - (this.size / 2));
        ctx.beginPath();
        ctx.arc(xDelta, yDelta, this.size / 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.fill();

        // Outline the eye
        ctx.strokeStyle = '#FFF';
        ctx.stroke();
    }

    checkBounds() {
        if ((this.x + this.size) >= width) {
            this.x = width - this.size;
        }

        if ((this.x - this.size) <= 0) {
            this.x = this.size;
        }

        if ((this.y + this.size) >= height) {
            this.y = height - this.size;
        }

        if ((this.y - this.size) <= 0) {
            this.y = this.size;
        }
    }
    setControls() {

        this.x = window.event.clientX;
        this.y = window.event.clientY;
    }


    setControls2() {
        var touch = window.event.touches[0];
        this.x = Touch.clientX;
        this.y = Touch.clientY;
    }

    collisionDetect() {
        for (let j = 0; j < balls.length; j++) {
            if (!(this === balls[j]) && balls[j].exists) {
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + balls[j].size) {
                    balls[j].exists = false;
                    this.size += balls[j].size;
                    balls.splice(j, 1);
                    Audio1.play()
                    
                }
            }
        }
    }
}


let EvilCircle1 = new EvilCircle(15, 15, 10, 10, 10);

document.querySelector('canvas').onmousemove = function () { EvilCircle1.setControls() };

document.querySelector('canvas').ontouchmove = function () { EvilCircle1.setControls2() };


function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    EvilCircle1.draw(pctOpen += dir);
    if (pctOpen % 100 == 0) {
        dir = -dir;
    }
    EvilCircle1.checkBounds();
    EvilCircle1.collisionDetect()

    requestAnimationFrame(loop);
}

loop();


