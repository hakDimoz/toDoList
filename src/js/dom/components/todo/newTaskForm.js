import TaskManager from "../../../tasks/TaskManager";

function renderCreateTaskForm(dialogElement) {
    const createTaskForm = document.createElement("form");
    createTaskForm.method = "dialog";

    renderNameInput(createTaskForm);
    renderDescriptionInput(createTaskForm);
    renderDueDateInput(createTaskForm);
    //renderPriortySelect(createTaskForm)
    renderCreateTaskBtn(createTaskForm, dialogElement);
    renderCloseBtn(createTaskForm, dialogElement);

    dialogElement.appendChild(createTaskForm);
}

function renderNameInput(parentElement) {
    //TODO: add required to name
    const taskNameInput = document.createElement("input");

    taskNameInput.type = "text";
    taskNameInput.id = "task-name";
    taskNameInput.placeholder = "Task name";

    parentElement.appendChild(taskNameInput);
}

function renderDescriptionInput(parentElement) {
    const descriptionInput = document.createElement("input");

    descriptionInput.type = "text";
    descriptionInput.id = "description";
    descriptionInput.placeholder = "Description";

    parentElement.appendChild(descriptionInput);
}

function renderDueDateInput(parentElement) {
    const dueDateInput = document.createElement("input");

    dueDateInput.type = "date";
    dueDateInput.id = "due-date";

    parentElement.appendChild(dueDateInput);
}

function renderPriortySelect(parentElement) {
    
    //TODO: priority
    const prioritySelect = document.createElement("select");
    const priority1 = document.createElement("option");
    const priority2 = document.createElement("option");
    const priority3 = document.createElement("option");
    const priority4 = document.createElement("option");

    priority1.value = "priority1";
    priority2.value = "priority2";
    priority3.value = "priority3";
    priority4.value = "priority4";
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

 //TODO: complete funciton
 function onCreateTaskBtnClick(formElement){
    const name = formElement.querySelector("#task-name").value;
    const description = formElement.querySelector("#description").value;
    const dueDate = formElement.querySelector("#due-date").value; 

    TaskManager.createTask(name);
    clearForm(formElement);
    
}

function onCloseBtnClick(dialogElement, formElement) {
    dialogElement.close();
    clearForm(formElement);
}

function clearForm(formElement) {
    formElement.reset();
}


export default renderCreateTaskForm;