function storeSomething(key, item) {
    localStorage.setItem(key, item);
    //addFeature("Just stored " + key + ", " + item + " in Local Storage");
}

function getSomething() {
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.substring(0, 4) == "todo") {
            var item = localStorage.getItem(key);
            var todoItem = JSON.parse(item);
            todos.push(todoItem);
        }
    }
    addTodosToPage();
}

function removeSomething(key) {
    localStorage.removeItem(key);
}