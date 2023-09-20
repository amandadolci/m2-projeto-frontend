import { validateUserType, loginRequest } from './requests.js';
import { toastLogin } from './modal.js';

async function authentication() {
  const token = localStorage.getItem('@kenzieEmpresas:token');
  if (token) {
    const isAdmin = await validateUserType(token);
    if (isAdmin) {
      window.location.replace('./adminpage.html');
    } else {
      window.location.replace('./userpage.html');
    }
  }
}
authentication();

function showMenu() {
  const menuBtns = document.querySelectorAll('.menu__button');
  const menu = document.querySelector('.login__header--nav');
  const background = document.querySelector('.header--after');

  menuBtns.forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(() => {
        menuBtns.forEach(button => {
          button.classList.toggle('hidden');
        });
        menu.classList.toggle('hidden');
        background.classList.toggle('hidden');
      }, 150);
    });
  });
}
showMenu();

async function handleLogin() {
  const inputs = document.querySelectorAll('.login__input');
  const loginBtn = document.querySelector('.login__form--loginBtn');
  const loginBody = {};

  inputs.forEach(input => {
    input.addEventListener('click', () => {
      inputs.forEach(input => {
        input.classList.remove('invalid');
      });
    });
  });

  loginBtn.addEventListener('click', async event => {
    event.preventDefault();

    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      if (input.value === '') {
        const message = 'Por favor, preencha ambos os campos!';
        return handleLoginError(message);
      } else {
        loginBody[input.name] = input.value;
      }
    }

    setTimeout(async () => {
      const login = await loginRequest(loginBody);
      handleLoginError(login);
    }, 500);
  });
}
handleLogin();

function handleLoginError(message) {
  const inputs = document.querySelectorAll('.login__input');
  const token = JSON.parse(localStorage.getItem('@kenzieEmpresas:token'));

  if (message !== token) {
    inputs.forEach(input => {
      input.classList.add('invalid');
    });
    toastLogin(message);
  }
}
