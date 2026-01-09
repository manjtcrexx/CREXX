class LOGIQChatbot {
    constructor() {
        this.conversation = [];
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadConversation();
        this.addWelcomeMessage();
    }
    
    setupEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.querySelector('.chat-send');
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendMessage());
        }
    }
    
    loadConversation() {
        const saved = localStorage.getItem('logiq_chat');
        if (saved) {
            this.conversation = JSON.parse(saved);
            this.renderConversation();
        }
    }
    
    saveConversation() {
        localStorage.setItem('logiq_chat', JSON.stringify(this.conversation.slice(-50))); // Keep last 50 messages
    }
    
    addWelcomeMessage() {
        if (this.conversation.length === 0) {
            this.addBotMessage("Hello! I'm LOGIQ Assistant. I can help you with:\n• YouTube Automation tips\n• Content creation advice\n• AI tools guidance\n• Learning resources\nWhat would you like to know?");
        }
    }
    
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addUserMessage(message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI thinking
        setTimeout(async () => {
            await this.processMessage(message);
            this.hideTypingIndicator();
        }, 500 + Math.random() * 1000);
    }
    
    async processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        // YouTube Automation related
        if (lowerMessage.includes('youtube') || lowerMessage.includes('automation')) {
            response = this.getYouTubeResponse(lowerMessage);
        }
        // Content Creation related
        else if (lowerMessage.includes('content') || lowerMessage.includes('create') || lowerMessage.includes('video')) {
            response = this.getContentCreationResponse(lowerMessage);
        }
        // AI Tools related
        else if (lowerMessage.includes('ai') || lowerMessage.includes('tool') || lowerMessage.includes('chatgpt')) {
            response = this.getAIResponse(lowerMessage);
        }
        // Personal/About related
        else if (lowerMessage.includes('manjit') || lowerMessage.includes('nepal') || lowerMessage.includes('student')) {
            response = this.getPersonalResponse(lowerMessage);
        }
        // Greetings
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = "Hello! I'm LOGIQ Assistant. How can I help you with YouTube automation or content creation today?";
        }
        // Help
        else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
            response = "I can help you with:\n\n🎬 **YouTube Automation**\n• Channel setup & niche selection\n• Content planning & scheduling\n• Monetization strategies\n• Growth techniques\n\n🤖 **AI Tools**\n• Best AI tools for content creation\n• ChatGPT prompt engineering\n• AI video & image generation\n• Automation workflows\n\n📚 **Learning**\n• Beginner-friendly tutorials\n• Step-by-step guides\n• Resource recommendations\n• Career advice\n\nWhat specifically would you like to know?";
        }
        // Default response
        else {
            response = this.getDefaultResponse(lowerMessage);
        }
        
        // Add bot response
        this.addBotMessage(response);
        this.saveConversation();
    }
    
    getYouTubeResponse(message) {
        const responses = [
            "**Starting YouTube Automation:**\n1. Choose a profitable niche (Tech, Education, Finance)\n2. Plan 50+ video topics in advance\n3. Use AI tools for scripting & voiceover\n4. Batch create & schedule content\n5. Focus on SEO-optimized titles & descriptions\n\n💡 Pro Tip: Start with 3 videos per week for consistency.",
            
            "**Monetization Requirements:**\n• 1,000 subscribers\n• 4,000 watch hours in past year\n• AdSense account\n• Original content (no reused content)\n\n💰 Additional Income Streams:\n• Affiliate marketing\n• Sponsorships\n• Digital products\n• Channel memberships",
            
            "**Growth Strategies:**\n1. **Thumbnail Psychology:** Use faces, bright colors, clear text\n2. **Hook in First 15 Seconds:** Solve a problem immediately\n3. **SEO Optimization:** Research keywords with TubeBuddy/vidIQ\n4. **Community Engagement:** Reply to all comments in first hour\n5. **Cross-Promotion:** Share on social media & communities\n\n🔥 Quick Win: Study your competitors' most successful videos.",
            
            "**Time Management for Students:**\nAs a student creator myself (+2 level), here's my schedule:\n\n📅 **Weekly Plan:**\n• Monday: Research & Scripting (2 hours)\n• Tuesday: Recording (3 hours)\n• Wednesday: Editing (3 hours)\n• Thursday: Upload & SEO (1 hour)\n• Friday: Engagement & Planning (1 hour)\n\n💡 Batch create content on weekends to stay consistent!"
        ];
        
        if (message.includes('start') || message.includes('begin')) {
            return responses[0];
        } else if (message.includes('money') || message.includes('monetiz') || message.includes('earn')) {
            return responses[1];
        } else if (message.includes('grow') || message.includes('subscriber') || message.includes('view')) {
            return responses[2];
        } else if (message.includes('time') || message.includes('schedule') || message.includes('student')) {
            return responses[3];
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getContentCreationResponse(message) {
        const responses = [
            "**Content Creation Tools I Use:**\n🎥 **Recording:** OBS Studio (free)\n✂️ **Editing:** DaVinci Resolve (free) or Premiere Pro\n🎨 **Thumbnails:** Canva Pro or Photoshop\n📝 **Scripting:** ChatGPT for outlines, Google Docs for writing\n🗣️ **Voiceover:** ElevenLabs AI or own recording\n📊 **Analytics:** YouTube Studio + TubeBuddy",
            
            "**Script Structure That Works:**\n1. **Hook (0-15s):** Promise a solution/benefit\n2. **Problem (15-30s):** Explain the pain point\n3. **Solution Preview (30-60s):** Tease what you'll teach\n4. **Main Content (60s+):** Step-by-step tutorial\n5. **Call to Action (last 30s):** Subscribe & comment\n\n📝 Example: 'Struggling with YouTube growth? In this video, I'll show you 3 strategies that got me 1,000 subscribers in 30 days...'",
            
            "**Batch Creation Process:**\n1. **Day 1:** Research 10 video ideas\n2. **Day 2:** Write scripts for all 10 videos\n3. **Day 3:** Record all footage\n4. **Day 4:** Edit all videos\n5. **Day 5:** Create thumbnails & write descriptions\n6. **Schedule:** Upload with 1-day gaps\n\n🚀 This method saves 70% time compared to daily creation!"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getAIResponse(message) {
        const responses = [
            "**Essential AI Tools for Creators:**\n\n🤖 **ChatGPT/GPT-4:**\n• Script outlines & research\n• Title & description generation\n• Idea brainstorming\n• Code writing for automation\n\n🎨 **AI Image Generation:**\n• Midjourney for thumbnails\n• DALL-E for custom graphics\n• Stable Diffusion for variations\n\n🎬 **AI Video Tools:**\n• Pictory for text-to-video\n• RunwayML for editing\n• Synthesia for AI avatars\n\n📊 **AI Analytics:**\n• TubeBuddy AI suggestions\n• vidIQ score predictions\n• ChatGPT for strategy analysis",
            
            "**AI Automation Workflow:**\n1. **Research:** ChatGPT finds trending topics\n2. **Scripting:** AI expands outline into full script\n3. **Voiceover:** ElevenLabs generates human-like audio\n4. **Visuals:** Midjourney creates custom images\n5. **Editing:** AI tools compile everything\n6. **SEO:** AI suggests titles/description/tags\n\n⏱️ Time saved: 80% compared to manual process!",
            
            "**Free AI Tools to Start:**\n• **Canva Magic Studio:** AI design & writing\n• **ElevenLabs Free Tier:** 10,000 characters/month\n• **ChatGPT Free Version:** Basic AI assistance\n• **Pexels/Unsplash:** AI-sorted stock photos\n• **CapCut:** AI-powered video editing\n\n💡 Start with free tools, upgrade as you grow!"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getPersonalResponse(message) {
        const responses = [
            "**About Manjit (LOGIQ Creator):**\n\n🇳🇵 **From:** Nepal\n🎓 **Education:** +2 Level Student\n🎬 **Experience:** 1+ month YouTube automation\n⏱️ **Status:** Part-time content creator\n🎯 **Mission:** Helping others learn AI & tech\n\n💡 As a student from Nepal, I understand the challenges of starting with limited resources. That's why I focus on free/low-cost tools and efficient methods.",
            
            "**Why I Started LOGIQ:**\nAs a student in Nepal, I noticed:\n1. Limited access to quality tech education\n2. High costs of courses & tools\n3. Language barriers in technical content\n4. Lack of practical, beginner-friendly guides\n\n🚀 LOGIQ is my solution: Free, accessible tech education focused on practical skills that can create income opportunities.",
            
            "**Student Creator Advice:**\nBalancing studies + content creation:\n1. **Prioritize Education:** Schedule content around classes\n2. **Efficient Workflows:** Use AI to save time\n3. **Realistic Goals:** Aim for 1-2 quality videos/week\n4. **Learn Publicly:** Document your journey\n5. **Network:** Connect with other student creators\n\n📚 Remember: Your education comes first! Content creation should enhance your learning."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getDefaultResponse(message) {
        const responses = [
            "I'd be happy to help you with that! Could you tell me more about what specific aspect you're interested in? For example:\n• YouTube channel setup\n• Content creation tools\n• AI automation workflows\n• Learning resources\n• Monetization strategies",
            
            "That's an interesting question! Based on my experience with YouTube automation and AI tools, here's what I recommend:\n1. Start with clear goals\n2. Choose the right tools for your budget\n3. Focus on one platform initially\n4. Document your progress\n5. Iterate based on analytics\n\nWhat's your current experience level?",
            
            "Great question! From my journey as a student creator from Nepal, I've learned that success comes from:\n✅ Consistency over perfection\n✅ Learning in public\n✅ Using AI tools efficiently\n✅ Understanding your audience\n✅ Adapting to platform changes\n\nNeed more specific advice on any of these?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    addUserMessage(message) {
        this.conversation.push({
            type: 'user',
            text: message,
            time: new Date().toISOString()
        });
        
        this.renderMessage({
            type: 'user',
            text: message
        });
    }
    
    addBotMessage(message) {
        this.conversation.push({
            type: 'bot',
            text: message,
            time: new Date().toISOString()
        });
        
        this.renderMessage({
            type: 'bot',
            text: message
        });
    }
    
    renderMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        
        const avatar = message.type === 'bot' 
            ? '<i class="fas fa-robot"></i>'
            : '<i class="fas fa-user"></i>';
        
        // Convert markdown-like formatting to HTML
        const formattedText = this.formatMessage(message.text);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${formattedText}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    renderConversation() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        chatMessages.innerHTML = '';
        this.conversation.forEach(msg => {
            this.renderMessage(msg);
        });
    }
    
    formatMessage(text) {
        // Simple markdown parsing
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/\•/g, '•')
            .replace(/\✅/g, '✅')
            .replace(/\🎬/g, '🎬')
            .replace(/\🤖/g, '🤖')
            .replace(/\📚/g, '📚')
            .replace(/\💰/g, '💰')
            .replace(/\🔥/g, '🔥')
            .replace(/\💡/g, '💡')
            .replace(/\🚀/g, '🚀')
            .replace(/\⏱️/g, '⏱️')
            .replace(/\📅/g, '📅')
            .replace(/\🎥/g, '🎥')
            .replace(/\✂️/g, '✂️')
            .replace(/\🎨/g, '🎨')
            .replace(/\📝/g, '📝')
            .replace(/\🗣️/g, '🗣️')
            .replace(/\📊/g, '📊')
            .replace(/\🇳🇵/g, '🇳🇵')
            .replace(/\🎓/g, '🎓')
            .replace(/\🎯/g, '🎯')
            .replace(/\📌/g, '📌');
    }
    
    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        this.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        typingDiv.id = 'typing-indicator';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add typing indicator CSS
        if (!document.getElementById('typing-css')) {
            const style = document.createElement('style');
            style.id = 'typing-css';
            style.textContent = `
                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 10px;
                }
                .typing-indicator span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--text-muted);
                    animation: typing 1.4s infinite ease-in-out;
                }
                .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes typing {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
}

// ===== Global Functions for HTML onclick =====
let chatbot = null;

function initChatbot() {
    if (!chatbot) {
        chatbot = new LOGIQChatbot();
    }
    return chatbot;
}

function sendMessage() {
    const chatbot = initChatbot();
    chatbot.sendMessage();
}

function handleChatInput(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function askQuestion(question) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = question;
        sendMessage();
    }
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new LOGIQChatbot();
});
