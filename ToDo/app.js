const todoInput = document.querySelector('.todo-input')
const todoButton = document.querySelector('.todo-button')
const todoList = document.querySelector('.todo-list')
const filterOption = document.querySelector('.filter-todo')


document.addEventListener('DOMContentLoaded', getTodos)
todoButton.addEventListener('click', addTodo)
todoList.addEventListener('click', del_chek)
filterOption.addEventListener('change', filterTodo)


function addTodo(event) {
    event.preventDefault();
    const todoDiv = document.createElement('div')
    todoDiv.classList.add('todo')

    const newTodo = document.createElement('li')
    newTodo.innerText = todoInput.value
    newTodo.classList.add('todo-item')

    saveLocal(todoInput.value)

    todoDiv.appendChild(newTodo)

    const completedButton = document.createElement('button')
    completedButton.innerHTML = '<i class=\"fas fa-check\"></i>'
    completedButton.classList.add('complete-btn')
    todoDiv.appendChild(completedButton)


    const delButton = document.createElement('button')
    delButton.innerHTML = '<i class=\"fas fa-trash\"></i>'
    delButton.classList.add('trash-btn')
    todoDiv.appendChild(delButton)

    todoList.appendChild(todoDiv)
    todoInput.value = ""
}

function del_chek(event) {
    const item = event.target;

    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;

        todo.classList.add('fall')
        removeLocal(todo)
        todo.addEventListener('transitionend', function () {
            todo.remove()
        })
    }

    if (item.classList[0] === 'complete-btn') {
        const todo = item.parentElement;
        todo.classList.toggle('completed')
    }

}

function filterTodo(event) {
    const todos = todoList.childNodes;

    todos.forEach((todo) => {
        switch (event.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    })


}

function saveLocal(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem('todos'))
    }
    todos.push(todo)
    localStorage.setItem('todos', JSON.stringify(todos))

}

function getTodos() {

    let todos;

    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem('todos'))
    }

    todos.forEach((todo) => {

        const todoDiv = document.createElement('div')
        todoDiv.classList.add('todo')

        const newTodo = document.createElement('li')
        newTodo.innerText = todo
        newTodo.classList.add('todo-item')

        todoDiv.appendChild(newTodo)

        const completedButton = document.createElement('button')
        completedButton.innerHTML = '<i class=\"fas fa-check\"></i>'
        completedButton.classList.add('complete-btn')
        todoDiv.appendChild(completedButton)


        const delButton = document.createElement('button')
        delButton.innerHTML = '<i class=\"fas fa-trash\"></i>'
        delButton.classList.add('trash-btn')
        todoDiv.appendChild(delButton)

        todoList.appendChild(todoDiv)

    });
}

function removeLocal(todo) {
    let todos;
    const todoIndex = todo.children[0].innerText;

    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {

        todos = JSON.parse(localStorage.getItem('todos'))
    }

    todos.splice(todos.indexOf(todoIndex), 1);

    localStorage.setItem('todos', JSON.stringify(todos))

}