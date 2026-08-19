// ზუსტი რიცხვების მიმდევრობა ზრდისას
const batterySteps = [1, 7, 11, 16, 21, 38, 45, 53, 63, 73, 77, 85, 91, 99, 100];
let stepIndex = 0; 
let currentPercent = 1; 
let drainInterval = null;
let hasBeenPressed = false; 
let modalTriggered = false; // თრექინგი 100%-ზე პოპაპისთვის

const customTexts = [
  "You Bring Me Happiness! ✨",
  "I Love Listening To You! 🎧",
  "I Wanna Hug & Kiss You! 🧸",
  "I Miss You So Muuch! 🥰",
  "Can't Wait To See You! 💜",
  "Thinking of you every second of the day 💭",
  "I Love You The Most! 💜"
];

let textIndex = 0; 

function updateUI() {
  const fill = document.getElementById('battery-fill');
  const text = document.getElementById('battery-text');
  const status = document.getElementById('battery-status-msg');
  const reasonDisplay = document.getElementById('reason-display');

  text.innerText = currentPercent + '%';
  fill.style.width = Math.min(currentPercent, 100) + '%';

  if (currentPercent < 20) {
    status.innerText = "Battery Low! Tap to charge my heart 🥺";
  } else if (currentPercent < 50) {
    status.innerText = "Warming up...⚡";
  } else if (currentPercent < 85) {
    status.innerText = "Lots of love coming in 💖";
  } else if (currentPercent < 100) {
    status.innerText = "Almost full! 🥰";
  } else {
    status.innerText = "Who am I kidding? I love you so much, it's never enough.♾️💜";
  }

  if (hasBeenPressed) {
    reasonDisplay.innerText = customTexts[textIndex];
    reasonDisplay.style.opacity = "1";
  } else {
    reasonDisplay.innerText = "";
    reasonDisplay.style.opacity = "0";
  }
}

function tapBattery() {
  if (stepIndex < batterySteps.length - 1) {
    stepIndex++;
    currentPercent = batterySteps[stepIndex];
  } else {
    currentPercent += 10;
  }
  
  if (!hasBeenPressed) {
    hasBeenPressed = true;
    textIndex = 0;
  } else {
    textIndex = (textIndex + 1) % customTexts.length;
  }

  updateUI();
  resetDrainTimer();

  // 100%-ის მიღწევისას პოპაპის ამოხტომა
  if (currentPercent >= 100 && !modalTriggered) {
    modalTriggered = true;
    setTimeout(() => {
      document.getElementById('love-modal').classList.remove('hidden');
    }, 400);
  }
}

function startDrainTimer() {
  if (drainInterval) clearInterval(drainInterval);
  drainInterval = setInterval(() => {
    if (currentPercent > 1) {
      currentPercent--;
      
      while (stepIndex > 0 && currentPercent < batterySteps[stepIndex]) {
        stepIndex--;
      }
      
      updateUI();
    }
  }, 2500); 
}

function resetDrainTimer() {
  startDrainTimer();
}

document.getElementById('battery-btn').addEventListener('click', tapBattery);
updateUI();
startDrainTimer();

// ----------------------------------------------------
// ემოჯების სისტემა
// ----------------------------------------------------
const canvas = document.getElementById('emoji-canvas');
const ctx = canvas.getContext('2d');
let bgParticles = [];
let clickParticles = [];
const emojis = ['💜', '✨', '💖', '🧸', '⚡', '🥰'];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class BgParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 30;
    this.size = Math.random() * 12 + 18;
    this.speedY = Math.random() * 1.2 + 0.6;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
    this.opacity = Math.random() * 0.4 + 0.2;
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.font = `${this.size}px sans-serif`;
    ctx.fillText(this.emoji, this.x, this.y);
    ctx.restore();
  }
}

class ClickParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 12 + 20;
    this.speedY = -(Math.random() * 3 + 2);
    this.speedX = (Math.random() - 0.5) * 4;
    this.gravity = 0.08;
    this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
    this.opacity = 1;
    this.fade = Math.random() * 0.02 + 0.015;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.opacity -= this.fade;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.font = `${this.size}px sans-serif`;
    ctx.fillText(this.emoji, this.x, this.y);
    ctx.restore();
  }
}

window.addEventListener('click', (e) => {
  for (let i = 0; i < 6; i++) {
    clickParticles.push(new ClickParticle(e.clientX, e.clientY));
  }
});

for (let i = 0; i < 18; i++) {
  bgParticles.push(new BgParticle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bgParticles.forEach(p => {
    p.update();
    p.draw();
  });

  clickParticles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.opacity <= 0) {
      clickParticles.splice(index, 1);
    }
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

// ----------------------------------------------------
// Slider Logic
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const missSlider = document.getElementById('miss-slider');
  const sliderValue = document.getElementById('slider-value');

  if (missSlider) {
    missSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val == 100) {
        sliderValue.innerText = "100000% ♾️💜";
      } else {
        sliderValue.innerText = val + "%";
      }
    });
  }
});

function submitSliderAnswer() {
  const slider = document.getElementById('miss-slider');
  const responseDiv = document.getElementById('modal-response');
  const val = Number(slider.value);

  if (val < 100) {
    // Stays open and shows sad response
    responseDiv.innerText = `Only ${val}%? I expected more... 🥺💔`;
  } else {
    // Maximum response + Emoji explosion + Closes
    responseDiv.innerText = "I knew it! I miss you 100000% too! 🥰💜";
    
    for (let i = 0; i < 30; i++) {
      clickParticles.push(new ClickParticle(window.innerWidth / 2, window.innerHeight / 2));
    }

    setTimeout(() => {
      document.getElementById('love-modal').classList.add('hidden');
      responseDiv.innerText = "";
    }, 2200);
  }
}
