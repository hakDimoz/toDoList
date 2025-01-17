import List from "./List";
import defaultLists from "./DefaultLists";
import TaskManager from "../tasks/TaskManager";
import storage from "../storage";
import sidebar from "../dom/components/sidebar";

let selectedList = null; // The current list being displayed
let userLists = [];

function listFound(listName) {
    if(isDefaultList(listName)) return true;
    
    if(isUserList(listName)) return true;

    return false;
}

function isDefaultList(listName) {  
    listName = listName.toLowerCase().replaceAll(" ", "");

    for(const listKey in defaultLists) {
        let defaultListName = defaultLists[listKey].name.replaceAll(" ", "").toLowerCase()

        if(defaultListName === listName){
            return true;
        }
    }

    return false;
}

function isUserList(listName) {
    const list = userLists.find(list => list.name === listName);

    if(list === undefined) {
        return false;
    };

    return true;
}

function getAllLists() {
    return [...Object.values(defaultLists), ...userLists];
}

function getUserLists() {
    return userLists;
}

function getDefaultLists() {
    return defaultLists;
}

function getSelectedList() {
    return selectedList;
}

function getListByName(listName) {
    if(!listFound(listName)) return;

    if(isUserList(listName)) {
        return userLists.find(list => list.name === listName);
    }

    listName = listName.toLowerCase().replaceAll(" ", "");

    for(const listKey in defaultLists) {
        let defaultListName = defaultLists[listKey].name.replaceAll(" ", "").toLowerCase();
        //TODO: fix allTasks
        if(defaultListName === listName){
            return defaultLists[listKey];
        }
    }
}

function getListTasks(listName) {
    const list = getListByName(listName);

    return list.tasks;
}

function getUncompletedTasks(listName) {
    return getListByName(listName).uncompletedTasks;
}

function getCompletedTasks(listName) {
    const list = getListByName(listName);
    return list.completedTasks;
}

function setSelectedList(list) {
    selectedList = list;
}

function createList(listName) {
    if(listFound(listName)) {
        console.error("Cannot create a list with the same name as an existing one");
        return;
    }

    const userList = new List(listName);

    userLists.push(userList);

    storage.storeUserList(userList);

    updateInboxList();
}

function deleteList(listName) {
    if(isDefaultList(listName)) {
        console.error("Cannot delete a default list");
        return;
    }

    const list = getListByName(listName);
    const listTasks = getListTasks(listName);

    // Delete all tasks in list
    for(let task of listTasks) {
        TaskManager.deleteTask(task.id);
    }

    userLists.splice(userLists.indexOf(list), 1);

    storage.removeList(list);

    updateInboxList();
}

function addTaskToList(listName, task) {
    if(!listFound(listName)) {
        console.error("List not found");
        return;
    }

    const list = getListByName(listName);

    list.addTask(task);    

    TaskManager.setProject(list, task.id);


    updateInboxList();
}

function removeTaskFromList(listName, task) {
    const list = getListByName(listName);

    list.tasks.splice(list.tasks.indexOf(task), 1);

    TaskManager.setProject(null, task.id);
    
    updateInboxList();
}

// FIXME: Element not changing index
// Change list indexs in userLists
function changeUserListIndex(originalIndex, targetIndex) {
    const placeHolder = {};

    const movingList = userLists[originalIndex];
    userLists.splice(originalIndex, 1, placeHolder);
    userLists.splice(targetIndex, 0, movingList);

    userLists.splice(userLists.indexOf(placeHolder), 1);
    updateInboxList();
}

// Change task index


// Functions to sort userLists 


// Keeps userLists array up to date in the inboxList
function updateInboxList() {
    defaultLists['inbox'].tasks = TaskManager.getAllTasks();
}

function selectedListIsUserList() {
    return isUserList(selectedList.name);
}

function fromJson(listJson) {
    let list = new List(listJson.name);

    list.tasks = listJson.tasks;
    list.id = listJson.id;
    userLists.push(list);

    sidebar.renderUserListBtn(list.name);
    updateInboxList();
}

export default {
    getAllLists,
    getUserLists, 
    getDefaultLists,
    getListByName,
    getListTasks,
    getUncompletedTasks,
    getCompletedTasks,
    getSelectedList,
    setSelectedList,
    createList,
    deleteList,
    addTaskToList,
    isUserList,
    removeTaskFromList,
    changeUserListIndex,
    selectedListIsUserList,
    fromJson
};