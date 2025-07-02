let completedCount = 0;
let uncompletedCount = 0;


window.onload = function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => renderTask(task.text, task.completed));
  updateCounters();
};

function updateCounters() {
  document.getElementById("completed-count").textContent = completedCount;
  document.getElementById("uncompleted-count").textContent = uncompletedCount;
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    const text = li.querySelector(".task-title").textContent;
    const completed = li.classList.contains("completed");
    tasks.push({ text, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById("task-input").value.trim();
  if (!taskInput) {
    alert("Please enter a task.");
    return;
  }

  renderTask(taskInput, false);
  document.getElementById("task-input").value = "";
  saveTasks();
}

function renderTask(text, isCompleted) {
  const li = document.createElement("li");
  if (isCompleted) {
    li.classList.add("completed");
    completedCount++;
  } else {
    uncompletedCount++;
  }

  const leftSection = document.createElement("div");
  leftSection.className = "task-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;
  checkbox.onchange = () => {
    toggleCompleted(li, checkbox);
    saveTasks();
  };

  const title = document.createElement("span");
  title.textContent = text;
  title.className = "task-title";

  leftSection.append(checkbox, title);

  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.onclick = () => {
    const newText = prompt("Edit your task:", title.textContent);
    if (newText && newText.trim() !== "") {
      title.textContent = newText.trim();
      if (checkbox.checked) {
        checkbox.checked = false;
        li.classList.remove("completed");
        completedCount--;
        uncompletedCount++;
      }
      updateCounters();
      saveTasks();
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = () => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      if (checkbox.checked) {
        completedCount--;
      } else {
        uncompletedCount--;
      }
      li.remove();
      updateCounters();
      saveTasks();
    }
  };

  actions.append(editBtn, deleteBtn);
  li.append(leftSection, actions);
  document.getElementById("task-list").appendChild(li);
  updateCounters();
}

function toggleCompleted(listItem, checkbox) {
  if (checkbox.checked) {
    listItem.classList.add("completed");
    completedCount++;
    uncompletedCount--;
  } else {
    listItem.classList.remove("completed");
    completedCount--;
    uncompletedCount++;
  }
  updateCounters();
}
