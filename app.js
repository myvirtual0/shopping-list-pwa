const apiUrl = 'https://script.google.com/macros/s/AKfycby2LomJsyJt4TI6QjvwAoj8yS_466ObrtT0BSC8gmK04jNxlt_sR-C_jxu1jNyqThpw/exec';  // Replace with your Apps Script URL

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log("User signed in: " + profile.getName());
    document.getElementById('content').style.display = 'block';
    loadShoppingList();
    loadToDoList();
}

function loadShoppingList() {
    fetch(`${apiUrl}?sheet=ShoppingList`)
        .then(response => response.json())
        .then(data => {
            const shoppingList = document.getElementById('shopping-list');
            shoppingList.innerHTML = '';
            data.forEach(item => {
                shoppingList.innerHTML += `<li>${item[0]} - ${item[1]}</li>`;
            });
        });
}

function loadToDoList() {
    fetch(`${apiUrl}?sheet=ToDoList`)
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = '';
            data.forEach(task => {
                todoList.innerHTML += `<li>${task[0]} - Due: ${task[1]}</li>`;
            });
        });
}

document.getElementById('add-item-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const item = document.getElementById('item').value;
    const quantity = document.getElementById('quantity').value;

    fetch(`${apiUrl}?sheet=ShoppingList`, {
        method: 'POST',
        body: JSON.stringify([item, quantity]),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => loadShoppingList());
});

document.getElementById('add-task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const task = document.getElementById('task').value;
    const dueDate = document.getElementById('due-date').value;

    fetch(`${apiUrl}?sheet=ToDoList`, {
        method: 'POST',
        body: JSON.stringify([task, dueDate]),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => loadToDoList());
});
