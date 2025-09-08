const days = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo'
];
const dayNav = document.getElementById('day-nav');
const list = document.getElementById('exercise-list');
const form = document.getElementById('exercise-form');
let currentDay = null;

function buildNav() {
  days.forEach((day) => {
    const btn = document.createElement('button');
    btn.textContent = day.charAt(0).toUpperCase();
    btn.dataset.day = day;
    btn.addEventListener('click', () => loadDay(day));
    dayNav.appendChild(btn);
  });
}

function loadDay(day) {
  currentDay = day;
  [...dayNav.children].forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.day === day);
  });
  const exercises = JSON.parse(localStorage.getItem(day)) || [];
  renderList(exercises);
}

function renderList(exercises) {
  list.innerHTML = '';
  exercises.forEach((ex) => {
    const li = document.createElement('li');
    li.textContent = `${ex.name} - ${ex.reps} reps @ ${ex.weight}kg`;
    list.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('exercise-name').value.trim();
  const reps = parseInt(document.getElementById('exercise-reps').value, 10);
  const weight = parseFloat(document.getElementById('exercise-weight').value);
  const exercises = JSON.parse(localStorage.getItem(currentDay)) || [];
  exercises.push({ name, reps, weight });
  localStorage.setItem(currentDay, JSON.stringify(exercises));
  renderList(exercises);
  form.reset();
});

buildNav();
const todayIndex = new Date().getDay();
// JavaScript's getDay returns 0 for Sunday; adjust to our array
loadDay(days[(todayIndex + 6) % 7]);
