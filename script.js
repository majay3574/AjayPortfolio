const emailAddress = "majay3574@gmail.com";

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.getAttribute("data-open") === "true";
    navMenu.setAttribute("data-open", String(!isOpen));
    navToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.setAttribute("data-open", "false");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

const statCounters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

statCounters.forEach((counter) => counterObserver.observe(counter));

function animateCount(element) {
  const target = Number(element.dataset.count || "0");
  const suffix = element.dataset.suffix || "";
  const duration = 1200;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

const consoleOutput = document.getElementById("console-output");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const consoleLines = [
  "[Initializing automation lab]",
  "[Loading QA strategy modules]",
  "[Connecting Playwright and Selenium pipelines]",
  "[Stabilizing selectors and environments]",
  "[Measuring coverage and reliability]",
  "[AI utilities ready for reporting and insights]",
  "[Quality system online - ready for release]"
];

let consoleIndex = 0;

function renderConsoleLines() {
  if (!consoleOutput) return;

  if (prefersReducedMotion) {
    consoleOutput.innerHTML = consoleLines.map((line) => `<div>${line}</div>`).join("");
    return;
  }

  const line = document.createElement("div");
  line.textContent = consoleLines[consoleIndex];
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
  consoleIndex = (consoleIndex + 1) % consoleLines.length;

  if (consoleOutput.children.length > consoleLines.length) {
    consoleOutput.removeChild(consoleOutput.firstChild);
  }

  setTimeout(renderConsoleLines, 2200);
}

renderConsoleLines();

const chatWidget = document.getElementById("ask");
const chatLauncher = document.getElementById("chat-launcher");
const chatClose = document.getElementById("chat-close");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatClear = document.getElementById("chat-clear");

const model = "llama-3.3-70b-versatile";
const chatHistory = [];

const keyPartA = "gsk_3Nhj4SoPyLpToU808mWtWGdyb3";
const keyPartB = "FYLGVE3hT8AgYFI28hc23K4O3S";

function getGroqKey() {
  return `${keyPartA}${keyPartB}`;
}

const systemPrompt =
  "You are Ajay Michael, a Software Development Engineer in Test. " +
  "Answer in the first person as Ajay. Keep answers concise, friendly, and focused on Ajay's skills, projects, and experience. " +
  "If a question is unrelated, politely redirect the user to ask about Ajay's work or use the contact form. " +
  "If asked for contact details, share: email majay3574@gmail.com, LinkedIn linkedin.com/in/ajay-michael, GitHub github.com/majay3574.";

function addChatMessage(text, role) {
  if (!chatBox) return null;
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
  return message;
}

function buildChatMessages(latestUserMessage) {
  const messages = [{ role: "system", content: systemPrompt }];
  chatHistory.forEach((entry) => messages.push(entry));
  if (latestUserMessage) {
    messages.push({ role: "user", content: latestUserMessage });
  }
  return messages;
}

async function sendChatMessage() {
  if (!chatInput) return;
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  addChatMessage(userMessage, "user");
  chatHistory.push({ role: "user", content: userMessage });
  chatInput.value = "";

  const loadingMessage = addChatMessage("Thinking...", "bot");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getGroqKey()}`
      },
      body: JSON.stringify({
        model,
        messages: buildChatMessages(),
        temperature: 0.3,
        max_tokens: 700
      })
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "No reply received.";

    if (loadingMessage) {
      loadingMessage.textContent = reply;
    } else {
      addChatMessage(reply, "bot");
    }

    chatHistory.push({ role: "assistant", content: reply });
  } catch (error) {
    if (loadingMessage) {
      loadingMessage.textContent = "Sorry, something went wrong. Please try again.";
    }
  }
}

if (chatBox) {
  addChatMessage("Hi, I am Ajay. Ask me about projects, tools, or QA automation.", "bot");
}

function openChat() {
  if (!chatWidget) return;
  chatWidget.classList.add("is-open");
  chatWidget.setAttribute("aria-hidden", "false");
  if (chatLauncher) {
    chatLauncher.setAttribute("aria-expanded", "true");
  }
  chatInput?.focus();
}

function closeChat() {
  if (!chatWidget) return;
  chatWidget.classList.remove("is-open");
  chatWidget.setAttribute("aria-hidden", "true");
  if (chatLauncher) {
    chatLauncher.setAttribute("aria-expanded", "false");
  }
}

function toggleChat() {
  if (!chatWidget) return;
  if (chatWidget.classList.contains("is-open")) {
    closeChat();
  } else {
    openChat();
  }
}

if (chatLauncher) {
  chatLauncher.addEventListener("click", toggleChat);
}

if (chatClose) {
  chatClose.addEventListener("click", closeChat);
}

document.querySelectorAll('a[href="#ask"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openChat();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeChat();
  }
});

if (chatSend) {
  chatSend.addEventListener("click", sendChatMessage);
}

if (chatInput) {
  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendChatMessage();
    }
  });
}

if (chatClear) {
  chatClear.addEventListener("click", () => {
    if (chatBox) {
      chatBox.innerHTML = "";
    }
    chatHistory.length = 0;
    addChatMessage("Chat cleared. Ask another question anytime.", "bot");
  });
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const question = chip.getAttribute("data-question");
    if (chatInput && question) {
      chatInput.value = question;
      sendChatMessage();
    }
  });
});

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const gmailButton = document.getElementById("gmail-open");
const copyMessageButton = document.getElementById("copy-message");

function getFormValues() {
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const messageInput = document.getElementById("contact-message");

  if (!nameInput || !emailInput || !messageInput) {
    return null;
  }

  return {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
  };
}

function buildEmailPayload(values) {
  const subjectText = `Portfolio inquiry from ${values.name || "Visitor"}`;
  const bodyText = `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`;
  return {
    subject: subjectText,
    body: bodyText
  };
}

function buildGmailUrl(payload) {
  const subject = encodeURIComponent(payload.subject);
  const body = encodeURIComponent(payload.body);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    emailAddress
  )}&su=${subject}&body=${body}`;
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const values = getFormValues();
    if (!values) return;

    const payload = buildEmailPayload(values);
    const gmailUrl = buildGmailUrl(payload);
    const opened = window.open(gmailUrl, "_blank", "noopener");
    if (!opened) {
      window.location.href = gmailUrl;
    }

    if (formStatus) {
      formStatus.textContent = "Opening Gmail in a new tab...";
    }
  });
}

