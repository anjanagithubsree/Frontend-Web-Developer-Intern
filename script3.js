/* =========================================
   1. SELECT HTML ELEMENTS
========================================= */

const currentDate = document.getElementById("currentDate");

const themeToggle = document.getElementById("themeToggle");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const remainingTasksElement = document.getElementById("remainingTasks");

const taskCount = document.getElementById("taskCount");

const progressFill = document.getElementById("progressFill");
const progressPercentage = document.getElementById("progressPercentage");
const progressBar = document.getElementById("progressBar");
const progressMessage = document.getElementById("progressMessage");

const filterButtons = document.querySelectorAll(".filter-button");

const durationButtons = document.querySelectorAll(".duration-button");

const timerDisplay = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");

const startTimerButton = document.getElementById("startTimer");
const resetTimerButton = document.getElementById("resetTimer");

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newQuoteButton = document.getElementById("newQuote");


/* =========================================
   2. APPLICATION DATA
========================================= */

let tasks = [];

let currentFilter = "all";

let nextTaskId = 1;


/* =========================================
   3. DISPLAY CURRENT DATE
========================================= */

function displayCurrentDate() {
    const today = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };

    currentDate.textContent = today.toLocaleDateString(
        "en-US",
        options
    ).toUpperCase();
}

displayCurrentDate();


/* =========================================
   4. ADD A NEW TASK
========================================= */

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: nextTaskId++,
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";

    renderTasks();

    taskInput.focus();

});


/* =========================================
   5. DISPLAY TASKS
========================================= */

function renderTasks() {

    taskList.replaceChildren();

    const filteredTasks = tasks.filter(function (task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });

    filteredTasks.forEach(function (task) {

        const taskItem = document.createElement("div");

        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.text + " as completed"
        );

        checkbox.addEventListener("change", function () {

            toggleTask(task.id);

        });


        const taskText = document.createElement("p");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "delete-task";

        deleteButton.textContent = "×";

        deleteButton.setAttribute(
            "aria-label",
            "Delete task: " + task.text
        );

        deleteButton.addEventListener("click", function () {

            deleteTask(task.id);

        });


        taskItem.append(
            checkbox,
            taskText,
            deleteButton
        );

        taskList.appendChild(taskItem);

    });

    updateStatistics();

    emptyMessage.hidden = filteredTasks.length > 0;

}


/* =========================================
   6. COMPLETE OR UNCOMPLETE A TASK
========================================= */

function toggleTask(taskId) {

    tasks = tasks.map(function (task) {

        if (task.id === taskId) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    renderTasks();

}


/* =========================================
   7. DELETE A TASK
========================================= */

function deleteTask(taskId) {

    tasks = tasks.filter(function (task) {

        return task.id !== taskId;

    });

    renderTasks();

}


/* =========================================
   8. UPDATE TASK STATISTICS
========================================= */

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(function (task) {

        return task.completed;

    }).length;

    const remaining = total - completed;

    let percentage = 0;

    if (total > 0) {

        percentage = Math.round(
            (completed / total) * 100
        );

    }

    totalTasksElement.textContent = total;

    completedTasksElement.textContent = completed;

    remainingTasksElement.textContent = remaining;

    taskCount.textContent =
        total + (total === 1 ? " task" : " tasks");

    progressFill.style.width = percentage + "%";

    progressPercentage.textContent = percentage + "%";

    progressBar.setAttribute(
        "aria-valuenow",
        percentage
    );


    if (total === 0) {

        progressMessage.textContent =
            "Every little step counts.";

    } else if (percentage === 100) {

        progressMessage.textContent =
            "Wonderful! You completed all your tasks. 🌷";

    } else if (percentage >= 50) {

        progressMessage.textContent =
            "You're making great progress. Keep going!";

    } else {

        progressMessage.textContent =
            "One small step at a time. You've got this!";

    }

}


/* =========================================
   9. FILTER TASKS
========================================= */

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {

            filterButton.classList.remove("active");

        });

        button.classList.add("active");

        renderTasks();

    });

});


/* =========================================
   10. LIGHT AND DARK THEME
========================================= */

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-theme");

    const darkModeEnabled =
        document.body.classList.contains("dark-theme");

    themeToggle.textContent = darkModeEnabled ? "☀️" : "🌙";

    themeToggle.setAttribute(
        "aria-label",
        darkModeEnabled
            ? "Switch to light theme"
            : "Switch to dark theme"
    );

});


/* =========================================
   11. FOCUS TIMER VARIABLES
========================================= */

