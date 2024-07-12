import Task from "./Task";
import defaultLists from "../lists/DefaultLists";

let allTasks = [];

function getAllTasks() {
    return allTasks;
}

function getActiveTasks() {
    return allTasks.filter(task => !task.isCompleted); 
}

function getCompletedTasks() {
    return allTasks.filter(task => task.isCompleted);
}

function getTaskById(id) {
    const task = allTasks.find(task => task.id === id);

    if(task === undefined) {
        console.error(`Task with id ${id} not found`);
        return null;
    }

    return task;
}

// Task property getters 
function getTitle(id) {
    return getTaskById(id).title;
}

function getDescription(id) {
    return getTaskById(id).description;
}

function getDueDate(id) {
    return getTaskById(id).dueDate;
}

function getLocation(id) {
    return getTaskById(id).location;
}

function getPriority(id) {
    return getTaskById(id).priority;
}

function getIsCompleted(id) {
    return getTaskById(id).isCompleted;
}

// Task property setters
function setTitle(title, id) {
    getTaskById(id).title = title;
}

function setDescription(discription, id) {
    getTaskById(id).description = discription;
}

function setDueDate(dueDate, id) {
    getTaskById(id).dueDate = dueDate;
    updateDefaultLists();
}

function setPriority(priority, id) {
    getTaskById(id).priority = priority;
}

function toggleIsCompleted(id) {
    getTaskById(id).toggleIsCompleted();
    updateDefaultLists();
}

// Task Manegement
function createTask(title) {
    const task = new Task(title);

    allTasks.push(task);

    updateDefaultLists();

    return task;
}

function deleteTask(id) {
    for(let i = 0; i < allTasks.length; i++) {
        if(allTasks[i].id === id) {
            allTasks.splice(i, 1);
        }
    }

    updateDefaultLists();
}

function deleteCompletedTasks() {
    allTasks = allTasks.filter(task => !task.isCompleted);

    updateDefaultLists();
}

function deleteAllTasks() {
    allTasks = [];
    updateDefaultLists();
}

// Default list management
function updateDefaultLists() {
    defaultLists.today.tasks = allTasks;
    defaultLists.upcoming.tasks = allTasks;
    defaultLists.allTasks.tasks = allTasks;
    defaultLists.inbox.tasks = allTasks;
}


export default {
    getAllTasks,
    getActiveTasks,
    getCompletedTasks,
    createTask,
    getTaskById,
    setTitle,
    setDescription,
    setDueDate,
    setPriority,
    getTitle,
    getDescription,
    getDueDate,
    getLocation,
    getPriority,
    getIsCompleted,
    toggleIsCompleted,
    deleteTask,
    deleteCompletedTasks,
    deleteAllTasks
}
