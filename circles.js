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
        this.friction = 0.70; // Adjust this value
        //this.letter = String.fromCharCode(Math.floor(random(65, 91)));
        // const arabicLetters = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
        const arabicLetters = "ABIGAEL";
        this.collisionCounter = 0;

        this.letter = arabicLetters[Math.floor(random(0, arabicLetters.length))];
    }
    

    draw(ctx) {
        const largestCircle = getLargestCircle();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        
        if (this === largestCircle) {
            ctx.fillStyle = 'rgba(40, 300, 255, 0.8)'; // Shiny blue
            ctx.strokeStyle = 'rgba(255, 20, 147, 0.8)'; // Pink
            ctx.lineWidth = 2;
        } else {
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0.5;
        }
        
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    
        // Draw the letter
        ctx.font = `${Math.floor(this.radius * 0.7)}px Arial`;
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
        const largestCircle = getLargestCircle();
    
        // Attract other circles to collide with the largest circle
        if (this !== largestCircle) {
            const dx = largestCircle.x - this.x;
            const dy = largestCircle.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance > largestCircle.radius + this.radius) {
                const forceX = dx * this.attractionForce * 2;
                const forceY = dy * this.attractionForce * 2;
    
                this.dx += forceX;
                this.dy += forceY;
            }
        }
    
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
                // Increment the collisionCounter for both circles
                this.collisionCounter++;
                circle.collisionCounter++;
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

function getLargestCircle() {
    return circles.reduce((largest, circle) => {
        return circle.radius > largest.radius ? circle : largest;
    }, circles[0]);
}
function getSecondLargestCircle() {
    const sortedCircles = [...circles].sort((a, b) => b.radius - a.radius);
    return sortedCircles[1];
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
    updateCollisionList(); // Update the list of circles and their collision counts
    requestAnimationFrame(animate);
}
// Add a function to update the list of circles and their collision counts
function updateCollisionList() {
    const collisionList = document.getElementById("collisionList");
    collisionList.innerHTML = "";

    for (const circle of circles) {
        const listItem = document.createElement("li");
        listItem.textContent = `Circle ${circles.indexOf(circle) + 1}: ${circle.collisionCounter} collisions`;
        collisionList.appendChild(listItem);
    }
}

// Add an HTML element to display the list of circles and their collision counts
const circleListContainer = document.createElement("div");
circleListContainer.innerHTML = `
    <h3>Collision List</h3>
    <ul id="collisionList"></ul>
`;

document.body.appendChild(circleListContainer);

function resetAnimation() {
    circles.length = 0;
    createCircles(30);
}

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetAnimation);


createCircles(10);
animate();
