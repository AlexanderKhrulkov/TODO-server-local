import { createTodoAppServer } from "/server-todo.js";
import { createTodoItemElement } from "./server-todo.js";
(function () {

  let listArray = [], listName = '';
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
  // Переключатель хранилищ
  const switchBtn = document.querySelector('.storage-switch');
  const switchIndicator = document.querySelector('.storage-indicator');
  const storage1 = 'Перейти на серверное хранилище';
  const storage2 = 'Перейти на локальное хранилище';
  const currentStorage = localStorage.getItem('storage');
  if (currentStorage === 'Локальное') switchBtn.textContent = storage1;
  if (currentStorage === 'Серверное') switchBtn.textContent = storage2;
  switchIndicator.textContent = localStorage.getItem('storage') + ' хранилище';
  console.log(localStorage.getItem('storage'));

  switchBtn.addEventListener('click', () => {
    if (localStorage.getItem('storage') === 'Локальное') {
      switchBtn.textContent = storage2;
      localStorage.setItem('storage', 'Серверное');
      console.log(localStorage.getItem('storage'));
      window.location.reload();
    }
    else {
      switchBtn.textContent = storage1;
      localStorage.setItem('storage', 'Локальное');
      console.log(localStorage.getItem('storage'));
      window.location.reload();
    }
  })




  //Создаёт дело

  function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');

      for (const listItem of listArray) {
        if (listItem.id == obj.id) listItem.done = !listItem.done
      }

      saveList(listArray, listName);
    })
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();

        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) listArray.splice(i, 1)
        }
        console.log(listArray);
        saveList(listArray, listName);
      }
    })

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (obj.done == true) item.classList.add('list-group-item-success');

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1;
  }

  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  //Собирает всё вместе

  function createTodoApp(container, title = 'Список дел', keyName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTotoItemForm();
    let todoList = createTodoList();

    listName = keyName;


    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName);

    if (localData !== null && localData !== '') listArray = JSON.parse(localData);

    for (const itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false
      }

      let todoItem = createTodoItem(newItem);

      listArray.push(newItem);
      console.log(listArray);

      saveList(listArray, listName);
      todoList.append(todoItem.item);
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = '';
    })
  }


  window.createTodoApp = createTodoApp;

  // Выбор хранилища

  function chooseStorage(title, keyName) {
    if (localStorage.getItem('storage') === 'Локальное') createTodoApp(document.getElementById('todo-app'), title, keyName);
    if (localStorage.getItem('storage') === 'Серверное') createTodoAppServer(document.getElementById('todo-app'), title, keyName);
  }
  window.chooseStorage = chooseStorage;

})();

