class TypingPractice {
    constructor() {
        this.currentTest = '';
        this.startTime = null;
        this.timerInterval = null;
        this.totalTime = 0;
        this.isActive = false;
        this.currentCharIndex = 0;
        this.errors = 0;
        this.totalChars = 0;
        
        this.init();
    }
    
    init() {
        this.loadNewTest();
        this.setupEventListeners();
    }
    
    loadNewTest() {
        const difficulty = document.getElementById('difficulty').value;
        const tests = typingTests[difficulty];
        const randomIndex = Math.floor(Math.random() * tests.length);
        this.currentTest = tests[randomIndex];
        
        const typingText = document.getElementById('typingText');
        typingText.innerHTML = '';
        
        // Create colored text display
        this.currentTest.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char';
            span.dataset.index = index;
            typingText.appendChild(span);
        });
        
        // Reset stats
        this.resetTest();
    }
    
    setupEventListeners() {
        const typingInput = document.getElementById('typingInput');
        const difficultySelect = document.getElementById('difficulty');
        
        typingInput.addEventListener('input', (e) => {
            if (!this.isActive) {
                this.startTest();
            }
            this.checkInput(e.target.value);
        });
        
        difficultySelect.addEventListener('change', () => {
            this.loadNewTest();
            typingInput.value = '';
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.startTest();
            }
            if (e.ctrlKey && e.key === 'r') {
                this.resetTest();
            }
        });
    }
    
    startTest() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 100);
        
        document.getElementById('typingInput').focus();
    }
    
    checkInput(input) {
        const chars = document.querySelectorAll('#typingText .char');
        this.totalChars = input.length;
        
        // Reset all char colors
        chars.forEach(char => {
            char.classList.remove('correct', 'incorrect', 'current');
        });
        
        // Check each character
        for (let i = 0; i < input.length; i++) {
            if (i < this.currentTest.length) {
                if (input[i] === this.currentTest[i]) {
                    chars[i].classList.add('correct');
                } else {
                    chars[i].classList.add('incorrect');
                    if (i === input.length - 1) {
                        this.errors++;
                    }
                }
            }
        }
        
        // Highlight current character
        if (input.length < this.currentTest.length) {
            chars[input.length].classList.add('current');
        }
        
        // Calculate accuracy
        const correctChars = input.split('').filter((char, i) => char === this.currentTest[i]).length;
        const accuracy = this.totalChars > 0 ? Math.round((correctChars / this.totalChars) * 100) : 100;
        
        // Calculate WPM (words per minute)
        const timeInMinutes = this.totalTime / 60000;
        const words = input.trim().split(/\s+/).length;
        const wpm = timeInMinutes > 0 ? Math.round(words / timeInMinutes) : 0;
        
        // Update display
        document.getElementById('typingSpeed').textContent = `${wpm} WPM`;
        document.getElementById('typingAccuracy').textContent = `${accuracy}%`;
        
        // Check if test is complete
        if (input.length >= this.currentTest.length) {
            this.endTest();
        }
    }
    
    updateTimer() {
        if (!this.startTime) return;
        
        this.totalTime = Date.now() - this.startTime;
        const seconds = Math.floor(this.totalTime / 1000);
        const milliseconds = Math.floor((this.totalTime % 1000) / 10);
        
        document.getElementById('typingTime').textContent = `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
    }
    
    endTest() {
        this.isActive = false;
        clearInterval(this.timerInterval);
        
        // Calculate final stats
        const wpm = Math.round((this.currentTest.split(/\s+/).length) / (this.totalTime / 60000));
        const accuracy = Math.round(((this.totalChars - this.errors) / this.totalChars) * 100);
        
        // Show results
        setTimeout(() => {
            showNotification(`Test Complete! ${wpm} WPM, ${accuracy}% accuracy`, 'success');
            
            // Auto-load new test after delay
            setTimeout(() => {
                this.loadNewTest();
                document.getElementById('typingInput').value = '';
            }, 2000);
        }, 500);
    }
    
    resetTest() {
        this.isActive = false;
        this.startTime = null;
        this.totalTime = 0;
        this.errors = 0;
        this.totalChars = 0;
        
        clearInterval(this.timerInterval);
        
        document.getElementById('typingSpeed').textContent = '0 WPM';
        document.getElementById('typingAccuracy').textContent = '100%';
        document.getElementById('typingTime').textContent = '0s';
        
        const typingInput = document.getElementById('typingInput');
        typingInput.value = '';
        typingInput.focus();
        
        // Reset char colors
        const chars = document.querySelectorAll('#typingText .char');
        chars.forEach(char => {
            char.classList.remove('correct', 'incorrect', 'current');
        });
        
        if (chars[0]) {
            chars[0].classList.add('current');
        }
    }
}

// ===== Global Functions for HTML onclick =====
function startTypingTest() {
    if (!window.typingPractice) {
        window.typingPractice = new TypingPractice();
    }
    window.typingPractice.startTest();
    document.getElementById('typingInput').focus();
}

function resetTypingTest() {
    if (window.typingPractice) {
        window.typingPractice.resetTest();
    } else {
        window.typingPractice = new TypingPractice();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.typingPractice = new TypingPractice();
    
    // Add CSS for typing colors
    const style = document.createElement('style');
    style.textContent = `
        .char.correct { color: #10b981; }
        .char.incorrect { color: #ef4444; text-decoration: underline; }
        .char.current { background: rgba(99, 102, 241, 0.2); position: relative; }
        .char.current::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: #6366f1;
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
