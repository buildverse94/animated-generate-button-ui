const pillBtn = document.getElementById("pillBtn");
const glowAura = document.getElementById("glowAura");
const flashOverlay = document.getElementById("flashOverlay");

let isGlowing = true;

// Toggle State Function (Light Flash Sequence)
function toggleGlowState() {
  isGlowing = !isGlowing;

  // Trigger Light Flash Overlay Animation
  flashOverlay.classList.remove("active");
  void flashOverlay.offsetWidth; // Force reflow
  flashOverlay.classList.add("active");

  if (isGlowing) {
    pillBtn.classList.remove("dimmed");
    glowAura.classList.remove("dimmed");
    createBurstParticles();
  } else {
    pillBtn.classList.add("dimmed");
    glowAura.classList.add("dimmed");
  }
}

pillBtn.addEventListener("click", toggleGlowState);

/* Canvas Ambient Particle Effect */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

class Particle {
  constructor(x, y, isBurst = false) {
    this.x = x || Math.random() * width;
    this.y = y || Math.random() * height;
    this.size = isBurst ? Math.random() * 3.5 + 1.5 : Math.random() * 2 + 0.5;
    this.speedX = isBurst
      ? (Math.random() - 0.5) * 7
      : (Math.random() - 0.5) * 0.4;
    this.speedY = isBurst
      ? (Math.random() - 0.5) * 7
      : (Math.random() - 0.5) * 0.4 - 0.2;
    this.opacity = isBurst ? 1 : Math.random() * 0.6 + 0.1;
    this.fadeSpeed = isBurst ? Math.random() * 0.02 + 0.015 : 0;
    this.color = isBurst
      ? `hsla(${270 + Math.random() * 40}, 100%, ${75 + Math.random() * 25}%, `
      : `hsla(${260 + Math.random() * 30}, 85%, 75%, `;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.fadeSpeed > 0) {
      this.opacity -= this.fadeSpeed;
    } else {
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
  }

  draw() {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.opacity + ")";
    ctx.shadowBlur = this.size * 4;
    ctx.shadowColor = "#c084fc";
    ctx.fill();
    ctx.restore();
  }
}

const particles = [];
const particleCount = 70;

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function createBurstParticles() {
  const rect = pillBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 35; i++) {
    particles.push(new Particle(centerX, centerY, true));
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].fadeSpeed > 0 && particles[i].opacity <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
