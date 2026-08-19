// ზუსტი რიცხვების მიმდევრობა ზრდისას
const batterySteps = [1, 7, 11, 16, 21, 38, 45, 53, 63, 73, 77, 85, 91, 99, 100];
let stepIndex = 0; // მიმდინარე ინდექსი ზრდის მასივში
let currentPercent = 1; // მიმდინარე ზუსტი პროცენტი
let drainInterval = null;

// ====================================================
// აქ შეგიძლიათ დაამატო / შეცვალო სასურველი ტექსტები:
// ====================================================
const customTexts = [
  "You Bring Me Happiness! ✨",
  "I Love Listening To You! 🎧",
  "I Wanna Hug & Kiss You! 🧸",
  "I Miss You So Muuch! 🥰",
  "Can't Wait To See You! 💜",
  "Thinking of you every second of the day 💭"
  "I Love You The Most! 💜"
];

let textIndex = 0; // ტექსტების მიმდინარე ინდექსი

// ეკრანის და ტექსტების განახლება
function updateUI() {
  const fill = document.getElementById('battery-fill');
  const text = document.getElementById('battery-text');
  const status = document.getElementById('battery-status-msg');
  const reasonDisplay = document.getElementById('reason-display');

  text.innerText = currentPercent + '%';
  fill.style.width = Math.min(currentPercent, 100) + '%';

  // დინამიური სტატუსი პროცენტის მიხედვით
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

  // ქვედა ტექსტი იცვლება customTexts მასივიდან
  reasonDisplay.innerText = customTexts[textIndex];
}

// ბატარიაზე დაჭერის ფუნქცია
function tapBattery() {
  // 1. პროცენტის ზრდა
  if (stepIndex < batterySteps.length - 1) {
    stepIndex++;
    currentPercent = batterySteps[stepIndex];
  } else {
    currentPercent += 10;
  }
  
  // 2. ტექსტის გადართვა შემდეგზე (წრიულად)
  textIndex = (textIndex + 1) % customTexts.length;

  updateUI();
  resetDrainTimer(); // დაჭერისას ტაიმერი რესტარტდება
}

// ავტომატური დაკლების ტაიმერი (-1% ყოველ 2.5 წამში)
function startDrainTimer() {
  if (drainInterval) clearInterval(drainInterval);
  drainInterval = setInterval(() => {
    if (currentPercent > 1) {
      currentPercent--; // ჩამოაკლდეს 1-ით
      
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

// ინიციალიზაცია
document.getElementById('battery-btn').addEventListener('click', tapBattery);
updateUI();
startDrainTimer();

// ----------------------------------------------------
// ემოჯების სისტემა (ფონური + კლიკის ეფექტი)
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

// 1. ფონური ნელი ემოჯები
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

// 2. კლიკის დროს ამოხტომადი ემოჯები
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

// ეკრანზე კლიკისას ემოჯების გაჩენა
window.addEventListener('click', (e) => {
  for (let i = 0; i < 6; i++) {
    clickParticles.push(new ClickParticle(e.clientX, e.clientY));
  }
});

// ფონური ემოჯების შექმნა
for (let i = 0; i < 18; i++) {
  bgParticles.push(new BgParticle());
}

// ანიმაციის ციკლი
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