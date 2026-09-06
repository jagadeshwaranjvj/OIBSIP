
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");

const currentDate = document.getElementById("currentDate");

let tasks = JSON.parse(localStorage.getItem("taskflow_tasks")) || [];

function showCurrentDate() {

    const today = new Date();

    currentDate.textContent = today.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}

showCurrentDate();

function saveTasks() {

    localStorage.setItem(
        "taskflow_tasks",
        JSON.stringify(tasks)
    );
}
function formatTime(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        taskInput.focus();

        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false,

        createdAt: Date.now(),

        completedAt: null

    };


    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    taskInput.focus();

    renderTasks();
}

function createTaskElement(task) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {

        taskItem.classList.add("completed-task");

    }

    const checkButton = document.createElement("button");

    checkButton.className = "task-check";

    checkButton.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task as pending"
            : "Mark task as complete"
    );


    if (task.completed) {

        checkButton.classList.add("completed");

    }
    
    checkButton.addEventListener(
        "click",
        () => toggleTask(task.id)
    );

    const content = document.createElement("div");

    content.className = "task-content";


    const taskText = document.createElement("div");

    taskText.className = "task-text";

    taskText.textContent = task.text;


    const taskTime = document.createElement("small");

    taskTime.className = "task-time";


    if (task.completed && task.completedAt) {

        taskTime.textContent =
            `Added ${formatTime(task.createdAt)} • Completed ${formatTime(task.completedAt)}`;

    } else {

        taskTime.textContent =
            `Added ${formatTime(task.createdAt)}`;

    }
    
    content.appendChild(taskText);

    content.appendChild(taskTime);


    const actions = document.createElement("div");

    actions.className = "task-actions";


    const editButton = document.createElement("button");

    editButton.className = "action-btn edit-btn";

    editButton.textContent = "✎";

    editButton.title = "Edit task";


    editButton.addEventListener(
        "click",
        () => startEditing(task, taskItem)
    );


    const deleteButton = document.createElement("button");

    deleteButton.className = "action-btn delete-btn";

    deleteButton.textContent = "×";

    deleteButton.title = "Delete task";


    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    taskItem.appendChild(checkButton);

    taskItem.appendChild(content);

    taskItem.appendChild(actions);


    return taskItem;
}


function renderTasks() {

    pendingList.innerHTML = "";

    completedList.innerHTML = "";


    const pendingTasks = tasks.filter(
        task => !task.completed
    );


    const completedTasks = tasks.filter(
        task => task.completed
    );


    pendingCount.textContent = pendingTasks.length;

    completedCount.textContent = completedTasks.length;


    if (pendingTasks.length === 0) {

        pendingList.appendChild(
            pendingEmpty
        );

    } else {

        pendingTasks.forEach(task => {

            pendingList.appendChild(
                createTaskElement(task)
            );

        });

    }


    if (completedTasks.length === 0) {

        completedList.appendChild(
            completedEmpty
        );

    } else {

        completedTasks.forEach(task => {

            completedList.appendChild(
                createTaskElement(task)
            );

        });

    }

}


function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) return;


    task.completed = !task.completed;


    if (task.completed) {

        task.completedAt = Date.now();

    } else {

        task.completedAt = null;

    }


    saveTasks();

    renderTasks();
}


function startEditing(task, taskItem) {

    const content =
        taskItem.querySelector(".task-content");

    const taskText =
        content.querySelector(".task-text");

    const actions =
        taskItem.querySelector(".task-actions");


    const input =
        document.createElement("input");


    input.type = "text";

    input.className = "edit-input";

    input.value = task.text;

    input.maxLength = 120;


    content.replaceChild(
        input,
        taskText
    );


    input.focus();

    input.select();


    actions.innerHTML = "";


    const saveButton =
        document.createElement("button");

    saveButton.className =
        "action-btn edit-btn";

    saveButton.textContent = "✓";

    saveButton.title = "Save";


    const cancelButton =
        document.createElement("button");

    cancelButton.className =
        "action-btn delete-btn";

    cancelButton.textContent = "×";

    cancelButton.title = "Cancel";


    actions.appendChild(saveButton);

    actions.appendChild(cancelButton);


    function saveEdit() {

        const updatedText =
            input.value.trim();


        if (updatedText === "") {

            input.focus();

            return;
        }


        task.text = updatedText;

        saveTasks();

        renderTasks();
    }


    function cancelEdit() {

        renderTasks();

    }


    saveButton.addEventListener(
        "click",
        saveEdit
    );


    cancelButton.addEventListener(
        "click",
        cancelEdit
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                saveEdit();

            }


            if (event.key === "Escape") {

                cancelEdit();

            }

        }
    );

}


function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();
}



addTaskBtn.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();

        }

    }
);

renderTasks();
