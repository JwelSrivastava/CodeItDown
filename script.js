'use strict';
// select all DOM elements
const headerTime = document.querySelector("[data-header-time]");
const menuTogglers = document.querySelectorAll("[data-menu-toggler]");
const menu = document.querySelector("[data-menu]");
const themeBtns = document.querySelectorAll("[data-theme-btn]");
const modalTogglers = document.querySelectorAll("[data-modal-toggler]");
const welcomeNote = document.querySelector("[data-welcome-note]");
const taskList = document.querySelector("[data-task-list]");
const taskInput = document.querySelector("[data-task-input]");
const modal = document.querySelector("[data-info-modal]");
let taskItem = {};
let taskRemover = {};

// store current date from build-in data object
const date = new Date();

// import task complete sound
const taskCompleteSound = new Audio("./assets/sounds/task-complete.mp3");

// convert weekday number to weekday name
// totalParmeter: 1;
// parameterValue: <numnber> 0-6;
const getWeekDayName = function (dayNumber) {
    switch (dayNumber) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Not a valid day!";
    }
}

// convert month number to month name
// totalParmeter: 1;
// parameterValue: <numnber> 0-11;
const getMonthName = function (monthNumber) {
    switch (monthNumber) {
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "Decemeber";
        default:
            return "Not a valid month!";
    }
}

// store weekday name, month name & month-of-day number
const weekDayName = getWeekDayName(date.getDay());
const monthName = getMonthName(date.getMonth());
const monthOfDay = date.getDate();

// update headerTime date
headerTime.textContent = `${weekDayName}, ${monthName} ${monthOfDay}`;


// toggle active class on element
// totalParameter: 1;
//  parameterValue: <object> elementNode;
const elemToggler = function (elem) {
    elem.classList.toggle("active");
}
// toggle active class on multiple elements
// totalParameter: 2;
//  parameterValue: <object> elementNode, <function> any;
const addEventOnMultiElem = function (elems, event) {
    for (let i = 0; i < elems.length; i++) {
        elems[i].addEventListener("click", event);
    }
}

// create taskItem elementNode and return it
// totalParameter: 1;
// parameterValue: <string> any;
const taskItemNode = function (taskText) {
    const createTaskItem = document.createElement("li");
    createTaskItem.classList.add("task-item");
    createTaskItem.setAttribute("data-task-item", "");

    createTaskItem.innerHTML = `

    <button class="item-icon" data-task-remove="complete">
        <span class="check-icon"></span>
    </button>
        <p class="item-text">${taskText}</p>
    <button class="item-action-btn" aria-label="Remove Task" data-task-remove>
        <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
    </button>

    `;

    return createTaskItem;
}

// task input validation
// totalParameter: 1;
// parameterValue: <string> any;
const taskInputValidation = function (taskIsValid) {
    if (taskIsValid) {

        // if there is an existing task,
        // then the new task will be added before it
        if (taskList.childElementCount > 0) {
            taskList.insertBefore(taskItemNode(taskInput.value), taskItem[0]);
        }
        else {
            taskList.appendChild(taskItemNode(taskInput.value));
        }

        // after adding task on taskList, input fieldshould be empty
        taskInput.value = "";

        // hide the welcome note
        welcomeNote.classList.add("hide");

        // update taskItem DOM selection
        taskItem = document.querySelectorAll("[data-task-item]");
        taskRemover = document.querySelectorAll("[data-task-remove]");
    }
    else {
        // if user pass any false value like(0, "", undefined, null, NaN)
        console.log("Please eneter a valid task 💀");
    }
}

// if there is an existing task,
// the welcome note will be hodden
const removeWelcomeNote = function () {
    if (taskList.childElementCount > 0) {
        welcomeNote.classList.add("hide");
    } else {
        welcomeNote.classList.remove("hide");
    }
}

// removeTask when click on delete button or check button
const removeTask = function () {
    // select clicked taskItem
    const parentElement = this.parentElement;
    // if the task is completed, it should be removed after 250ms
    // if task is deleted, then it should be remove instant
    if (this.dataset.taskRemove === "complete") {
        parentElement.classList.add("complete"); // add "complete" class on taskItem
        taskCompleteSound.play(); // play taskCompleteSound

        setTimeout(function () {
            parentElement.remove(); // remove taskItem
            removeWelcomeNote(); // remove welcome note
        }, 250);
    } else {
        parentElement.remove(); // remove task
        removeWelcomeNote(); // remove parent note
    }
}

// add task function
const addTask = function () {
    // check the task input validation
    taskInputValidation(taskInput.value);
    // add EventListener to all taskItem checkbox and delete button
    addEventOnMultiElem(taskRemover, removeTask);
}

// add keypress listener on taskInput
taskInput.addEventListener("keypress", function (e) {
    // addTask if user press "Enter" key
    switch (e.key) {
        case "Enter":
            addTask();
            break;
    }
});

// toggle active class on menu click on menuBtn or dropdownLink
const toggleMenu = function () {
    elemToggler(menu);
}
addEventOnMultiElem(menuTogglers, toggleMenu);

// toggle active class on modal when click on dropdownLink or modal OKAY button
const toggleModal = function () {
    elemToggler(modal);
}
addEventOnMultiElem(modalTogglers, toggleModal);

// add "loaded" class on body when website is fully loaded
window.addEventListener("load", function () {
    document.body.classList.add("loaded");
});

// change body background when click on any themeBtn
const themeChanger = function () {
    // store hue value from clicked themeBtn
    const hueValue = this.dataset.hue;
    // create css property on root and set value from hueValue
    document.documentElement.style.setProperty("--hue", hueValue);
    // remove "active" class from all themeBtns
    for (let i = 0; i < themeBtns.length; i++) {
        if (themeBtns[i].classList.contains("active")) {
            themeBtns[i].classList.remove("active");
        }
    }
    // add "active" class on clicked themeBtn
    this.classList.add("active");
}

// add event on all themeBtns
addEventOnMultiElem(themeBtns, themeChanger);