// DOM references for interactive elements on the page.
const themeToggle = document.getElementById('themeToggle');
const detailsToggle = document.getElementById('detailsToggle');
const detailsInfo = document.getElementById('detailsInfo');
const quoteBtn = document.getElementById('quoteBtn');
const progressValue = document.getElementById('progressValue');
const progressFill = document.getElementById('progressFill');
const projectForm = document.getElementById('projectForm');
const formSuccess = document.getElementById('formSuccess');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');

// Sample insights for the dynamic quote button.
const insightMessages = [
  'Clear hierarchy improves usability and reduces friction.',
  'Accessible interactions increase trust in digital products.',
  'Small animations help guide the user without distracting them.',
  'Testing real behavior early prevents layout-breaking fixes later.'
];

// DOM references for the live preview card.
const previewName = document.getElementById('previewName');
const previewEmail = document.getElementById('previewEmail');
const previewRole = document.getElementById('previewRole');
const previewSummary = document.getElementById('previewSummary');

let currentProgress = 72;

// Updates the progress indicator and numeric percentage value.
function updateProgress(nextValue) {
  currentProgress = Math.min(100, Math.max(0, nextValue));
  progressValue.textContent = `${currentProgress}%`;
  progressFill.style.width = `${currentProgress}%`;
}

// Toggles a light/dark mode to improve visual comfort.
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

// Shows or hides the detail panel when the button is clicked.
function toggleDetails() {
  detailsInfo.classList.toggle('hidden');
  const isHidden = detailsInfo.classList.contains('hidden');
  detailsToggle.textContent = isHidden ? 'Show Details' : 'Hide Details';
}

// Chooses a new UX insight and swaps it into the hero paragraph.
function setQuote() {
  const currentQuote = insightMessages[Math.floor(Math.random() * insightMessages.length)];
  const currentText = document.querySelector('.hero-copy p');
  if (currentText) {
    currentText.textContent = currentQuote;
  }
}

// Validates a single form field and shows custom error messages.
function validateField(fieldId, label, value) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}Error`);

  if (!value.trim()) {
    error.textContent = `${label} is required.`;
    field.setAttribute('aria-invalid', 'true');
    return false;
  }

  if (fieldId === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    error.textContent = 'Please enter a valid email address.';
    field.setAttribute('aria-invalid', 'true');
    return false;
  }

  error.textContent = '';
  field.removeAttribute('aria-invalid');
  return true;
}

// Syncs the preview card with the form data in real time.
function updatePreview() {
  const name = document.getElementById('fullName').value.trim() || 'Your Name';
  const email = document.getElementById('email').value.trim() || 'your.email@example.com';
  const role = document.getElementById('role').value.trim() || 'UI Intern';
  const message = document.getElementById('message').value.trim() || 'Add your details to see a preview.';

  previewName.textContent = name;
  previewEmail.textContent = email;
  previewRole.textContent = role;
  previewSummary.textContent = message;
}

// Validates the full form before accepting submission.
function handleFormSubmit(event) {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const role = document.getElementById('role').value;
  const message = document.getElementById('message').value;

  const isNameValid = validateField('fullName', 'Full name', fullName);
  const isEmailValid = validateField('email', 'Email', email);
  const isRoleValid = validateField('role', 'Role', role);
  const isMessageValid = validateField('message', 'Project notes', message);

  if (!isNameValid || !isEmailValid || !isRoleValid || !isMessageValid) {
    formSuccess.textContent = 'Please fix the highlighted fields before submitting.';
    formSuccess.classList.remove('hidden');
    return;
  }

  updatePreview();
  formSuccess.textContent = `Thank you, ${fullName}! Your request has been captured successfully.`;
  formSuccess.classList.remove('hidden');
  updateProgress(currentProgress + 8);
  projectForm.reset();
}

// Creates a new task item in the list and updates the count.
function addTask() {
  const taskText = taskInput.value.trim();

  if (!taskText) {
    taskInput.focus();
    return;
  }

  const item = document.createElement('li');
  item.className = 'task-item';
  item.textContent = taskText;
  taskList.appendChild(item);

  taskInput.value = '';
  taskInput.focus();

  const totalTasks = taskList.children.length;
  taskCount.textContent = `${totalTasks} task${totalTasks === 1 ? '' : 's'} active`;
  updateProgress(currentProgress + 4);
}

// Clears the success feedback and refreshes the preview field states.
function resetFormState() {
  formSuccess.classList.add('hidden');
  formSuccess.textContent = '';
  updatePreview();
}

// Event listeners for all user actions.
themeToggle.addEventListener('click', toggleTheme);
detailsToggle.addEventListener('click', toggleDetails);
quoteBtn.addEventListener('click', setQuote);
projectForm.addEventListener('submit', handleFormSubmit);
projectForm.addEventListener('reset', resetFormState);
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Live validation as the user types for smoother UX.
['fullName', 'email', 'role', 'message'].forEach((fieldId) => {
  document.getElementById(fieldId).addEventListener('input', function () {
    const fieldMap = {
      fullName: ['Full name', document.getElementById('fullName').value],
      email: ['Email', document.getElementById('email').value],
      role: ['Role', document.getElementById('role').value],
      message: ['Project notes', document.getElementById('message').value]
    };

    const [label, value] = fieldMap[fieldId];
    if (value.trim()) {
      validateField(fieldId, label, value);
    }
    updatePreview();
  });
});

// Initialize the preview when the page loads.
updatePreview();
