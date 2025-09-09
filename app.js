const days = [1, 2, 3, 4];
const dayNav = document.getElementById('day-nav');
const list = document.getElementById('exercise-list');
const form = document.getElementById('exercise-form');
const submitBtn = form.querySelector('button');
const userSelect = document.getElementById('user-select');
const app = document.getElementById('app');
let currentDay = 1;
let currentUser = null;
let editId = null;

function buildNav() {
  days.forEach((day) => {
    const btn = document.createElement('button');
    btn.textContent = `Día ${day}`;
    btn.dataset.day = day;
    btn.addEventListener('click', () => loadDay(day));
    dayNav.appendChild(btn);
  });
}

function loadDay(day) {
  currentDay = day;
  [...dayNav.children].forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.day) === day);
  });
  fetch(`/api/exercises?user=${encodeURIComponent(currentUser)}&day=${day}`)
    .then((res) => res.json())
    .then((data) => renderList(data));
}

function renderList(exercises) {
  list.innerHTML = '';
  exercises.forEach((ex) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const sets = ex.series ?? 1;
    span.textContent = `${ex.name} - ${sets}x${ex.reps} @ ${ex.weight}kg`;
    li.appendChild(span);

    const actions = document.createElement('div');

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => startEdit(ex));
    actions.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = 'Eliminar';
    delBtn.addEventListener('click', () => deleteExercise(ex.id));
    actions.appendChild(delBtn);

    li.appendChild(actions);
    list.appendChild(li);
  });
}

function startEdit(ex) {
  document.getElementById('exercise-name').value = ex.name;
  document.getElementById('exercise-series').value = ex.series ?? '';
  document.getElementById('exercise-reps').value = ex.reps;
  document.getElementById('exercise-weight').value = ex.weight;
  editId = ex.id;
  submitBtn.textContent = 'Guardar';
}

function deleteExercise(id) {
  fetch(`/api/exercises/${id}`, { method: 'DELETE' }).then(() => loadDay(currentDay));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('exercise-name').value.trim();
  const series = parseInt(document.getElementById('exercise-series').value, 10);
  const reps = parseInt(document.getElementById('exercise-reps').value, 10);
  const weight = parseFloat(document.getElementById('exercise-weight').value);
  const payload = { user: currentUser, day: currentDay, name, series, reps, weight };
  let url = '/api/exercises';
  let method = 'POST';
  if (editId !== null) {
    url += `/${editId}`;
    method = 'PUT';
    delete payload.user;
    delete payload.day;
  }
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(() => {
    loadDay(currentDay);
    form.reset();
    editId = null;
    submitBtn.textContent = 'Agregar';
  });
});

function initUserSelection() {
  document.querySelectorAll('#user-select button').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentUser = btn.dataset.user;
      userSelect.classList.add('hidden');
      app.classList.remove('hidden');
      loadDay(currentDay);
    });
  });
}

buildNav();
initUserSelection();
