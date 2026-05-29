/**
 * Dubai School Admission Quiz - State & Core Logic
 */

// --- State Variables ---
let q1_nums = [0, 0];
let q2_nums = [0, 0];
let q3_nums = [0, 0];

let ans1 = "";
let ans2 = "";
let ans3 = "";

let test_submitted = false;

// --- Core Logic Functions ---

/**
 * Generates single-digit math problems:
 * Q1: Addition (A + B)
 * Q2: Subtraction (A - B) ensuring A >= B so results are non-negative
 * Q3: Multiplication (A * B)
 */
function generate_questions() {
    // Generate digits 0-9
    q1_nums = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    
    // Q2 Subtraction constraint check: A - B >= 0
    let a2 = Math.floor(Math.random() * 10);
    let b2 = Math.floor(Math.random() * 10);
    if (a2 < b2) {
        // Swap values to guarantee a2 >= b2
        let temp = a2;
        a2 = b2;
        b2 = temp;
    }
    q2_nums = [a2, b2];
    
    // Q3 Multiplication
    q3_nums = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
}

/**
 * Validates the student's inputs against correct outcomes.
 * Returns true if all answers are perfectly correct, false otherwise.
 * Safely defaults blank/null/undefined/non-numeric inputs to incorrect.
 */
function evaluate_results(u1, u2, u3) {
    // Check for empty or blank values
    if (u1 === undefined || u1 === null || u1.toString().trim() === "") return false;
    if (u2 === undefined || u2 === null || u2.toString().trim() === "") return false;
    if (u3 === undefined || u3 === null || u3.toString().trim() === "") return false;
    
    // Parse to numbers
    const num1 = Number(u1.toString().trim());
    const num2 = Number(u2.toString().trim());
    const num3 = Number(u3.toString().trim());
    
    // Ensure all parsed values are valid numbers
    if (isNaN(num1) || isNaN(num2) || isNaN(num3)) return false;
    
    // Check mathematical expressions
    const correct1 = q1_nums[0] + q1_nums[1];
    const correct2 = q2_nums[0] - q2_nums[1];
    const correct3 = q3_nums[0] * q3_nums[1];
    
    return (num1 === correct1) && (num2 === correct2) && (num3 === correct3);
}

// --- UI Binding and Reactivity ---

// Render and UI Sync
function update_ui() {
    const quizScreen = document.getElementById("quiz-screen");
    const outcomeScreen = document.getElementById("outcome-screen");
    
    if (!quizScreen || !outcomeScreen) return;
    
    if (test_submitted) {
        // Hide quiz screen, show results
        quizScreen.classList.add("hidden");
        outcomeScreen.classList.remove("hidden");
        
        // Evaluate inputs
        const passed = evaluate_results(ans1, ans2, ans3);
        const outcomeContainer = document.getElementById("outcome-container");
        
        if (passed) {
            outcomeContainer.className = "outcome-card pass-theme vstack animate-scale-up";
            outcomeContainer.innerHTML = `
                <div class="emoji-badge">🎉</div>
                <h2>Congratulations!</h2>
                <p>You passed the school admission quiz perfectly!</p>
                <div class="badge success-badge">Score: 3/3 (100%)</div>
                <button class="action-btn restart-btn" onclick="reset_quiz()">Try Again</button>
            `;
            // Trigger Confetti
            trigger_confetti();
        } else {
            outcomeContainer.className = "outcome-card fail-theme vstack animate-scale-up";
            outcomeContainer.innerHTML = `
                <div class="emoji-badge">💙</div>
                <h2>Thank you for trying!</h2>
                <p>Please see the administrator for your next steps.</p>
                <div class="badge fail-badge">Review Required</div>
                <button class="action-btn retry-btn" onclick="reset_quiz()">Try Again</button>
            `;
        }
    } else {
        // Show quiz screen, hide results
        quizScreen.classList.remove("hidden");
        outcomeScreen.classList.add("hidden");
        
        // Update question labels
        document.getElementById("q1-num1").innerText = q1_nums[0];
        document.getElementById("q1-num2").innerText = q1_nums[1];
        
        document.getElementById("q2-num1").innerText = q2_nums[0];
        document.getElementById("q2-num2").innerText = q2_nums[1];
        
        document.getElementById("q3-num1").innerText = q3_nums[0];
        document.getElementById("q3-num2").innerText = q3_nums[1];
        
        // Reset/sync input fields
        const input1 = document.getElementById("ans1-input");
        const input2 = document.getElementById("ans2-input");
        const input3 = document.getElementById("ans3-input");
        
        if (input1) input1.value = ans1;
        if (input2) input2.value = ans2;
        if (input3) input3.value = ans3;
        
        // Auto-focus on first input
        if (input1) input1.focus();
    }
}

