// Заготовка-плейсхолдер вместо настоящей картинки
function placeholder(label, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="28"
      text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// Вопросы: замените image на путь к своей картинке, например "img/q1.jpg"
const questions = [
  {
    text: "Вопрос 1. Что изображено на картинке?",
    image: placeholder("Картинка 1", "#3a6ea5"),
    options: ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
  },
  {
    text: "Вопрос 2. Где это находится?",
    image: placeholder("Картинка 2", "#7a4fa3"),
    options: ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
  },
  {
    text: "Вопрос 3. Какой год на фото?",
    image: placeholder("Картинка 3", "#a35a4f"),
    options: ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
  },
];

const chat = document.getElementById("chat");
const answers = document.getElementById("answers");
const status = document.getElementById("status");

let current = 0;

function addMessage(from, { text, image } = {}) {
  const el = document.createElement("div");
  el.className = `msg ${from}`;
  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = "";
    img.addEventListener("load", scrollDown);
    el.appendChild(img);
  }
  if (text) el.appendChild(document.createTextNode(text));
  chat.appendChild(el);
  scrollDown();
  return el;
}

function scrollDown() {
  chat.scrollTop = chat.scrollHeight;
}

function botSay(message, delay = 700) {
  return new Promise((resolve) => {
    status.textContent = "печатает…";
    const typing = addMessage("bot", { text: "…" });
    typing.classList.add("typing");
    setTimeout(() => {
      typing.remove();
      status.textContent = "в сети";
      addMessage("bot", message);
      resolve();
    }, delay);
  });
}

function showOptions(options) {
  answers.innerHTML = "";
  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = option;
    btn.addEventListener("click", () => onAnswer(option));
    answers.appendChild(btn);
  });
}

async function onAnswer(option) {
  answers.innerHTML = "";
  addMessage("user", { text: option });
  // TODO: проверка ответа / ветвление
  current++;
  await askNext();
}

async function askNext() {
  if (current >= questions.length) {
    await botSay({ text: "Конец! Спасибо за прохождение 🎉" });
    return;
  }
  const q = questions[current];
  await botSay({ text: q.text, image: q.image });
  showOptions(q.options);
}

(async () => {
  await botSay({ text: "Привет! Давай начнём квест." }, 400);
  await askNext();
})();
