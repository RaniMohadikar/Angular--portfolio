import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string;
  isImageLoading?: boolean;
  isTyping?: boolean;
}

@Component({
  selector: 'app-ai-chatbot',
  templateUrl: './ai-chatbot.component.html',
  styleUrls: ['./ai-chatbot.component.scss'],
  standalone: false
})
export class AiChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  userInput = '';
  messages: Message[] = [];
  isThinking = false;
  private msgId = 0;

  private quickReplies = [
    { label: '🧠 Skills & Tech', value: 'What are your skills?' },
    { label: '💼 Experience', value: 'Tell me about your experience' },
    { label: '🚀 Projects', value: 'What projects have you built?' },
    { label: '🎨 Generate Image', value: 'Generate an image of a futuristic city at night' },
  ];

  get chips() {
    return this.messages.length <= 1 ? this.quickReplies : [];
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      setTimeout(() => this.addBotMessage(
        "👋 Hi! I'm Rani's AI assistant. I can answer questions about skills, experience, and projects. I can also **generate images** for you! Try asking me anything."
      ), 400);
    }
  }

  sendMessage(text?: string) {
    const msg = text || this.userInput.trim();
    if (!msg) return;

    this.addUserMessage(msg);
    this.userInput = '';
    this.processInput(msg);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private addUserMessage(text: string) {
    this.messages.push({ id: ++this.msgId, text, sender: 'user', timestamp: new Date() });
  }

  private addBotMessage(text: string, imageUrl?: string, isImageLoading = false) {
    this.messages.push({
      id: ++this.msgId, text, sender: 'bot', timestamp: new Date(),
      imageUrl, isImageLoading
    });
  }

  private showTyping(): Promise<void> {
    this.isThinking = true;
    return new Promise(resolve => setTimeout(() => {
      this.isThinking = false;
      resolve();
    }, 1200 + Math.random() * 600));
  }

  private async processInput(input: string) {
    const lower = input.toLowerCase();
    const isImageRequest = /\b(generate|create|make|draw|show|paint|render|design)\b.*\b(image|photo|picture|art|illustration|drawing)\b|\bimage of\b|\bpicture of\b|\bdraw me\b|\bgenerate\b.*\b(a|an|the)\b/i.test(input)
      || /^(gen|img|image|generate) /i.test(input);

    if (isImageRequest) {
      await this.showTyping();
      const prompt = input.replace(/^(generate|create|make|draw|show|paint|render|design)\s+(an?\s+)?(image|photo|picture|art|illustration|drawing)\s+(of\s+)?/i, '').trim() || input;
      const msgId = ++this.msgId;
      this.messages.push({
        id: msgId,
        text: `🎨 Generating image: *"${prompt}"*...`,
        sender: 'bot',
        timestamp: new Date(),
        isImageLoading: true
      });
      const seed = Math.floor(Math.random() * 1000);
      setTimeout(() => {
        const idx = this.messages.findIndex(m => m.id === msgId);
        if (idx !== -1) {
          this.messages[idx].imageUrl = `https://picsum.photos/seed/${seed}/400/260`;
          this.messages[idx].isImageLoading = false;
          this.messages[idx].text = `✅ Here's your generated image: *"${prompt}"*`;
        }
      }, 2500);
      return;
    }

    await this.showTyping();

    if (/\b(hi|hello|hey|howdy|greetings|sup|what'?s up)\b/i.test(lower)) {
      this.addBotMessage("Hello! 👋 Great to meet you! I'm here to tell you all about Rani Mohadikar — a Sr. Software Engineer with 5+ years in Angular, React, Node.js, and AI/LLM systems. What would you like to know?");
    } else if (/\b(skill|tech|stack|language|framework|tool|know|expertise)\b/i.test(lower)) {
      this.addBotMessage(`🛠️ **Rani's Tech Stack:**\n\n• **Frontend:** Angular, React, TypeScript, HTML5/CSS3/SCSS\n• **Backend:** Node.js, Express, REST APIs\n• **AI/ML:** LLM integration, OpenAI, Langchain\n• **Databases:** MongoDB, PostgreSQL, Firebase\n• **DevOps:** Docker, CI/CD, Git, AWS\n• **Others:** PWA, WebSockets, Microservices`);
    } else if (/\b(experience|work|job|career|company|employer)\b/i.test(lower)) {
      this.addBotMessage(`💼 **Rani's Experience:**\n\n**Bluexkye** – Angular Developer & AI specialist, building healthcare AI systems.\n\n**NeoSoft** – Frontend Engineer on enterprise-scale React/Angular apps.\n\n**Medimaze** – Led development of medical data visualization dashboards.\n\n**Proclink & AnkHub** – Full-stack development and team mentorship.\n\nTotal: **5+ years** across fintech, healthcare, and AI domains.`);
    } else if (/\b(project|built|created|made|portfolio|work)\b/i.test(lower)) {
      this.addBotMessage(`🚀 **Featured Projects:**\n\n**AI Healthcare Dashboard** – Real-time patient monitoring with LLM-powered insights.\n\n**FinTech Analytics Platform** – Data visualization for financial metrics at scale.\n\n**Smart Recruitment Tool** – AI-driven candidate matching and screening.\n\n**IoT Control Panel** – Real-time device monitoring dashboard.\n\nAsk me to **generate an image** of any concept, or scroll down to see live demos! 👇`);
    } else if (/\b(contact|email|reach|hire|connect|linkedin)\b/i.test(lower)) {
      this.addBotMessage(`📬 **Get In Touch:**\n\n• **Email:** ranimohadikar22@gmail.com\n• **LinkedIn:** linkedin.com/in/ranimohadikar\n• **GitHub:** github.com/ranimohadikar\n\nRani is currently **open to new opportunities** and would love to hear from you!`);
    } else if (/\b(education|degree|study|college|university)\b/i.test(lower)) {
      this.addBotMessage("🎓 Rani holds a degree in Computer Science/Engineering and has continuously upskilled through certifications in Angular, cloud architecture, and AI/ML technologies.");
    } else if (/\b(about|who|tell me|introduce)\b/i.test(lower)) {
      this.addBotMessage("👨‍💻 Rani Mohadikar is a **Sr. Software Engineer** specializing in Angular, React, and AI/LLM systems with 5+ years of experience. He builds high-performance web applications for healthcare, fintech, and AI domains. Passionate about clean code, great UX, and cutting-edge technology.");
    } else if (/\b(thank|thanks|great|awesome|cool|nice|good)\b/i.test(lower)) {
      this.addBotMessage("You're welcome! 😊 Feel free to ask me anything else about Rani's work, or try asking me to **generate an image** — I love doing that!");
    } else {
      this.addBotMessage(`I'm not sure about that specifically, but I can tell you about:\n\n• 🧠 **Skills & Technologies**\n• 💼 **Work Experience**\n• 🚀 **Projects**\n• 📬 **Contact Info**\n• 🎨 **Generate Images** (try: "generate image of a robot")\n\nWhat interests you most?`);
    }
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch {}
  }

  formatText(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
}
