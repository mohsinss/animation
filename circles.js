class Circle {
    constructor(x, y, radius, dx, dy, color, growRate, attractionForce) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.growRate = 0.05;
        this.attractionForce = 0.0001;
        this.friction = 0.9999999; // Adjust this value
        //this.letter = String.fromCharCode(Math.floor(random(65, 91)));
        const arabicLetters = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
        this.letter = arabicLetters[Math.floor(random(0, arabicLetters.length))];
    }
    

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
            // Draw the letter
    // ctx.font = `${Math.floor(this.radius * 0.7)}px Arial`;
    ctx.font = `${Math.floor(this.radius * 0.7)}px Arial`; // Use a font that supports Arabic characters
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.letter, this.x, this.y);
    }

    update(canvas, circles) {
        // Collision with borders
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        let isConnected = false;

        // Collision with other circles
        for (const circle of circles) {
            if (circle === this) continue;

            const dx = this.x - circle.x;
            const dy = this.y - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + circle.radius) {
                this.dx = -this.dx;
                this.dy = -this.dy;

                // Reduce circle size by 10%
            this.radius *= 0.99;
            circle.radius *= 0.99;
            }

            // Draw a line between circles when they're close
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(circle.x, circle.y);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.closePath();
                 // Apply attraction force
                const forceX = (circle.x - this.x) * this.attractionForce;
                const forceY = (circle.y - this.y) * this.attractionForce;

                this.dx += forceX;
                this.dy += forceY;

                circle.dx -= forceX;
                circle.dy -= forceY;

                isConnected = true;
            }
        }
        if (!isConnected) {
            this.dx *= this.friction;
            this.dy *= this.friction;
        }
        // Grow the circle slowly
        this.radius += this.growRate;
        this.x += this.dx;
        this.y += this.dy;
    }
}

const canvas = document.getElementById("circleCanvas");
const ctx = canvas.getContext("2d");

const circles = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createCircles(numCircles) {
    for (let i = 0; i < numCircles; i++) {
        const radius = random(10, 30);
        const x = random(radius, canvas.width - radius);
        const y = random(radius, canvas.height - radius);
        const dx = random(-1, 1);
        const dy = random(-1, 1);
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

        circles.push(new Circle(x, y, radius, dx, dy, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const circle of circles) {
        circle.draw(ctx);
        circle.update(canvas, circles);
    }

    requestAnimationFrame(animate);
}

createCircles(30);
animate();
