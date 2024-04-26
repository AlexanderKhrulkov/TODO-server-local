 // Создаёт заголовок страницы

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //Создаёт форму ввода дела

  function createTotoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.setAttribute('disabled', true);

    input.addEventListener('input', function () {
      if (!input.textContent != '') {
        button.removeAttribute('disabled');
      }
      if (input.value === '') {
        button.setAttribute('disabled', true);
      }

    })

    form.addEventListener('submit', function () {
      button.setAttribute('disabled', true);
    })



    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };

  }

  //Создаёт список дел
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;

  }

  //Создаёт дело

  export function createTodoItemElement(todoItem, { onDone, onDelete }) {

    const doneClass = 'list-group-item-success';

    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = todoItem.name;

    if (todoItem.done) {
      item.classList.add(doneClass);
    }


    doneButton.addEventListener('click', function () {
      onDone({ todoItem, element: item });
      item.classList.toggle(doneClass, todoItem.done);

    })
    deleteButton.addEventListener('click', function () {
      onDelete({ todoItem, element: item });
    })

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return item;
  }

  //Собирает всё вместе

  export async function createTodoAppServer(container, title, owner) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTotoItemForm();
    let todoList = createTodoList();
    const handlers = {
      onDone({ todoItem }) {
        todoItem.done = !todoItem.done;
        fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ done: todoItem.done }),
          headers: {
            'Content-Type': 'application/json',
          }
        })
      },
      onDelete({ todoItem, element }) {
        if (!confirm('Вы уверены?')) {
          return;
        }
        element.remove();
        fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
          method: 'DELETE',
        })
      }
    }


    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
    const todoItemList = await response.json();

    todoItemList.forEach(todoItem => {
      const todoItemElement = createTodoItemElement(todoItem, handlers);
      todoList.append(todoItemElement);
    });

    todoItemForm.form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          name: todoItemForm.input.value.trim(),
          owner,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const todoItem = await response.json();

      let newItem = {
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false
      }

      let todoItemElement = createTodoItemElement(todoItem, handlers);





      listArray.push(newItem);
      console.log(listArray);
      todoList.append(todoItemElement);
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = '';
    })
  }

  window.createTodoAppServer = createTodoAppServer;

