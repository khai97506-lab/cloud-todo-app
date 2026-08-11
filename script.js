let tasks = [];
let currentFilter = "all";

function addTask() {
    const input = document.getElementById("taskInput");
    const title = input.value.trim();

    if (title === "") {
        alert("Vui lòng nhập công việc!");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        completed: false
    };

    tasks.push(task);

    input.value = "";

    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    renderTasks();
}

function filterTasks(filter) {
    currentFilter = filter;

    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById("taskList");
    const emptyMessage = document.getElementById("emptyMessage");

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = task.completed ? "completed" : "";

        li.innerHTML = `
            <span onclick="toggleTask(${task.id})">
                ${task.completed ? "☑️" : "⬜"} ${task.title}
            </span>

            <button onclick="deleteTask(${task.id})">
                Xóa
            </button>
        `;

        taskList.appendChild(li);
    });
}

document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();