if (gmailButton) {
  gmailButton.addEventListener("click", () => {
    if (!contactForm || !contactForm.checkValidity()) {
      contactForm?.reportValidity();
      return;
    }

    const values = getFormValues();
    if (!values) return;

    const payload = buildEmailPayload(values);
    const gmailUrl = buildGmailUrl(payload);
    window.open(gmailUrl, "_blank", "noopener");

    if (formStatus) {
      formStatus.textContent = "Opening Gmail in a new tab...";
    }
  });
}

if (copyMessageButton) {
  copyMessageButton.addEventListener("click", async () => {
    if (!contactForm || !contactForm.checkValidity()) {
      contactForm?.reportValidity();
      return;
    }

    const values = getFormValues();
    if (!values) return;

    const payload = buildEmailPayload(values);
    const clipboardText = `To: ${emailAddress}\nSubject: ${payload.subject}\n\n${payload.body}`;

    try {
      await navigator.clipboard.writeText(clipboardText);
      if (formStatus) {
        formStatus.textContent = "Message copied. Paste it into your email client.";
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent =
          "Copy failed. Please select and copy the message manually.";
      }
    }
  });
}

const copyEmailButton = document.querySelector("[data-copy-email]");

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      copyEmailButton.textContent = "Copied";
      setTimeout(() => {
        copyEmailButton.textContent = "Copy email";
      }, 1500);
    } catch (error) {
      copyEmailButton.textContent = "Copy failed";
      setTimeout(() => {
        copyEmailButton.textContent = "Copy email";
      }, 1500);
    }
  });
}
