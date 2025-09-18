// Task Manager Script

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');

  // Dark mode toggle
  const darkToggle = document.getElementById('dark-mode-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedDark = localStorage.getItem('darkMode');
  function setDarkMode(on) {
    document.body.classList.toggle('dark-mode', on);
    if (darkToggle) {
      darkToggle.classList.toggle('active', on);
      darkToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      darkToggle.textContent = on ? '☀️' : '🌙';
    }
    localStorage.setItem('darkMode', on ? '1' : '0');
  }
  // Init dark mode
  setDarkMode(savedDark === null ? prefersDark : savedDark === '1');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      setDarkMode(!isDark);
    });
  }

  // Filter system
  const filterNav = document.querySelector('.filter-nav');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentFilter = 'all';

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    list.innerHTML = '';
    let filteredTasks = tasks;
    if (currentFilter === 'completed') {
      filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
      filteredTasks = tasks.filter(t => !t.completed);
    }
    if (filteredTasks.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No tasks yet!';
      li.style.textAlign = 'center';
      li.style.color = '#aaa';
      list.appendChild(li);
      return;
    }
    filteredTasks.forEach((task, idx) => {
      // Find the real index in tasks array for actions
      const realIdx = tasks.indexOf(task);
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.setAttribute('role', 'listitem');
      li.setAttribute('tabindex', '0');
      li.innerHTML = `
        <span>${task.text}</span>
        <span class="task-actions">
          <button class="complete-btn" aria-label="Mark as completed" title="Mark as completed">✓</button>
          <button class="delete-btn" aria-label="Delete task" title="Delete">🗑️</button>
        </span>
      `;
      // Complete button
      li.querySelector('.complete-btn').onclick = () => {
        tasks[realIdx].completed = !tasks[realIdx].completed;
        saveTasks();
        renderTasks();
      };
      // Delete button
      li.querySelector('.delete-btn').onclick = () => {
        tasks.splice(realIdx, 1);
        saveTasks();
        renderTasks();
      };
      list.appendChild(li);
    });
  }
// Input validation: prevent empty or whitespace-only tasks
input.addEventListener('input', () => {
    input.value = input.value.replace(/^\s+/, '');
});
  form.onsubmit = e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.unshift({ text, completed: false });
    input.value = '';
    saveTasks();
    renderTasks();
  };

  // Filter button event listeners
  if (filterNav) {
    filterNav.addEventListener('click', e => {
      if (e.target.classList.contains('filter-btn')) {
        filterBtns.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        e.target.classList.add('active');
        e.target.setAttribute('aria-pressed', 'true');
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
      }
    });
  }

  renderTasks();
});
