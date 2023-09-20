import { validateUserType, registerUser } from './requests.js';
import { toastRegister } from './modal.js';

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
  const menu = document.querySelector('.register__header--nav');
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

function showLevelOptionsList() {
  const selectContainer = document.querySelector(
    '.register__form--selectLevel'
  );
  const selectArrow = document.querySelector('.form__select--downArrow');
  const selectContainerText = document.querySelector(
    '.register__form--selectLevel > p'
  );
  const optionsContainer = document.querySelector(
    '.form__select--levelOptions'
  );
  const levelOptions = document.querySelectorAll('.select__level');

  selectArrow.addEventListener('click', () => {
    selectContainer.removeChild(selectContainerText);
    selectContainerText.innerText = 'Nível profissional';
    selectContainerText.style.color = 'var(--black50)';
    selectContainer.insertAdjacentElement('afterbegin', selectContainerText);
    optionsContainer.classList.toggle('hidden');
  });
  levelOptions.forEach(option => {
    option.addEventListener('click', event => {
      optionsContainer.classList.toggle('hidden');
      const levelName = event.target.innerText;
      const levelValue = event.target.dataset.value;
      selectContainer.removeChild(selectContainerText);
      selectContainerText.innerText = levelName;
      selectContainerText.style.color = 'var(--black100)';
      selectContainerText.dataset.value = levelValue;
      selectContainer.insertAdjacentElement('afterbegin', selectContainerText);
    });
  });
}
showLevelOptionsList();

function handleRegister() {
  const inputs = document.querySelectorAll('.signup__input');
  const signupBtn = document.querySelector('.register__form--signupBtn');
  const levelSelect = document.querySelector(
    '.register__form--selectLevel > p'
  );

  const registerBody = {};

  inputs.forEach(input => {
    input.addEventListener('click', () => {
      inputs.forEach(input => {
        input.classList.remove('invalid');
      });
    });
  });

  signupBtn.addEventListener('click', async event => {
    event.preventDefault();

    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      if (input.value === '') {
        const message = 'Por favor, preencha todos os campos assinalados!';
        return handleRegisterError(3, message);
      } else {
        registerBody[input.name] = input.value;
      }
    }

    if (levelSelect.dataset.value) {
      registerBody[levelSelect.dataset.name] = levelSelect.dataset.value;
      levelSelect.dataset.value = '';
    }

    setTimeout(async () => {
      const signup = await registerUser(registerBody);
      if (typeof signup !== 'object') {
        const message = 'Email já cadastrado no sistema!';
        handleRegisterError(1, message);
      } else {
        toastRegister(true, 'Usuário cadastrado com sucesso!');
      }
    }, 1000);
  });
}
handleRegister();

function handleRegisterError(number, message) {
  const inputs = document.querySelectorAll('.signup__input');
  const emailInput = document.querySelector('.register__form--emailInput');

  if (number === 3) {
    inputs.forEach(input => {
      input.classList.add('invalid');
    });
  } else if (number === 1) {
    emailInput.classList.add('invalid');
  }

  toastRegister(false, message);
}
