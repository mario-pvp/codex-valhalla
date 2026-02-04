const levels = [
  {
    id: 1,
    title: "Level 1: Der Marktplatz von Midgard",
    story:
      "Die Händler verlangen eine Liste aller Waren. Loki flüstert dir zu, dass nur die Spalten name und price benötigt werden.",
    task: "Baue eine Abfrage, die name und price aus der Tabelle goods holt.",
    fragments: ["SELECT", "name, price", "FROM", "goods"],
    solutionEndpoint: "/api/levels/1/solution",
  },
  {
    id: 2,
    title: "Level 2: Die Schmiede der Zwerge",
    story:
      "In der Zwergen-Schmiede sollen nur die Waffen angezeigt werden, die den Typ 'axe' tragen.",
    task: "Baue eine Abfrage, die alle Spalten aus weapons zeigt und nach type = 'axe' filtert.",
    fragments: ["SELECT", "*", "FROM", "weapons", "WHERE", "type = 'axe'"],
    solutionEndpoint: "/api/levels/2/solution",
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
    solutionEndpoint: "/api/levels/3/solution",
  },
];

const levelGrid = document.getElementById("level-grid");
const levelTitle = document.getElementById("level-title");
const levelStory = document.getElementById("level-story");
const levelTask = document.getElementById("level-task");
const fragmentPool = document.getElementById("fragment-pool");
const sequence = document.getElementById("sequence");
const feedback = document.getElementById("feedback");
const resetButton = document.getElementById("reset");
const checkButton = document.getElementById("check");

const openHome = document.getElementById("open-home");
const openLevels = document.getElementById("open-levels");
const startQuest = document.getElementById("start-quest");

let activeLevel = null;
let selectedFragments = [];

const renderLevels = () => {
  if (!levelGrid) return;
  levelGrid.innerHTML = "";
  levels.forEach((level) => {
    const card = document.createElement("article");
    card.className = "level-card";
    card.innerHTML = `
      <h3>${level.title}</h3>
      <p>${level.story}</p>
      <a class="secondary" href="levels/level-${level.id}.html">Spielen</a>
    `;
    levelGrid.appendChild(card);
  });
};

const renderFragments = (level) => {
  if (!fragmentPool || !sequence) return;
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
  if (feedback) {
    feedback.textContent = "";
    feedback.className = "feedback";
  }
};

const loadLevel = (id) => {
  activeLevel = levels.find((level) => level.id === id);
  if (!activeLevel) return;
  if (levelTitle) levelTitle.textContent = activeLevel.title;
  if (levelStory) levelStory.textContent = activeLevel.story;
  if (levelTask) levelTask.textContent = activeLevel.task;
  renderFragments(activeLevel);
};

const fetchSolution = async (level) => {
  const response = await fetch(level.solutionEndpoint, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error("solution_request_failed");
  }
  const data = await response.json();
  if (!Array.isArray(data.answer)) {
    throw new Error("solution_invalid");
  }
  return data.answer;
};

const checkAnswer = async () => {
  if (!activeLevel || !feedback) return;
  try {
    const answer = await fetchSolution(activeLevel);
    const isCorrect =
      selectedFragments.length === answer.length &&
      selectedFragments.every((value, index) => value === answer[index]);

    if (isCorrect) {
      feedback.textContent = "Perfekt! Deine Query ist richtig geschmiedet.";
      feedback.className = "feedback success";
    } else {
      feedback.textContent =
        "Noch nicht ganz. Tipp: Prüfe die Reihenfolge der SQL-Bausteine.";
      feedback.className = "feedback error";
    }
  } catch (error) {
    feedback.textContent =
      "Das Backend ist gerade nicht erreichbar. Versuch es später erneut.";
    feedback.className = "feedback error";
  }
};

const resetLevel = () => {
  if (!activeLevel) return;
  renderFragments(activeLevel);
  if (feedback) {
    feedback.textContent = "";
    feedback.className = "feedback";
  }
};

const levelId = Number(document.body.dataset.levelId);
if (Number.isInteger(levelId) && levelId) {
  loadLevel(levelId);
}

if (levelGrid) {
  renderLevels();
}

if (openHome) {
  openHome.addEventListener("click", () => {
    document.getElementById("home").scrollIntoView({ behavior: "smooth" });
  });
}

if (openLevels) {
  openLevels.addEventListener("click", () => {
    document.getElementById("levels").scrollIntoView({ behavior: "smooth" });
  });
}

if (startQuest) {
  startQuest.addEventListener("click", () => {
    window.location.href = "levels/level-1.html";
  });
}

if (resetButton) {
  resetButton.addEventListener("click", resetLevel);
}

if (checkButton) {
  checkButton.addEventListener("click", checkAnswer);
}
