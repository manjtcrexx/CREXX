// ===== DOM Elements =====
const themeToggle = document.getElementById('theme-checkbox');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const typingText = document.getElementById('typingText');
const typingInput = document.getElementById('typingInput');
const typingSpeed = document.getElementById('typingSpeed');
const typingAccuracy = document.getElementById('typingAccuracy');
const typingTime = document.getElementById('typingTime');

// ===== Theme Toggle =====
function initTheme() {
    // Check saved theme or prefer dark
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    
    // Update toggle visual
    updateThemeToggle();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeToggle();
    updateToolColors();
}

function updateThemeToggle() {
    const isDark = document.body.classList.contains('dark-mode');
    const sun = document.querySelector('.sun');
    const moon = document.querySelector('.moon');
    
    if (sun && moon) {
        sun.style.opacity = isDark ? '0' : '1';
        moon.style.opacity = isDark ? '1' : '0';
    }
}

function updateToolColors() {
    // Update tool-specific colors if needed
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.style.transition = 'none';
        setTimeout(() => {
            card.style.transition = '';
        }, 10);
    });
}

// ===== Mobile Navigation =====
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// ===== Animated Counters =====
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.tool-card, .highlight-card, .stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== Typing Test Practice Texts =====
const typingTests = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "Practice makes perfect when learning to type fast.",
        "Start with simple sentences to build your speed.",
        "Typing is an essential skill for modern work."
    ],
    medium: [
        "JavaScript is a versatile programming language used for web development, mobile apps, and server-side programming.",
        "Artificial intelligence is transforming industries by automating tasks and providing intelligent insights.",
        "YouTube automation involves creating content using AI tools and strategic planning for maximum reach.",
        "Content creators from Nepal are making their mark in the global digital landscape."
    ],
    hard: [
        "The LOGIQ platform empowers aspiring creators with AI-driven tools and comprehensive tutorials on YouTube automation, content strategy, and digital skill development.",
        "Modern web development encompasses responsive design, progressive web apps, serverless architecture, and real-time data synchronization across multiple platforms.",
        "Machine learning algorithms, including neural networks and natural language processing, are revolutionizing how we interact with technology and process information.",
        "Successful digital entrepreneurship requires a combination of technical skills, market understanding, content creation, and consistent audience engagement strategies."
    ]
};

// ===== Tool Switching (Explore Page) =====
function initToolTabs() {
    const tabs = document.querySelectorAll('.explore-tab');
    const sections = document.querySelectorAll('.explore-section');
    
    if (tabs.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                }
            });
            
            // Animate section appearance
            const activeSection = document.getElementById(target);
            activeSection.style.opacity = '0';
            activeSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activeSection.style.opacity = '1';
                activeSection.style.transform = 'translateY(0)';
                activeSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, 10);
        });
    });
}

// ===== Page Transitions =====
function initPageTransitions() {
    const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not(.btn)');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Add page transition effect
                document.body.style.opacity = '0.7';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = link.getAttribute('href');
                }, 300);
            }
        });
    });
}

// ===== Form Handling =====
function initForms() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            
            // In a real application, you would send data to a server here
            console.log('Form data:', data);
        });
    }
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Theme toggle event
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
    
    // Initialize animations
    initAnimatedCounters();
    initScrollAnimations();
    initToolTabs();
    initPageTransitions();
    initForms();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ===== Window Events =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});
