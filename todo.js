function Todo(id, task, who, dueDate, done) {
    this.id = id;
    this.task = task;
    this.who = who;
    this.dueDate = dueDate;
    this.done = done;
}

var todos = new Array();

function init() {
    var submitButton = document.getElementById("submit");
    submitButton.onclick = getFormData;
    
    var searchButton = document.getElementById("searchButton");
    searchButton.onclick = searchText;
    
    getSomething();
}

function searchText() {
    var searchTerm = document.getElementById("searchTerm").value;
    
    searchTerm = searchTerm.trim();
    if (searchTerm == null || searchTerm == "") {
        alert("Please enter a string to search for");
        return;
    }
    clearResultsList();
    searchTodoArray( searchTerm );
}

function searchTodoArray( searchTerm ) {
    var re = new RegExp(searchTerm, "ig");
    var resultsWho = "";
    var resultsTask = "";
    var bresultsFound = false;
    for (var i = 0; i < todos.length; i++) {
        resultsWho = todos[i].who.match(re);
        resultsTask = todos[i].task.match(re);
        if (resultsWho != null || resultsTask != null) {
            showResults(todos[i]);
            bresultsFound = true;
        }
    }
    if (!bresultsFound) {
        alert("No match found");
    }
}

function clearResultsList() {
    var ul = document.getElementById("matchResultsList");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
}

function showResults(results) {
    var ul = document.getElementById("matchResultsList");
    var frag = document.createDocumentFragment();
    var li = document.createElement("li");
    li.innerHTML =results.who + " needs to " + results.task;
    frag.appendChild(li);
    
    ul.appendChild(frag);
}

function addTodosToPage() {
    var ul = document.getElementById("todoList");
    var listFragment = document.createDocumentFragment();
    for (var i = 0; i < todos.length; i++) {
        var todoItem = todos[i];
        var li = createNewTodo(todoItem);
        listFragment.appendChild(li);
    }
    ul.appendChild(listFragment);
}

function addTodoToPage(todoItem) {
    var ul = document.getElementById("todoList");
    var li = createNewTodo(todoItem);
    ul.appendChild(li);
    document.forms[0].reset();
}

function createNewTodo(todoItem) {
    var li = document.createElement("li");
    li.setAttribute("id", todoItem.id);
    
    findLocation();
    
    var targetWhen = "";
    daysTarget = checkDate( todoItem.dueDate );
    if (daysTarget > 0 ) {
        targetWhen = " ("+ daysTarget + " days)";
    }
    else if ( daysTarget < 0 ) {
        daysTarget = Math.abs(daysTarget);
        targetWhen = " (OVERDUE by "+ daysTarget + " days)";
    }
    
    var spanTodo = document.createElement("span");
    spanTodo.innerHTML =
    todoItem.who + " needs to " + todoItem.task + " by " + todoItem.dueDate + targetWhen;
    
    
    var spanDone = document.createElement("span");
    if (!todoItem.done) {
        spanDone.setAttribute("class", "notDone");
        spanDone.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    else {
        spanDone.setAttribute("class","done");
        spanDone.innerHTML = "&nbsp;&#10004;&nbsp;";
    }
    spanDone.onclick = updateDone;
    
    var spanDelete = document.createElement("span");
    
    spanDelete.setAttribute("class", "delete");
    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";
    
    spanDelete.onclick = deleteItem;
    
    li.appendChild(spanDone);
    li.appendChild(spanTodo);
    li.appendChild(spanDelete);
    
    return li;
}

function getFormData() {
    var task = document.getElementById("task").value;
    if (checkInputText(task, "Please enter a task")) return;
    
    var who = document.getElementById("who").value;
    if (checkInputText(who, "Please enter a person to do the task")) return;
    
    var date = document.getElementById("dueDate").value;
    if (checkInputText(date, "Please enter a due date")) return;
    
    var id = (new Date()).getTime();
    var todoItem = new Todo(id, task, who, date);
    todos.push(todoItem);
    addTodoToPage(todoItem);
    saveTodoItem(todoItem);
}

function checkInputText(value, msg) {
    if (value == null || value == "") {
        alert(msg);
        return true;
    }
    return false;
}

function deleteItem(e) {
    var span = e.target;
    var id = span.parentNode.id;
    
    //console.log("delete an item: " + id);
    
    // find and remove the item in the array
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
            todos.splice(i, 1);
            break;
        }
    }
    
    // find and remove the item form storage
    var key = "todo" + id;
    removeSomething(key);
    
    // find and remove the item in the page
    var li = e.target.parentNode;
    var ul = document.getElementById("todoList");
    ul.removeChild(li);
}

function updateDone(e) {
    var span = e.target;
    var id = span.parentNode.id;
    
    console.log("set item as done: " + id);
    
    // find and update the item in the array
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
            todos[i].done = !todos[i].done;
            // find and update the items done in localStorage
            saveTodoItem(todos[i]);
            break;
        }
    }
    
    // find and remove the item in the page
    var li = e.target.parentNode;
    var ul = document.getElementById("todoList");
    ul.removeChild(li)
    //Add it back
    addTodoToPage(todos[i]);
    
}

function saveTodoItem(todoItem) {
    var key = "todo" + todoItem.id;
    var item = JSON.stringify(todoItem);
    storeSomething(key, item);
}

function addFeature(featureMessage) {
    var ul = document.getElementById("features");
    var li = document.createElement("li");
    li.innerHTML = featureMessage;
    ul.appendChild(li);
}

function checkDate( taskDueDate )
{
    var days = 0;
    try {
        var now = new Date();
        
        var aDate = new Date(taskDueDate);
        
        var diff = aDate.getTime() - now.getTime();
        days = Math.floor(diff / 1000 / 60 / 60 / 24);
    }
    catch (ex) {
        displayError(ex.message);
    }
    return days;
}
function displayError(e) {
    alert(e);
}

function showMap(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    
    myLocation = "( " + lat + ", " + long + " )";
    var locDiv = document.getElementById("geoLoc");
    
    var googleLatLong = new google.maps.LatLng(lat, long);
    var mapOptions = {
    zoom: 12,
    center: googleLatLong,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map_canvas");
    map = new google.maps.Map(mapDiv, mapOptions);
    map.panTo(googleLatLong);
}