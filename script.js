const levels = [
  {
    id: 1,
    title: "Level 1: Der Marktplatz von Midgard",
    story:
      "Die Händler verlangen eine Liste aller Waren. Loki flüstert dir zu, dass nur die Spalten name und price benötigt werden.",
    task: "Baue eine Abfrage, die name und price aus der Tabelle goods holt.",
    fragments: ["SELECT", "name, price", "FROM", "goods"],
    answer: ["SELECT", "name, price", "FROM", "goods"],
  },
  {
    id: 2,
    title: "Level 2: Die Schmiede der Zwerge",
    story:
      "In der Zwergen-Schmiede sollen nur die Waffen angezeigt werden, die den Typ 'axe' tragen.",
    task: "Baue eine Abfrage, die alle Spalten aus weapons zeigt und nach type = 'axe' filtert.",
    fragments: ["SELECT", "*", "FROM", "weapons", "WHERE", "type = 'axe'"],
    answer: ["SELECT", "*", "FROM", "weapons", "WHERE", "type = 'axe'"],
  },
  {
    id: 3,
    title: "Level 3: Die Hallen der Gefallenen",
    story:
      "Odin bittet dich, die Namen der Gefallenen nach dem Jahr 1023 aufzulisten.",
    task: "Baue eine Abfrage, die name aus fallen_heroes holt und year > 1023 filtert.",
    fragments: [
      "SELECT",
      "name",
      "FROM",
      "fallen_heroes",
      "WHERE",
      "year > 1023",
    ],
    answer: [
      "SELECT",
      "name",
      "FROM",
      "fallen_heroes",
      "WHERE",
      "year > 1023",
    ],
  },
];

const levelGrid = document.getElementById("level-grid");
const playArea = document.getElementById("play-area");
const levelTitle = document.getElementById("level-title");
const levelStory = document.getElementById("level-story");
const levelTask = document.getElementById("level-task");
const fragmentPool = document.getElementById("fragment-pool");
const sequence = document.getElementById("sequence");
const feedback = document.getElementById("feedback");

const openHome = document.getElementById("open-home");
const openLevels = document.getElementById("open-levels");
const startQuest = document.getElementById("start-quest");
const resetButton = document.getElementById("reset");
const checkButton = document.getElementById("check");

let activeLevel = null;
let selectedFragments = [];

const renderLevels = () => {
  levelGrid.innerHTML = "";
  levels.forEach((level) => {
    const card = document.createElement("article");
    card.className = "level-card";
    card.innerHTML = `
      <h3>${level.title}</h3>
      <p>${level.story}</p>
      <button class="secondary" data-level="${level.id}">Spielen</button>
    `;
    levelGrid.appendChild(card);
  });
};

const renderFragments = (level) => {
  fragmentPool.innerHTML = "";
  sequence.innerHTML = "";
  selectedFragments = [];
  level.fragments.forEach((fragment) => {
    const button = document.createElement("button");
    button.className = "fragment";
    button.textContent = fragment;
    button.type = "button";
    button.addEventListener("click", () => addFragment(fragment, button));
    fragmentPool.appendChild(button);
  });
};

const addFragment = (fragment, button) => {
  selectedFragments.push(fragment);
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.textContent = fragment;
  sequence.appendChild(chip);
  button.disabled = true;
  feedback.textContent = "";
  feedback.className = "feedback";
};

const loadLevel = (id) => {
  activeLevel = levels.find((level) => level.id === id);
  if (!activeLevel) return;
  levelTitle.textContent = activeLevel.title;
  levelStory.textContent = activeLevel.story;
  levelTask.textContent = activeLevel.task;
  renderFragments(activeLevel);
  playArea.hidden = false;
  playArea.scrollIntoView({ behavior: "smooth", block: "start" });
};

const checkAnswer = () => {
  if (!activeLevel) return;
  const isCorrect =
    selectedFragments.length === activeLevel.answer.length &&
    selectedFragments.every((value, index) => value === activeLevel.answer[index]);

  if (isCorrect) {
    feedback.textContent = "Perfekt! Deine Query ist richtig geschmiedet.";
    feedback.className = "feedback success";
  } else {
    feedback.textContent =
      "Noch nicht ganz. Tipp: Prüfe die Reihenfolge der SQL-Bausteine.";
    feedback.className = "feedback error";
  }
};

const resetLevel = () => {
  if (!activeLevel) return;
  renderFragments(activeLevel);
  feedback.textContent = "";
  feedback.className = "feedback";
};

levelGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-level]");
  if (!button) return;
  loadLevel(Number(button.dataset.level));
});

openHome.addEventListener("click", () => {
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
});

openLevels.addEventListener("click", () => {
  document.getElementById("levels").scrollIntoView({ behavior: "smooth" });
});

startQuest.addEventListener("click", () => {
  loadLevel(levels[0].id);
});

resetButton.addEventListener("click", resetLevel);
checkButton.addEventListener("click", checkAnswer);

renderLevels();
