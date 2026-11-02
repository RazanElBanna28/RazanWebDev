interface Todo { id: number; text: string; completed: boolean; }
let todos: Todo[] = [];
let currentFilter: 'all' | 'active' | 'completed' = 'all';

const todoInput = document.getElementById('todoInput') as HTMLInputElement;
const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
const todoList = document.getElementById('todoList') as HTMLUListElement;
const itemCount = document.getElementById('itemCount') as HTMLSpanElement;
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn') as HTMLButtonElement;
const clearAllBtn = document.getElementById('clearAllBtn') as HTMLButtonElement;

// Add Todo
addBtn.addEventListener('click', () => {
    if (todoInput.value.trim() !== '') {
        todos.push({ id: Date.now(), text: todoInput.value.trim(), completed: false });
        todoInput.value = '';
        renderTodos();
    }
});

// Toggle Checkbox w Delete Button
todoList.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const li = target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (target.tagName.toLowerCase() === 'input' && (target as HTMLInputElement).type === 'checkbox') {
        const todo = todos.find(t => t.id === id);
        if (todo) todo.completed = !todo.completed;
        renderTodos();
    } else if (target.classList.contains('delete-btn')) {
        todos = todos.filter(t => t.id !== id);
        renderTodos();
    }
});

// Double Click 3ashan t-edity
todoList.addEventListener('dblclick', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('todo-text')) {
        const li = target.closest('li') as HTMLLIElement;
        li.classList.add('editing');
        const editInput = li.querySelector('.edit-input') as HTMLInputElement;
        editInput.focus();

        editInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const id = Number(li.dataset.id);
                const todo = todos.find(t => t.id === id);
                if (todo && editInput.value.trim() !== '') {
                    todo.text = editInput.value.trim();
                }
                li.classList.remove('editing');
                renderTodos();
            }
        }, { once: true });
    }
});

// Filters (All, Active, Completed)
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.filter-btn.active')?.classList.remove('active');
        const target = e.target as HTMLButtonElement;
        target.classList.add('active');
        currentFilter = target.dataset.filter as 'all' | 'active' | 'completed';
        renderTodos();
    });
});

// Clear Buttons
clearCompletedBtn.addEventListener('click', () => { todos = todos.filter(t => !t.completed); renderTodos(); });
clearAllBtn.addEventListener('click', () => { todos = []; renderTodos(); });

// Render el HTML fel list
function renderTodos() {
    todoList.innerHTML = '';
    let filteredTodos = todos;
    if (currentFilter === 'active') filteredTodos = todos.filter(t => !t.completed);
    if (currentFilter === 'completed') filteredTodos = todos.filter(t => t.completed);

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo.id.toString();
        if (todo.completed) li.classList.add('completed');
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <input type="text" class="edit-input" value="${todo.text}">
            <button class="delete-btn">🗑️</button>
        `;
        todoList.appendChild(li);
    });

    const activeCount = todos.filter(t => !t.completed).length;
    itemCount.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
}