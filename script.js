const taskInput = document.querySelector(".task-input input"),//Selects input field of to-do
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");//Serves as a container for holding the list of todos

let editId,isEditTask = false;// if isEditTask=false, it adds a new task.
//Getting localStorage to-do list
let todos = JSON.parse(localStorage.getItem("todo-list"));//Makes a key called to-do list

filters.forEach(btn =>{
    btn.addEventListener("click", () =>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {//shows todos
    let li = "";/*li variable is initialized as an empty string, you can take any
    variable name but li is used for comfort of reading.The variable li holds a string that
    contains all the HTML code for the todos.*/
    if (todos) {/*Checks if todos array exists and is not empty.Doesn't explicitly check if todos is empty. The condition
     if (todos) checks if todos is truthy or not, meaning it checks if todos is not null, undefined, or any other falsy value.*/
        todos.forEach((todo, id) => {/*todo:This represents the current element in the array being processed.
        todo represents a single todo item, which is an object with properties like name and status.
        For example, todo.name: would give you the name of the todo item.*/

            //id represents the current element in the array that is being processed.

            //If to-do is completed, set the isCompleted value to checked
            let isCompleted = todo.status === "completed" ? "checked" : "";

            if(filter === todo.status || filter ==="all"){
                //HTML code appended to "li" variable to make a list of todos.
                li += `<li class="task">
            <label for="${id}">
                <input onclick="updateStatus(this)"  type="checkbox" id="${id}" ${isCompleted}>
                <p class ="${isCompleted}">${todo.name}</p>
            </label>
            <div class="settings">
                <i onclick="showMenu(this)"  class="uil uil-ellipsis-h"></i>
                <ul class="task-menu">
                    <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i><span>Edit</span></li>
                    <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i><span>Delete</span></li>
                </ul>
            </div>
        </li>`;//HTML code that is appended, ends here.
            }
        });
    }
    taskBox.innerHTML = li || `<span>You don't have any tasks here.</span>` ;/*Is responsible for updating the content of the
    taskBox element with the generated HTML code for the to-do list. innerHTML  is a property of DOM elements
    in JavaScript that allows you to get or set the HTML content of an element as a string.
    Example: To set the HTML content of an element,
    const element = document.getElementById("myElement");
    const newHTMLContent = "<p>Hello, <strong>world</strong>!</p>";
    element.innerHTML = newHTMLContent;

    */
}

showTodo("all");

function showMenu(selectedTask) {
    //Getting taskMenu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        //Removing show class from the task menu on the document click
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId, taskName) {//Is called when user clicks Edit
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;//The taskInput value is set to the current taskName.This places the to-do list in the input area to edit
}

function deleteTask(deleteId) {
    //Removing selected task from array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", () =>{
    //Removing all task from array/todos
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});

function updateStatus(selectedTask) {
    //Getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed"
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending"
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();//Trims for whitespaces in the entered to-do list.
    if (e.key === "Enter" && userTask) {
        if (!isEditTask) {//If edit task is false.
            if (!todos) { //If todos dosen't exist, pass an empty array to todos.
                todos = [];
            }
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo) //Adding new task to todos.
        } else {//flow jumps from  editTask(taskId, taskName) to here, as the isEditTask is true.

            todos[editId].name = userTask;
            isEditTask = false;//sets it back to false.To avoid logic error.
        }
        taskInput.value = "";//clears the input field after the user has either added or edited a new task
        localStorage.setItem("todo-list", JSON.stringify(todos));//stores the updated todos  as a JSON string
        showTodo("all");//shows to-do list with latest data
    }
});