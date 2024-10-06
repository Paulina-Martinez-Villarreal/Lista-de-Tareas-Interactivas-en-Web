// Selección de elementos
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTask');
const errorMessage = document.getElementById('errorMessage');
const clearAllBtn = document.getElementById('clearAllBtn');

// Añadimos el mensaje que indica que no hay tareas pendientes
const emptyMessage = document.createElement('p');
emptyMessage.id = 'emptyMessage';
emptyMessage.textContent = 'No tienes tareas pendientes';
taskList.parentNode.insertBefore(emptyMessage, taskList); // Insertar el mensaje antes de la lista de tareas

// Función para agregar una tarea
function addTask(event) {
    event.preventDefault(); // Evitar que el formulario recargue la página

    const taskText = newTaskInput.value.trim(); // Capturar y limpiar el texto ingresado

    if (taskText === '') {
        // Mostrar el mensaje de error si la tarea está vacía
        errorMessage.style.display = 'block';
        return;
    } else {
        // Ocultar el mensaje de error si hay texto
        errorMessage.style.display = 'none';
    }

    // Crear un nuevo elemento li
    const li = document.createElement('li');
    li.textContent = taskText;

    // Crear botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = () => removeTask(li);

    // Añadir el botón al elemento li
    li.appendChild(deleteButton);

    // Añadir la tarea a la lista
    taskList.appendChild(li);

    // Limpiar el campo de entrada
    newTaskInput.value = '';

    // Guardar en localStorage
    saveTasksToLocalStorage();

    // Actualizar la visibilidad del mensaje de "No tienes tareas pendientes"
    updateEmptyMessage();
}

// Evento de envío del formulario
taskForm.addEventListener('submit', addTask);

// Función para eliminar una tarea
function removeTask(taskItem) {
    taskItem.remove();
    // Actualizar localStorage
    saveTasksToLocalStorage();

    // Actualizar la visibilidad del mensaje de "No tienes tareas pendientes"
    updateEmptyMessage();
}

// Función para marcar como completada
function toggleCompleteTask(event) {
    event.target.classList.toggle('completed');
    saveTasksToLocalStorage(); // Guardar el estado de completado
}

// Añadir la capacidad de marcar como completada al hacer clic en la tarea
taskList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        toggleCompleteTask(event);
    }
});

// Función para guardar las tareas en localStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.firstChild.textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para cargar tareas desde localStorage
function loadTasksFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => removeTask(li);

        li.appendChild(deleteButton);

        if (task.completed) {
            li.classList.add('completed');
        }

        taskList.appendChild(li);
    });

    // Actualizar la visibilidad del mensaje de "No tienes tareas pendientes"
    updateEmptyMessage();
}

// Función para actualizar el mensaje de "No tienes tareas pendientes"
function updateEmptyMessage() {
    if (taskList.children.length === 0) {
        emptyMessage.style.display = 'block'; // Mostrar el mensaje
        clearAllBtn.style.display = 'none'; // Ocultar el botón de "Eliminar todas las tareas"
    } else {
        emptyMessage.style.display = 'none'; // Ocultar el mensaje
        clearAllBtn.style.display = 'block'; // Mostrar el botón de "Eliminar todas las tareas"
    }
}

// Función para eliminar todas las tareas
function clearAllTasks() {
    taskList.innerHTML = ''; // Limpiar la lista de tareas
    localStorage.removeItem('tasks'); // Eliminar las tareas de localStorage
    updateEmptyMessage(); // Actualizar el mensaje de "No tienes tareas pendientes"
}

// Evento para el botón de eliminar todas las tareas
clearAllBtn.addEventListener('click', clearAllTasks);

// Cargar tareas almacenadas cuando se carga la página
window.onload = loadTasksFromLocalStorage;