// Reset quiz state
function reset_quiz() {
    ans1 = "";
    ans2 = "";
    ans3 = "";
    test_submitted = false;
    generate_questions();
    update_ui();
}

// Handle Form Submission
function submit_quiz() {
    // Capture latest inputs
    const input1 = document.getElementById("ans1-input");
    const input2 = document.getElementById("ans2-input");
    const input3 = document.getElementById("ans3-input");
    
    if (input1) ans1 = input1.value;
    if (input2) ans2 = input2.value;
    if (input3) ans3 = input3.value;
    
    test_submitted = true;
    update_ui();
}

// Confetti Effect for PASS state (using Canvas)
function trigger_confetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const colors = ["#4ade80", "#22c55e", "#15803d", "#facc15", "#eab308", "#38bdf8", "#0ea5e9"];
    const particleCount = 120;
    const particles = [];
    
    class Particle {
        constructor() {
            this.x = canvas.width / 2;
            this.y = canvas.height + 20;
            this.size = Math.random() * 8 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedX = Math.random() * 12 - 6;
            this.speedY = Math.random() * -18 - 8;
            this.gravity = 0.35;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.opacity = 1.0;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height / 2 && this.speedY > 0) {
                this.opacity -= 0.015;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    let animationFrameId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let alive = false;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.opacity > 0 && p.y < canvas.height + 50) {
                p.update();
                p.draw();
                alive = true;
            }
        }
        
        if (alive) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }
    
    animate();
    
    // Handle window resize during confetti animation
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, { once: true });
}

// Sanitize inputs in real time (restrict non-numeric values)
function setup_input_sanitization() {
    const inputs = ["ans1-input", "ans2-input", "ans3-input"];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Intercept input to remove any non-digit chars
            el.addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
            // Also prevent keypresses for non-digit keys except standard navigation
            el.addEventListener("keydown", (e) => {
                const allowed = [
                    "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Enter"
                ];
                if (allowed.includes(e.key)) return;
                
                // Allow digits only (both standard top row and numpad)
                const isDigit = /^[0-9]$/.test(e.key);
                if (!isDigit) {
                    e.preventDefault();
                }
            });
        }
    });
}

// Initial Setup when DOM loads
if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
        generate_questions();
        update_ui();
        setup_input_sanitization();
    });
}

// Export variables and methods for testing in Node environment
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = {
        q1_nums,
        q2_nums,
        q3_nums,
        get_ans1: () => ans1,
        set_ans1: (v) => ans1 = v,
        get_ans2: () => ans2,
        set_ans2: (v) => ans2 = v,
        get_ans3: () => ans3,
        set_ans3: (v) => ans3 = v,
        get_q1_nums: () => q1_nums,
        set_q1_nums: (v) => q1_nums = v,
        get_q2_nums: () => q2_nums,
        set_q2_nums: (v) => q2_nums = v,
        get_q3_nums: () => q3_nums,
        set_q3_nums: (v) => q3_nums = v,
        generate_questions,
        evaluate_results
    };
}
