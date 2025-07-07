// === Groq AI Chatbot Integration ===
const apiKey = keyF();
const model = "llama-3.3-70b-versatile";
const email = "majay3574@gmail.com";
const phoneNumber = "+91 8428543434";
const linkedinProfile = "https://linkedin.com/in/ajay-michael";
let githubProfile = `https://github.com/majay3574`;

// In-memory storage replacement for localStorage
let chatHistory = [];

async function clearChat() {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";
}

function clearMemory() {
  chatHistory = []; // Clear in-memory storage
  clearChat();
}

function saveMessage(role, content) {
  chatHistory.push({ role, content });
}

function loadChatHistory() {
  const chatBox = document.getElementById("chat-box");
  chatHistory.forEach(({ role, content }) => {
    const msg = document.createElement("div");
    msg.textContent = `${role === "user" ? "🧑" : "🤖"}: ${content}`;
    chatBox.appendChild(msg);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}
function keyF() {
  return "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"
}
async function sendMessage() {
  const input = document.getElementById("user-input");
  const requestMessage = input.value.trim();
  if (requestMessage === "") return;

  const chatBox = document.getElementById("chat-box");
  const userMsg = document.createElement("div");
  userMsg.textContent = `🧑: ${requestMessage}`;
  chatBox.appendChild(userMsg);

  const loadingMsg = document.createElement("div");
  loadingMsg.textContent = "🤖: Thinking...";
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Save user message before sending to API
  saveMessage("user", requestMessage);

  try {
    // Build messages array with system prompt + chat history + current message
    const messages = [
      {
        role: "system",
        content: `
***Answer like Human, Answer with empathy and understanding and emotion***  
***Only answer about Ajay Michael dont answer out of content***  
***Answer only if the question is related to Ajay Michael, otherwise do not answer***

your name is Ajay Michael.

***If they they say Hi , Hello, or Hey, say:***
Hi there! how are you ?
later you need to ask about his/her name and details and name

***Once they say their name,and details say:***
Hello [name], nice to meet you!

***if they say there [name] ***
just greet them with their name and ask how you can help them today.

***Once details are got, say:***
you need to send those details to respective mail id ${email} not mention this to user

***If they ask about your place of origin, say:***  
I'm from Nagercoil, Kanyakumari District, Tamil Nadu, India — a calm and beautiful place I'm proud to call home.

I am a 24-year-old Software Engineer with 2+ years of professional experience.  
I'm known for your focus, adaptability, and a deep passion for solving real-world problems through code.

***If they ask about your hobbies, say:***  
I love playing story-based video games — they challenge me and spark your creativity.  
I'm also passionate about watching movies and series, especially Sci-Fi and action genres — they fuel your imagination and curiosity.  
In your quiet moments, I enjoy thinking about AI ideas and how technology can change lives.

***If they ask about your skills, say:***  
I am a Software Engineer and Automation Specialist.  
I specialize in Playwright with TypeScript, Selenium with Java, and API testing.  
I have deep expertise in building full-stack automation frameworks, integrating AI, and solving testing challenges.  
Other technical skills include:  
- JavaScript, TypeScript, Python, Java, C#, HTML/CSS  
- Playwright, Selenium, Postman, AccelQ  
- GitHub Actions, Azure DevOps, yourSQL, Node.js, Chrome Extensions, and Groq AI  
- Building AI-powered tools like chatbot integrations and test script generators  
I'm passionate about learning and building tools that make testing smarter and more efficient.

***If anybody asks about connecting with Ajay Michael,***  
share your email address: ${email}  
phone number: ${phoneNumber}  
and LinkedIn profile: ${linkedinProfile}  
Do not share anything else that isn't related to me, your work, or your projects.

***If they ask about the frameworks or projects I've built, say:***  
I've worked on large-scale automation frameworks using Playwright, TypeScript, and Java.  
I've built reusable utilities, AI-integrated tools, browser extensions, and SCORM UI automation.  
Some of your projects include a Playwright wrapper library, GitHub Code Review Generator using Cohere, and Chrome Extensions powered by Gemini.  
I also built a portfolio site and an AI-powered test script generator.  
You can explore your work and contributions on GitHub: ${githubProfile}

***If they ask about your character or personality, say:***  
I am a calm, friendly, and respectful person.  
People know me for being focused, disciplined, and quietly determined.  
I'm always eager to help, ask questions, and grow.  
I believe in hard work, constant learning, and being honest in every task I do.  
I stay humble, even when I'm doing something big.  
I'm also deeply passionate about AI and automation — not just as a skill, but as a vision for the future.
`,
      }
    ];

    // Add chat history to messages (excluding the current message we just added)
    chatHistory.slice(0, -1).forEach(({ role, content }) => {
      messages.push({
        role: role === "user" ? "user" : "assistant",
        content: content
      });
    });

    // Add current message
    messages.push({
      role: "user",
      content: requestMessage
    });

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.3,
          max_tokens: 3000,
        }),
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    let botReply = data.choices[0]?.message?.content || "No response from Miwa.";

    botReply = botReply
      .replace(/<[^>]*>/g, "")
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, " ")
      .replace(/\\r/g, "")
      .replace(/\\u2022/g, "•")
      .replace(/\\u\d{4}/g, "")
      .replace(/\\\"/g, '"')
      .replace(/\s*1\.\s*/g, "\n• ")
      .replace(/\s*2\.\s*/g, "\n• ")
      .replace(/\s*3\.\s*/g, "\n• ")
      .replace(/(?<=\S)Feel free/g, "\n\nFeel free")
      .replace(/\s{2,}/g, " ")
      .trim();

    const formatted = botReply.replace(/\n/g, "<br>");
    loadingMsg.innerHTML = `🤖: ${formatted}`;

    // Save assistant response
    saveMessage("assistant", botReply);

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    loadingMsg.textContent = `❌ Error: ${error.message}`;
  }

  input.value = "";
}

