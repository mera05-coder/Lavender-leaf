const contentArea = document.getElementById('step-content');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const progressFill = document.getElementById('progress-fill');
const stepLabel = document.getElementById('current-step');
const percentText = document.getElementById('percent-text');

let currentStep = 1;
const totalSteps = 5;

// --- AI CONFIGURATION ---
const API_KEY = "AIzaSyDlIQZ-XUGLxnlPzapXWJDVu3ZJ5n2sar4"; 

async function getAIPlan() {
    const output = document.getElementById('ai-plan-output');
    
    // Capture user data for the prompt
    const name = document.getElementById('user-name')?.value || "Traveler";
    const goal = document.querySelector('.option-card.active')?.innerText.split('\n')[0] || "General Health";
    const diet = document.querySelector('.btn-option.active')?.innerText || "None";

    const prompt = `Act as a wellness coach for 'Lavender Leaf'. Create a 4-bullet point plan for ${name}. Goal: ${goal}. Diet: ${diet}. Keep it calm and healing.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        output.innerText = data.candidates[0].content.parts[0].text;
    } catch (e) {
        output.innerText = "The AI is currently offline, but remember: hydration and sleep are the foundations of equilibrium!";
    }
}

function updateUI() {
    contentArea.innerHTML = '';
    const template = document.getElementById(`template-step-${currentStep}`);
    if (template) {
        const clone = template.content.cloneNode(true);
        contentArea.appendChild(clone);
    }

    // Step 6: Trigger AI Results
    if (currentStep === 6) {
        document.getElementById('app-footer').style.display = 'none';
        document.getElementById('progress-area').style.display = 'none';
        document.getElementById('header-desc').style.display = 'none';
        getAIPlan();
    }

    // Update Progress
    if (currentStep <= totalSteps) {
        const progressPercent = (currentStep / totalSteps) * 100;
        progressFill.style.width = progressPercent + '%';
        percentText.innerText = progressPercent + '%';
        stepLabel.innerText = currentStep;
    }

    backBtn.style.visibility = (currentStep === 1 || currentStep === 6) ? 'hidden' : 'visible';
    nextBtn.innerText = (currentStep === 5) ? 'Generate AI Plan ✨' : 'Continue';
}

// Global listener for buttons
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-option, .option-card');
    if (btn) {
        btn.parentElement.querySelectorAll('.btn-option, .option-card').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
});

nextBtn.addEventListener('click', () => { if (currentStep < 6) { currentStep++; updateUI(); } });
backBtn.addEventListener('click', () => { if (currentStep > 1) { currentStep--; updateUI(); } });

updateUI();