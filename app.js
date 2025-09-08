const days = ['Dia 1', 'Día 2', 'Día 3', 'Día 4'];
const dayNav = document.getElementById('day-nav');
const list = document.getElementById('exercise-list');
const form = document.getElementById('exercise-form');
const submitBtn = form.querySelector('button');
let currentDay = null;
let editIndex = null;

function buildNav() {
  days.forEach((day) => {
    const btn = document.createElement('button');
    btn.textContent = day;
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
  exercises.forEach((ex, idx) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const sets = ex.series ?? 1;
    span.textContent = `${ex.name} - ${sets}x${ex.reps} @ ${ex.weight}kg`;
    li.appendChild(span);

    const actions = document.createElement('div');

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => startEdit(idx));
    actions.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = 'Eliminar';
    delBtn.addEventListener('click', () => deleteExercise(idx));
    actions.appendChild(delBtn);

    li.appendChild(actions);
    list.appendChild(li);
  });
}

function startEdit(idx) {
  const exercises = JSON.parse(localStorage.getItem(currentDay)) || [];
  const ex = exercises[idx];
  document.getElementById('exercise-name').value = ex.name;
  document.getElementById('exercise-series').value = ex.series ?? '';
  document.getElementById('exercise-reps').value = ex.reps;
  document.getElementById('exercise-weight').value = ex.weight;
  editIndex = idx;
  submitBtn.textContent = 'Guardar';
}

function deleteExercise(idx) {
  const exercises = JSON.parse(localStorage.getItem(currentDay)) || [];
  exercises.splice(idx, 1);
  localStorage.setItem(currentDay, JSON.stringify(exercises));
  renderList(exercises);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('exercise-name').value.trim();
  const series = parseInt(document.getElementById('exercise-series').value, 10);
  const reps = parseInt(document.getElementById('exercise-reps').value, 10);
  const weight = parseFloat(document.getElementById('exercise-weight').value);
  const exercises = JSON.parse(localStorage.getItem(currentDay)) || [];
  if (editIndex !== null) {
    exercises[editIndex] = { name, series, reps, weight };
  } else {
    exercises.push({ name, series, reps, weight });
  }
  localStorage.setItem(currentDay, JSON.stringify(exercises));
  renderList(exercises);
  form.reset();
  editIndex = null;
  submitBtn.textContent = 'Agregar';
});

buildNav();
loadDay(days[0]);