let selectedMinutes = 15;

let remainingSeconds = selectedMinutes * 60;

let timerInterval = null;

let timerEndTime = null;


/* =========================================
   12. FORMAT TIMER DISPLAY
========================================= */

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);

    const remaining = seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remaining).padStart(2, "0")
    );

}


/* =========================================
   13. UPDATE TIMER DISPLAY
========================================= */

function updateTimerDisplay() {

    timerDisplay.textContent = formatTime(
        remainingSeconds
    );

}


/* =========================================
   14. SELECT TIMER DURATION
========================================= */

durationButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (timerInterval !== null) {
            return;
        }

        selectedMinutes = Number(button.dataset.minutes);

        remainingSeconds = selectedMinutes * 60;

        durationButtons.forEach(function (durationButton) {

            durationButton.classList.remove("active");

        });

        button.classList.add("active");

        timerStatus.textContent = "Ready when you are";

        startTimerButton.textContent = "▶ Start";

        updateTimerDisplay();

    });

});


/* =========================================
   15. START THE FOCUS TIMER
========================================= */

function startTimer() {

    if (timerInterval !== null) {
        return;
    }

    if (remainingSeconds <= 0) {

        remainingSeconds = selectedMinutes * 60;

    }

    timerEndTime = Date.now() + remainingSeconds * 1000;

    timerStatus.textContent = "Focus on your task 🌱";

    startTimerButton.textContent = "Ⅱ Pause";

    timerInterval = setInterval(function () {

        remainingSeconds = Math.max(
            0,
            Math.ceil(
                (timerEndTime - Date.now()) / 1000
            )
        );

        updateTimerDisplay();

        if (remainingSeconds <= 0) {

            finishTimer();

        }

    }, 250);

}


/* =========================================
   16. PAUSE THE FOCUS TIMER
========================================= */

function pauseTimer() {

    if (timerInterval === null) {
        return;
    }

    clearInterval(timerInterval);

    timerInterval = null;

    timerEndTime = null;

    timerStatus.textContent = "Timer paused";

    startTimerButton.textContent = "▶ Resume";

}


/* =========================================
   17. FINISH THE FOCUS TIMER
========================================= */

function finishTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timerEndTime = null;

    remainingSeconds = 0;

    updateTimerDisplay();

    timerStatus.textContent =
        "Session complete! Well done. 🌷";

    startTimerButton.textContent = "▶ Start";

}


/* =========================================
   18. START AND PAUSE BUTTON
========================================= */

startTimerButton.addEventListener("click", function () {

    if (timerInterval !== null) {

        pauseTimer();

    } else {

        startTimer();

    }

});


/* =========================================
   19. RESET THE FOCUS TIMER
========================================= */

resetTimerButton.addEventListener("click", function () {

    if (timerInterval !== null) {

        clearInterval(timerInterval);

        timerInterval = null;

    }

    timerEndTime = null;

    remainingSeconds = selectedMinutes * 60;

    timerStatus.textContent = "Ready when you are";

    startTimerButton.textContent = "▶ Start";

    updateTimerDisplay();

});


/* =========================================
   20. MOTIVATIONAL QUOTES
========================================= */

const quotes = [

    {
        text: "Great things are done by a series of small things brought together.",
        author: "Vincent van Gogh"
    },

    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
    },

    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },

    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },

    {
        text: "Small steps every day lead to big changes.",
        author: "A gentle reminder"
    },

    {
        text: "You don't have to be perfect. You just have to begin.",
        author: "A gentle reminder"
    }

];

let currentQuoteIndex = 0;


/* =========================================
   21. DISPLAY A MOTIVATIONAL QUOTE
========================================= */

function displayQuote(index) {

    quoteText.textContent = quotes[index].text;

    quoteAuthor.textContent = "— " + quotes[index].author;

}


/* =========================================
   22. CHANGE THE MOTIVATIONAL QUOTE
========================================= */

newQuoteButton.addEventListener("click", function () {

    if (quotes.length <= 1) {
        return;
    }

    let nextIndex;

    do {

        nextIndex = Math.floor(
            Math.random() * quotes.length
        );

    } while (nextIndex === currentQuoteIndex);

    currentQuoteIndex = nextIndex;

    displayQuote(currentQuoteIndex);

});


/* =========================================
   23. INITIALIZE THE APPLICATION
========================================= */

function initializeApp() {

    displayCurrentDate();

    renderTasks();

    updateTimerDisplay();

    displayQuote(currentQuoteIndex);

}

initializeApp();