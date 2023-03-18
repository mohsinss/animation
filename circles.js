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
        this.friction = 0.70;
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
        
            // Create a color-changing effect using Math.sin() and Date.now()
            const colorShift = (Math.sin(Date.now() * 0.002) + 1) / 2;
            const red = 255 * colorShift;
            const blue = 255 * (1 - colorShift);
            ctx.strokeStyle = `rgba(${red}, 20, ${blue}, 0.8)`; // Flashing between blue and pink
        
            ctx.lineWidth = 5;
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

    // Apply the flashing effect to the letter
    if (this === largestCircle) {
        const colorShift = (Math.sin(Date.now() * 0.002) + 1) / 2;
        const red = 255 * colorShift;
        const blue = 255 * (1 - colorShift);
        ctx.fillStyle = `rgba(${red}, 20, ${blue}, 0.8)`; // Flashing between blue and pink
    } else {
        ctx.fillStyle = 'white';
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.letter, this.x, this.y);
}
    

    update(canvas, circles) {
    
            // Collision with borders
            let borderCollision = false;
            if (this.x + this.radius > canvas.width) {
                this.x = canvas.width - this.radius;
                this.dx = -this.dx;
                borderCollision = true;
            } else if (this.x - this.radius < 0) {
                this.x = this.radius;
                this.dx = -this.dx;
                borderCollision = true;
            }
            if (this.y + this.radius > canvas.height) {
                this.y = canvas.height - this.radius;
                this.dy = -this.dy;
                borderCollision = true;
            } else if (this.y - this.radius < 0) {
                this.y = this.radius;
                this.dy = -this.dy;
                borderCollision = true;
            }
    
            if (borderCollision) {
                this.radius *= 0.9;
            }
    
        let isConnected = false;
        const largestCircle = getLargestCircle();

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
        } else {
            // Make the largest circle run away from the rest of the circles
            for (const circle of circles) {
                if (circle === this) continue;
    
                const dx = this.x - circle.x;
                const dy = this.y - circle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance < this.radius + circle.radius + 100) {
                    const forceX = dx * this.attractionForce * 4;
                    const forceY = dy * this.attractionForce * 4;
    
                    this.dx += forceX;
                    this.dy += forceY;
                }
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
let previousLargestCircle = null;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const circle of circles) {
        circle.draw(ctx);
        circle.update(canvas, circles);
    }
    const currentLargestCircle = getLargestCircle();
    if (previousLargestCircle !== currentLargestCircle) {
        previousLargestCircle = currentLargestCircle;
        flashBorder();
    }
    updateCollisionList(); // Update the list of circles and their collision counts
    requestAnimationFrame(animate);
}


function flashBorder() {
    const borderFlashDuration = 500; // milliseconds
    canvas.style.border = '5px solid yellow';

    setTimeout(() => {
        canvas.style.border = '5px solid green';
    }, borderFlashDuration);
}
// Add a function to update the list of circles and their collision counts
function updateCollisionList() {
    const collisionList = document.getElementById("collisionList");
    collisionList.innerHTML = "";

    // Calculate the total number of collisions
    const totalCollisions = circles.reduce((total, circle) => total + circle.collisionCounter, 0);

    for (const circle of circles) {
        const listItem = document.createElement("li");

        // Calculate the percentage of collisions for the current circle
        const collisionPercentage = totalCollisions === 0 ? 0 : ((circle.collisionCounter / totalCollisions) * 100).toFixed(2);

        listItem.textContent = `Circle ${circles.indexOf(circle) + 1}: ${collisionPercentage}%`;
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
