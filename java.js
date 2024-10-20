const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Create text particles with an ocean theme
function createTextParticles(x, y, numTexts) {
    const particles = [];
    const colors = ['#1abc9c', '#16a085', '#3498db', '#2980b9', '#2ecc71', '#27ae60'];

    for (let i = 0; i < numTexts; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1; // Slower speed for bouncing effect
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = Math.random() * 20 + 10; // Random size for text
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Create a particle with properties
        particles.push({ x, y, vx, vy, size, color, alpha: 1, lifetime: 100 });
    }

    return particles;
}

// Draw the text particles with a glowing effect
function drawText(particle) {
    ctx.save();
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.font = `${particle.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Happy Monthsary, Oceans!', particle.x, particle.y);
    ctx.restore();
}

// Animate the text and display the message
function burstTextWithMessage() {
    const particles = [];
    const numTexts = 30; // Number of texts per burst
    let messageAlpha = 1; // Controls message fade-out
    const fadeOutDuration = 100; // Duration for the message fade-out (frames)

    // Create bursts at random positions across the screen
    for (let i = 0; i < 5; i++) { // Number of bursts
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(...createTextParticles(x, y, numTexts));
    }

    let alpha = 0; // Controls message fade-in

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Animate particles
        particles.forEach((particle) => {
            // Bounce off the edges of the canvas
            if (particle.x <= 0 || particle.x >= canvas.width) {
                particle.vx *= -1; // Reverse x velocity
            }
            if (particle.y <= 0 || particle.y >= canvas.height) {
                particle.vy *= -1; // Reverse y velocity
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Reduce alpha
            particle.alpha -= 0.005; // Gradually fade out

            if (particle.alpha > 0) drawText(particle);
        });

        // Display the message with a glowing effect
        if (alpha < 1) alpha += 0.01; // Gradually increase opacity
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'cyan'; // Ocean color glow
        ctx.shadowBlur = 20;
        ctx.fillText('Happy Monthsary, Oceans!', canvas.width / 2, canvas.height / 2);
        ctx.restore();

        // Control the fade-out of the message
        if (particles.every((p) => p.alpha <= 0)) {
            if (messageAlpha > 0) {
                messageAlpha -= 1 / fadeOutDuration; // Decrease message opacity
            }
            ctx.save();
            ctx.globalAlpha = messageAlpha;
            ctx.fillStyle = 'white';
            ctx.fillText('Happy Monthsary, Oceans!', canvas.width / 2, canvas.height / 2);
            ctx.restore();
        }

        // Continue animation until all particles are gone and the message is faded out
        if (particles.some((p) => p.alpha > 0) || messageAlpha > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// Trigger the text burst and message on button click
document.getElementById('surpriseBtn').addEventListener('click', () => {
    burstTextWithMessage();
});
