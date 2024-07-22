import { format } from "date-fns";
import ListManager from "../../../lists/ListManager";
import Task from "../../../tasks/Task";
import TaskManager from "../../../tasks/TaskManager";
import todo from "./todo";
import List from "../../../lists/List";


function renderCreateTaskForm(dialogElement) {
    const createTaskForm = document.createElement("form");
    createTaskForm.method = "dialog";

    renderNameInput(createTaskForm);
    renderDescriptionInput(createTaskForm);
    renderDueDateInput(createTaskForm);
    renderPriortySelect(createTaskForm);
    renderProjectSelect(createTaskForm);
    renderCreateTaskBtn(createTaskForm, dialogElement);
    renderCloseBtn(createTaskForm, dialogElement);

    dialogElement.appendChild(createTaskForm);
}

function renderEditTaskForm(dialogElement, taskId) {
    const editTaskForm = document.createElement("form");
    editTaskForm.method = "dialog";

    const editTaskFormTitle = document.createElement("h2");
    editTaskFormTitle.textContent = "Edit Task";
    dialogElement.appendChild(editTaskFormTitle);

    renderNameInput(editTaskForm, TaskManager.getTitle(taskId));
    renderDescriptionInput(editTaskForm, TaskManager.getDescription(taskId));

    let taskDueDate = TaskManager.getDueDate(taskId);
 
    if(taskDueDate !== null && taskDueDate instanceof Date && !isNaN(taskDueDate) ) {
        taskDueDate = format(taskDueDate, "yyyy-MM-dd");
    } else taskDueDate = null

    renderDueDateInput(editTaskForm, taskDueDate);

    renderPriortySelect(editTaskForm, TaskManager.getPriority(taskId));
    renderConfirmChangesBtn(editTaskForm, taskId);
    renderCloseBtn(editTaskForm, dialogElement);

    dialogElement.appendChild(editTaskForm);
}

function renderNameInput(parentElement, inputValue = null) {
    const taskNameInput = document.createElement("input");

    taskNameInput.type = "text";
    taskNameInput.id = "task-name";
    taskNameInput.placeholder = "Task name";

    if(inputValue !== null) {
        taskNameInput.value = inputValue;
    }

    renderLabel(parentElement, "Task Name", taskNameInput.id);

    parentElement.appendChild(taskNameInput);

}

function renderDescriptionInput(parentElement, inputValue = null) {
    const descriptionInput = document.createElement("input");

    descriptionInput.type = "text";
    descriptionInput.id = "description";
    descriptionInput.placeholder = "Description";

    if(inputValue !== null) {
        descriptionInput.value = inputValue;
    }

    renderLabel(parentElement, "Description", descriptionInput.id); 
    parentElement.appendChild(descriptionInput);
}

function renderDueDateInput(parentElement, dateValue = null) {
    const dueDateInput = document.createElement("input");

    dueDateInput.type = "date";
    dueDateInput.id = "due-date";

    if(dateValue !== null) {
        dueDateInput.value = dateValue;
    } 

    renderLabel(parentElement, "Due Date", dueDateInput.id);

    parentElement.appendChild(dueDateInput);
}

function renderPriortySelect(parentElement, taskPriority = "Medium") {    
    const prioritySelect = document.createElement("select");
    prioritySelect.id = "priority-select";

    renderLabel(parentElement, "Priority", prioritySelect.id);

    const low = document.createElement("option");
    const medium = document.createElement("option");
    const high = document.createElement("option");

    low.value = "Low";
    medium.value = "Medium";
    high.value = "High";
    
    switch (taskPriority) {
        case low.value:
            low.selected = true;
            break;
        case medium.value:
            medium.selected = true;
            break;
        case high.value: 
            high.selected = true;
            break;
        default:
            medium.selected = true;
    }

    low.textContent = "Low";
    medium.textContent = "Medium";
    high.textContent = "High";

    prioritySelect.appendChild(low);
    prioritySelect.appendChild(medium);
    prioritySelect.appendChild(high);

    parentElement.appendChild(prioritySelect);
}

function renderProjectSelect(parentElement) {
    const selectElement = document.createElement("select");
    selectElement.id = "project-select";

    const noneOption = document.createElement("option");
    noneOption.value = "";
    noneOption.textContent = "None";
    selectElement.appendChild(noneOption);

    // Loop through all user lists
    const userLists = ListManager.getUserLists();
    for(let userList of userLists) {
        const option = document.createElement("option");

        option.textContent = userList.name;

        // Check if option is currently selected list
        let selectedList = ListManager.getSelectedList();
        if(selectedList.name === userList.name) {
            option.selected = true;
        }

        selectElement.appendChild(option);
    }

    renderLabel(parentElement, "Project", selectElement.id);
    parentElement.appendChild(selectElement);
}

function renderConfirmChangesBtn(parentElement, taskId) {
    const confirmChangesBtn = document.createElement("button");
    confirmChangesBtn.textContent = "Confirm Changes";
    confirmChangesBtn.type = "button"

    confirmChangesBtn.addEventListener("click", () => onConfirmChangesBtnClick(parentElement, taskId))

    parentElement.appendChild(confirmChangesBtn);
}

function renderCreateTaskBtn(parentElement, dialogElement) {
    const createTaskBtn = document.createElement("button");
    createTaskBtn.innerText = "Create";
    createTaskBtn.type = "submit";
    createTaskBtn.addEventListener("click", () => onCreateTaskBtnClick(parentElement));

    parentElement.appendChild(createTaskBtn);
}

function renderCloseBtn(parentElement, dialogElement) {
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";

    closeBtn.addEventListener("click", () => {
        onCloseBtnClick(dialogElement, parentElement);
    })

    parentElement.appendChild(closeBtn);
}

function onConfirmChangesBtnClick(formElement, taskId) {
    const name = formElement.querySelector("#task-name").value;
    const description = formElement.querySelector("#description").value;
    const dueDateString = formElement.querySelector("#due-date").value; 
    const dueDate = new Date(dueDateString);
    const priority = formElement.querySelector("#priority-select").value;

    TaskManager.setTitle(name, taskId);
    TaskManager.setDescription(description, taskId);
    TaskManager.setDueDate(dueDate, taskId);
    TaskManager.setPriority(priority, taskId);
    
    todo.reloadSelectedList();
}

 function onCreateTaskBtnClick(formElement){
    const name = formElement.querySelector("#task-name").value;
    const description = formElement.querySelector("#description").value;
    const dueDateString = formElement.querySelector("#due-date").value; 
    const dueDate = new Date(dueDateString);
    const selectedProject = formElement.querySelector("#project-select").value; 
    const priority = formElement.querySelector("#priority-select").value; 

    const task = TaskManager.createTask(name);
    const taskId = TaskManager.getId(task);

    TaskManager.setDescription(description, taskId);

    if(dueDate instanceof Date && !isNaN(dueDate)) {
        TaskManager.setDueDate(dueDate, taskId);

    }

    if(selectedProject !== "") {
        ListManager.addTaskToList(selectedProject, task);
    }

    TaskManager.setPriority(priority, taskId);

    clearForm(formElement);
    
    // Reload the list currently being displayed
    todo.reloadSelectedList();
}

function onCloseBtnClick(dialogElement, formElement) {
    dialogElement.close();
    clearForm(formElement);
}

function renderLabel(parentElement, textContent, inputId) {
    const label = document.createElement("label");

    label.textContent = textContent;
    label.for = inputId;

    parentElement.appendChild(label);
}

function clearForm(formElement) {
    formElement.reset();
}


export default {
    renderCreateTaskForm,
    renderEditTaskForm, 
    renderLabel
}