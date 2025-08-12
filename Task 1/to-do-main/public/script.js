const taskList = document.getElementById('taskList');
const form = document.getElementById('taskForm');

async function loadTasks() {
  const res = await fetch('/tasks');
  const tasks = await res.json();

  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.innerHTML = `
      <div onclick="toggleStatus(${task.id}, ${task.completed})">
        <strong>${task.title}</strong><br />
        <small>${task.description}</small>
      </div>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();

  if (title && description) {
    await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, completed: false })
    });
    form.reset();
    loadTasks();
  }
});

async function toggleStatus(id, completed) {
  await fetch(`/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !completed })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

loadTasks();