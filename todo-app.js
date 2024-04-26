(function () {

  let listArray = [], listName = '';
  // Создаёт заголовок страницы

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  const switchBtn = document.querySelector('.storage-switch');
  const switchIndicator = document.querySelector('.storage-indicator');
  const storage1 = 'Хранилище 1';
  const storage2 = 'Хранилище 2';
  switchIndicator.textContent = 'Хранилище ' + localStorage.getItem('storage');
  console.log(localStorage.getItem('storage'));

  switchBtn.addEventListener('click', () => {
    if (localStorage.getItem('storage') === '1') {
      switchIndicator.textContent = storage2;
      localStorage.setItem('storage', '2');
      console.log(localStorage.getItem('storage'));
    }
    else {
      switchIndicator.textContent = storage1;
      localStorage.setItem('storage', '1');
      console.log(localStorage.getItem('storage'));
    }
  })

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

  function createTodoItemElement(todoItem, { onDone, onDelete }) {

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

      // for (const listItem of listArray) {
      //     if (listItem.id == obj.id) listItem.done = !listItem.done
      // }

      // saveList(listArray, listName);
    })
    deleteButton.addEventListener('click', function () {
      onDelete({ todoItem, element: item });
      // if (confirm('Вы уверены?')) {
      //     item.remove();

      //     // const currentName = item.firstChild.textContent;

      // for (let i = 0; i < listArray.length; i++) {
      //     if (listArray[i].id == obj.id) listArray.splice(i, 1)
      // }
      // console.log(listArray);
      // // saveList(listArray, listName);
      // }
    })

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // if(todoItem.done) item.classList.add(doneClass);

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return item;
  }

  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1;
  }

  // function saveList(arr, keyName) {
  //     localStorage.setItem(keyName, JSON.stringify(arr));
  // }

  //Собирает всё вместе

  async function createTodoApp(container, title, owner) {
    // let container = document.getElementById('todo-app');
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

    // listName = keyName;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
    const todoItemList = await response.json();

    todoItemList.forEach(todoItem => {
      const todoItemElement = createTodoItemElement(todoItem, handlers);
      todoList.append(todoItemElement);
    });

    // let localData = localStorage.getItem(listName);

    // if (localData !== null && localData !== '') listArray = JSON.parse(localData);

    // for (const itemList of listArray) {
    //     let todoItem = createTodoItem(itemList);
    //     todoList.append(todoItem.item);
    // }

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
      // localStorage.setItem('newItem', JSON.stringify(newItem));

      let todoItemElement = createTodoItemElement(todoItem, handlers);





      listArray.push(newItem);
      // localStorage.setItem('name', todoItemForm.input.value);
      // localStorage.setItem('done', newItem.done);
      console.log(listArray);
      // let test = localStorage.getItem('name');
      // let test2 = localStorage.getItem('done');
      // console.log(test);
      // console.log(test2);

      // saveList(listArray, listName);

      todoList.append(todoItemElement);
      // localStorage.getItem(todoItemForm.input.value);
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = '';
    })
  }





  // document.addEventListener('DOMContentLoaded', function() {
  //   createTodoApp(document.getElementById('my-todos'), 'Мои дела');
  //   createTodoApp(document.getElementById('mom-todos'), 'Дела для мамы');
  //   createTodoApp(document.getElementById('dad-todos'), 'Дела для папы');
  // });

  window.createTodoApp = createTodoApp;



})();