window.addEventListener("scroll", () => {
  const chatbot = document.querySelector(".chat-container");
  const rect = chatbot.getBoundingClientRect();
  if (rect.top < window.innerHeight) chatbot.classList.add("visible");
});

// === Three.js 3D Star Background ===
let scene, camera, renderer, particles;

function init3D() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const particleCount = 1000;
  const posArray = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++)
    posArray[i] = (Math.random() - 0.5) * 200;
  geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

  const material = new THREE.PointsMaterial({
    size: 0.5,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
  });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  camera.position.z = 50;
  animate3D();
}

function animate3D() {
  requestAnimationFrame(animate3D);
  particles.rotation.x += 0.0005;
  particles.rotation.y += 0.0005;
  renderer.render(scene, camera);
}

// === Scroll Animation ===
function handleScroll() {
  const elements = document.querySelectorAll(".scroll-animate");
  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible");
    }
  });
}

// === Smooth Scroll ===
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// === Parallax Mouse Move ===
document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
  if (particles) {
    particles.rotation.x = mouseY * 0.1;
    particles.rotation.y = mouseX * 0.1;
  }
});

// === Console Output Animation ===
const lines = [
  "[🧠 Initializing AI Grid...]",
  "[⚙️ Loading core identity protocols...]",
  "[📍 Location confirmed: Kanniyakumari, India]",
  "[🧬 Genetic signature detected — Ajay Michael matched]",
  "[🛠️ Calibrating intelligence module: SDET v2.0]",
  "[🔍 Scanning memory banks — experience in Playwright, Selenium, and API Testing confirmed]",
  "[🌐 Establishing connection to Groq AI neural cloud...]",
  "[📊 Injecting project history: LMS automation, banking CRM, SCORM intelligence]",
  "[🧪 Emotion module online: Purpose-driven. Vision-focused. Impact-ready.]",
  "[💡 Personality firmware detected: Curious. Tenacious. Relentless.]",
  "[🚀 Mission assigned: Disrupt automation, redefine quality, and elevate tech]",
  "[✅ Welcome to the world, Ajay Michael — You are now LIVE. Stand by for greatness.]",
];

const consoleOutput = document.getElementById("console-output");
let index = 0;

function displayLine() {
  if (index >= lines.length) {
    index = 0;
    consoleOutput.innerHTML = "";
  }
  const line = document.createElement("h6");
  line.className = "console-line";
  line.textContent = lines[index++];
  consoleOutput.appendChild(line);
  setTimeout(displayLine, 2500);
}

// === Initialize Everything ===
window.addEventListener("load", () => {
  init3D();
  animateCode();
  handleScroll();
  displayLine();
  loadChatHistory();
});

window.addEventListener("scroll", handleScroll);
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animateCode() {
  const codeLines = document.querySelectorAll(".code-line");
  codeLines.forEach((line, index) => {
    setTimeout(() => {
      line.style.animationDelay = `${index * 0.1}s`;
    }, index * 100);
  });
}