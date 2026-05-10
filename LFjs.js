const contentArea = document.getElementById('step-content');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const progressFill = document.getElementById('progress-fill');
const stepLabel = document.getElementById('current-step');
const percentText = document.getElementById('percent-text');

let currentStep = 1;
const totalSteps = 5;

// --- AI CONFIGURATION ---
const API_KEY = "AIzaSyDLIQZ-XUGLxnlPzapXWJDVu3ZJ5n2sar4"; 

async function getAIPlan() {
    console.log("🚀 getAIPlan() called, currentStep:", currentStep);
    
    // Select the three different output boxes
    const nutritionBox = document.getElementById('nutrition-output');
    const workoutBox = document.getElementById('workout-output');
    const mentalBox = document.getElementById('mental-output');
    
    console.log("📦 Elements found:", {
        nutrition: !!nutritionBox,
        workout: !!workoutBox,
        mental: !!mentalBox
    });
    
    // Check if elements exist
    if (!nutritionBox || !workoutBox || !mentalBox) {
        console.error("❌ Output elements not found in DOM");
        return;
    }
    
    // Capture user data for the prompt
    const name = document.getElementById('user-name')?.value || "User";
    const goal = document.querySelector('.option-card.active')?.innerText.split('\n')[0] || "General Health";
    const diet = document.querySelector('.btn-option.active')?.innerText || "Standard";

    console.log("👤 User data captured:", { name, goal, diet });

    // This prompt asks the AI to separate sections with "###" so we can split them
    const prompt = `Act as a wellness coach. Create a plan for ${name}. Goal: ${goal}. Diet: ${diet}.
    Format exactly like this:
    Nutrition: (2 bullet points)
    ###
    Workout: (2 bullet points)
    ###
    Mental Health: (2 bullet points)`;

    try {
        console.log("🔄 Sending request to Gemini API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        console.log("📡 Response status:", response.status);
        const data = await response.json();
        console.log("📥 API Response:", data);
        
        const fullText = data.candidates[0].content.parts[0].text;
        console.log("📝 Full AI text:", fullText);

        // Split the text based on the ### divider
        const sections = fullText.split('###');
        console.log("✂️ Sections split:", sections.length);
        
        // Inject sections into the three windows
        nutritionBox.innerText = sections[0]?.trim() || "Building your nutrition plan...";
        workoutBox.innerText = sections[1]?.trim() || "Designing your workout...";
        mentalBox.innerText = sections[2]?.trim() || "Setting your mental goals...";
        
        console.log("✅ AI Plan successfully generated!");

    } catch (e) {
        console.error("❌ AI Fetch Error:", e);
        // Fallback "Smart" plan if the AI is offline
        nutritionBox.innerText = `• Follow ${diet} guidelines\n• Prioritize lean proteins`;
        workoutBox.innerText = `• 20 min walk focused on ${goal}\n• Daily stretching routine`;
        mentalBox.innerText = "• 5 min mindful breathing\n• Track your water intake";
    }
}

function updateUI() {
    console.log("🔄 updateUI() called, currentStep:", currentStep);
    
    contentArea.innerHTML = '';
    const template = document.getElementById(`template-step-${currentStep}`);
    
    if (template) {
        const clone = template.content.cloneNode(true);
        contentArea.appendChild(clone);
        console.log("✅ Template loaded: template-step-" + currentStep);
    } else {
        console.error("❌ Template not found: template-step-" + currentStep);
    }

    // Step 6 is the Results Dashboard
    if (currentStep === 6) {
        console.log("📊 Showing results page (step 6)");
        document.getElementById('app-footer').style.display = 'none';
        document.getElementById('progress-area').style.display = 'none';
        document.getElementById('header-desc').style.display = 'none';
        
        // Use setTimeout to ensure DOM elements are ready
        setTimeout(() => {
            console.log("⏰ Timeout completed, calling getAIPlan()");
            getAIPlan();
        }, 100);
    } else {
        // Show navigation elements for other steps
        document.getElementById('app-footer').style.display = 'flex';
        document.getElementById('progress-area').style.display = 'block';
        document.getElementById('header-desc').style.display = 'block';
    }

    // Progress Bar Updates
    if (currentStep <= totalSteps) {
        const progressPercent = (currentStep / totalSteps) * 100;
        progressFill.style.width = progressPercent + '%';
        percentText.innerText = progressPercent + '%';
        stepLabel.innerText = currentStep;
    }

    // Navigation Button Visibility
    backBtn.style.visibility = (currentStep === 1 || currentStep === 6) ? 'hidden' : 'visible';
    nextBtn.innerText = (currentStep === 5) ? 'Generate AI Plan ✨' : 'Continue';
}

// Global click listener for selection buttons (Gender/Activity/Goals)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-option, .option-card');
    if (btn) {
        const parent = btn.parentElement;
        parent.querySelectorAll('.btn-option, .option-card').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
});

// Next Button Click
nextBtn.addEventListener('click', () => {
    console.log("➡️ Next button clicked, currentStep:", currentStep);
    if (currentStep <= totalSteps) {
        currentStep++;
        console.log("📍 Advanced to step:", currentStep);
        updateUI();
    } else {
        console.log("⚠️ Already at max step");
    }
});

// Back Button Click
backBtn.addEventListener('click', () => {
    console.log("⬅️ Back button clicked, currentStep:", currentStep);
    if (currentStep > 1) {
        currentStep--;
        console.log("📍 Went back to step:", currentStep);
        updateUI();
    }
});

// Launch the first step
console.log("🌿 Lavender Leaf App initialized");
updateUI();
