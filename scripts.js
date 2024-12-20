// ==== POMODORO TIMER ====
let timer;
let isWorkTime = true;
let timeLeft;
const timerDisplay = document.getElementById('timer-display');
const timerStatus = document.getElementById('timer-status');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');

function saveTimerState() {
    localStorage.setItem('timerState', JSON.stringify({
        timeLeft,
        isWorkTime,
        workTime: workInput.value,
        breakTime: breakInput.value,
    }));
}

function loadTimerState() {
    const savedState = JSON.parse(localStorage.getItem('timerState'));
    if (savedState) {
        timeLeft = savedState.timeLeft;
        isWorkTime = savedState.isWorkTime;
        workInput.value = savedState.workTime;
        breakInput.value = savedState.breakTime;
    } else {
        resetTimer();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerStatus.textContent = `Status: ${isWorkTime ? 'Belajar' : 'Istirahat'}`;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
            saveTimerState();
        } else {
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? workInput.value * 60 : breakInput.value * 60;
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    isWorkTime = true;
    timeLeft = workInput.value * 60;
    updateTimerDisplay();
    saveTimerState();
}

document.getElementById('start-timer').addEventListener('click', startTimer);
document.getElementById('pause-timer').addEventListener('click', pauseTimer);
document.getElementById('reset-timer').addEventListener('click', resetTimer);

loadTimerState();
updateTimerDisplay();

// ==== TO-DO LIST ====
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoItems = document.getElementById('todo-items');

function updateStats() {
    const totalTasks = todoItems.children.length;
    const completedTasks = [...todoItems.children].filter(item => item.classList.contains('completed-task')).length;
    document.getElementById('stats').textContent = `Total: ${totalTasks}, Selesai: ${completedTasks}, Belum Selesai: ${totalTasks - completedTasks}`;
}

function addTodoItem(taskText) {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center';

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    li.appendChild(taskSpan);

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Selesai';
    completeBtn.className = 'complete-btn';
    completeBtn.addEventListener('click', () => {
        li.classList.toggle('completed-task');
        updateStats();
    });
    li.appendChild(completeBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
        li.remove();
        updateStats();
    });
    li.appendChild(deleteBtn);

    todoItems.appendChild(li);
    updateStats();
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (taskText) {
        addTodoItem(taskText);
        todoInput.value = '';
    }
});

updateStats();
