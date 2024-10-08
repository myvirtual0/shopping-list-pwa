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
            // Skip the first row (header)
            data.slice(1).forEach(item => {
                shoppingList.innerHTML += `<li>${item[0]} - Quantity: ${item[1]} - Bought: ${item[2]} - Price: ${item[3]}</li>`;
            });
        })
        .catch(err => console.error("Error loading shopping list:", err));
}

function loadToDoList() {
    fetch(`${apiUrl}?sheet=ToDoList`)
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = '';
            // Skip the first row (header)
            data.slice(1).forEach(task => {
                todoList.innerHTML += `<li>${task[0]} - Due: ${task[1]} - Completed: ${task[2]}</li>`;
            });
        })
        .catch(err => console.error("Error loading to-do list:", err));
}

document.getElementById('add-item-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const item = document.getElementById('item').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value || 0;  // Include price if applicable
    const bought = false;  // Default value for new items

    fetch(`${apiUrl}?sheet=ShoppingList`, {
        method: 'POST',
        body: JSON.stringify([item, quantity, bought, price]),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => loadShoppingList())
    .catch(err => console.error("Error adding item:", err));
});

document.getElementById('add-task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const task = document.getElementById('task').value;
    const dueDate = document.getElementById('due-date').value;
    const completed = false;  // Default value for new tasks

    fetch(`${apiUrl}?sheet=ToDoList`, {
        method: 'POST',
        body: JSON.stringify([task, dueDate, completed]),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => loadToDoList())
    .catch(err => console.error("Error adding task:", err));
});
