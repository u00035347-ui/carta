// CONFIGURACIÓN CON TU FECHA DE 6 DÍGITOS
let pinCode = "110926"; // Clave configurada a tu fecha 11/09/26
let hintText = "Nuestra fecha especial (DDMMAA)";
let enteredPin = "";

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    createHearts();
    
    // Cargar poema inicial en la ventana de edición
    const poemElem = document.getElementById('poemTextDisplay');
    if (poemElem && document.getElementById('cfgPoem')) {
        document.getElementById('cfgPoem').value = poemElem.innerText;
    }
});

// LÓGICA DEL TECLADO PIN PARA 6 DÍGITOS
function pressKey(num) {
    if (enteredPin.length < pinCode.length) {
        enteredPin += num;
        playBeep();
        updatePinDisplay();
    }

    if (enteredPin.length === pinCode.length) {
        setTimeout(checkPin, 200);
    }
}

function deleteKey() {
    if (enteredPin.length > 0) {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDisplay();
    }
}

function clearPin() {
    enteredPin = "";
    updatePinDisplay();
}

function updatePinDisplay() {
    for (let i = 0; i < pinCode.length; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (dot) {
            if (i < enteredPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        }
    }
}

function checkPin() {
    if (enteredPin === pinCode) {
        playSuccess();
        launchConfetti();
        document.getElementById('lockCard').style.display = 'none';
        document.getElementById('letterCard').style.display = 'block';
    } else {
        playError();
        alert('¡Contraseña incorrecta! Intenta de nuevo con nuestra fecha especial ❤️');
        clearPin();
    }
}

// EXPLOSIÓN DE CORAZONES AL PRESIONAR EL BOTÓN FINAL
function sendLoveExplosion() {
    launchConfetti();
    playSuccess();
    alert('¡Te he enviado un abrazo apretado y mil besos directo a tu corazón, mi reina! ❤️✨');
}

// MODAL DE CONFIGURACIÓN
function openConfigModal() {
    document.getElementById('cfgPin').value = pinCode;
    document.getElementById('cfgHint').value = hintText;
    document.getElementById('configModal').classList.add('active');
}

function saveConfiguration() {
    const newPin = document.getElementById('cfgPin').value.trim();
    const newHint = document.getElementById('cfgHint').value.trim();
    const newPoemText = document.getElementById('cfgPoem').value.trim();

    if (!isNaN(newPin) && newPin.length > 0) {
        pinCode = newPin;
    } else {
        alert('El PIN debe contener únicamente números.');
        return;
    }

    hintText = newHint;
    document.getElementById('hintText').innerText = hintText;

    // Actualizar poema en pantalla dividiendo por párrafos
    if (newPoemText) {
        const poemContainer = document.getElementById('poemTextDisplay');
        const stanzas = newPoemText.split('\n\n');
        poemContainer.innerHTML = '';

        stanzas.forEach((st, idx) => {
            const div = document.createElement('div');
            div.className = idx === stanzas.length - 1 ? 'stanza final-stanza' : 'stanza';
            div.innerHTML = st.replace(/\n/g, '<br>');
            poemContainer.appendChild(div);
        });
    }

    closeModal('configModal');
    alert('¡Cambios guardados con éxito! ✨');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// EFECTOS DE SONIDO (WEB AUDIO API)
function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(540, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
}

function playSuccess() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [261, 329, 392, 523, 659].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.09);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.09);
            osc.stop(ctx.currentTime + i * 0.09 + 0.25);
        });
    } catch(e) {}
}

function playError() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } catch(e) {}
}

// ANIMACIONES (CORAZONES Y CONFETI)
function createHearts() {
    const bg = document.getElementById('heartsBg');
    if (!bg) return;
    for (let i = 0; i < 22; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = (Math.random() * 6) + 's';
        heart.style.fontSize = (Math.random() * 16 + 14) + 'px';
        bg.appendChild(heart);
    }
}

function launchConfetti() {
    const cCanvas = document.getElementById('confettiCanvas');
    if (!cCanvas) return;
    const cCtx = cCanvas.getContext('2d');
    cCanvas.width = window.innerWidth;
    cCanvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#b7094c', '#ff4d6d', '#d4af37', '#ffffff', '#f7e7a1'];

    for (let i = 0; i < 90; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.7) * 14,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 110
        });
    }

    function animate() {
        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
        particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life--;

            cCtx.fillStyle = p.color;
            cCtx.beginPath();
            cCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            cCtx.fill();

            if (p.life <= 0) particles.splice(idx, 1);
        });

        if (particles.length > 0) requestAnimationFrame(animate);
    }
    animate();
}