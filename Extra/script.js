// ===== PASSCODE LOGIC =====
const CORRECT_PASSCODE = '0852';
let enteredDigits = [];

const dots = document.querySelectorAll('.dot');
const keys = document.querySelectorAll('.key[data-num]');
const passcodeScreen = document.getElementById('passcode-screen');
const flowerOverlay = document.getElementById('flower-overlay');
const flowerGarden = document.getElementById('flower-garden');
const mainContent = document.getElementById('main-content');
const bloomText = document.getElementById('bloom-text');

// Keypad button clicks
keys.forEach(key => {
    key.addEventListener('click', () => {
        const num = key.getAttribute('data-num');
        if (enteredDigits.length < 4) {
            enteredDigits.push(num);
            updateDots();

            if (enteredDigits.length === 4) {
                setTimeout(checkPasscode, 300);
            }
        }
    });
});

function updateDots() {
    dots.forEach((dot, index) => {
        if (index < enteredDigits.length) {
            dot.classList.add('filled');
            dot.classList.remove('error');
        } else {
            dot.classList.remove('filled', 'error');
        }
    });
}

function checkPasscode() {
    const entered = enteredDigits.join('');
    if (entered === CORRECT_PASSCODE) {
        // Correct passcode - start flower animation
        passcodeScreen.classList.add('hidden');
        setTimeout(startFlowerAnimation, 500);
    } else {
        // Wrong passcode - shake and reset
        dots.forEach(dot => dot.classList.add('error'));
        setTimeout(() => {
            enteredDigits = [];
            dots.forEach(dot => dot.classList.remove('error', 'filled'));
        }, 600);
    }
}

// ===== FLOWER BLOOM ANIMATION =====
function startFlowerAnimation() {
    flowerOverlay.classList.add('active');

    const flowers = document.querySelectorAll('.flower');
    const centerFlower = document.getElementById('center-flower');

    // Bloom center flower first
    setTimeout(() => {
        centerFlower.classList.add('bloom');
    }, 100);

    // Bloom surrounding flowers with staggered delays
    flowers.forEach(flower => {
        if (flower !== centerFlower) {
            const delay = parseFloat(flower.getAttribute('data-delay') || 0) * 1000;
            setTimeout(() => {
                flower.classList.add('bloom');
            }, delay + 200);
        }
    });

    // Show text after flowers bloom
    setTimeout(() => {
        bloomText.classList.add('show');
    }, 1200);

    // Create falling petals
    createFallingPetals();

    // Slide away after bloom completes
    setTimeout(() => {
        flowerGarden.classList.add('slide-away');
        setTimeout(() => {
            flowerOverlay.style.display = 'none';
            showMainContent();
        }, 1500);
    }, 3500);
}

function createFallingPetals() {
    const colors = ['#e8b4b8', '#f5d0d5', '#f0c4c8', '#e8c4c8', '#d4a574'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const petal = document.createElement('div');
            petal.className = 'petal fall';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.top = '-20px';
            petal.style.background = colors[Math.floor(Math.random() * colors.length)];
            petal.style.animationDelay = Math.random() * 2 + 's';
            petal.style.animationDuration = (3 + Math.random() * 2) + 's';
            petal.style.width = (10 + Math.random() * 15) + 'px';
            petal.style.height = (10 + Math.random() * 15) + 'px';
            flowerGarden.appendChild(petal);
        }, i * 150);
    }
}

// ===== MAIN CONTENT =====
function showMainContent() {
    mainContent.classList.add('show');
    createFloatingHearts();
}

function createFloatingHearts() {
    const hearts = ['\u2665', '\u2661', '\u273F', '\u2740'];
    setInterval(() => {
        if (document.hidden) return;
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '0';
        heart.style.color = ['#e8b4b8', '#d4a574', '#f5d0d5'][Math.floor(Math.random() * 3)];
        heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 4000);
    }, 2000);
}

// Keyboard support for passcode (type numbers on keyboard)
document.addEventListener('keydown', (e) => {
    if (!passcodeScreen.classList.contains('hidden')) {
        if (e.key >= '0' && e.key <= '9') {
            const key = document.querySelector(`.key[data-num="${e.key}"]`);
            if (key) key.click();
        }
    }
});