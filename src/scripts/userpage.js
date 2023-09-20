import {
  validateUserType,
  getEmployeeInfo,
  getAllEmployeesFromDepartment,
  getAllDepartmentsFromCompany,
  updateUserInfo,
} from './requests.js';

import { renderCoworkersList } from './render.js';
import { toastModal } from './modal.js';

async function authentication() {
  const token = localStorage.getItem('@kenzieEmpresas:token');
  if (!token) {
    window.location.replace('../../index.html');
  } else {
    const isAdmin = await validateUserType(token);
    if (isAdmin) {
      window.location.replace('./adminpage.html');
    }
  }
}
authentication();

function logout() {
  const logoutBtn = document.querySelector('.header__nav--logout');

  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    setTimeout(() => {
      window.location.replace('../../index.html');
    }, 500);
  });
}
logout();

function showMenu() {
  const menuBtns = document.querySelectorAll('.menu__button');
  const menu = document.querySelector('.userpage__header--nav');
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

async function renderUserpage() {
  showEditModal();

  const user = await getEmployeeInfo();
  const userName = document.querySelector('.user__info--name');
  userName.innerText = user.username;
  const userEmail = document.querySelector('.user__details--email');
  userEmail.innerText = `Email: ${user.email}`;
  const professionalLevel = document.querySelector(
    '.user__details--professionalLevel'
  );
  const workType = document.querySelector('.user__details--workType');

  if (user.professional_level) {
    professionalLevel.innerText = `Cargo: ${user.professional_level}`;
  } else {
    professionalLevel.innerText = 'Cargo: -----';
  }
  if (user.kind_of_work) {
    workType.innerText = `Tipo de trabalho: ${user.kind_of_work[0].toUpperCase()}${user.kind_of_work.slice(
      1
    )}`;
  } else {
    workType.innerText = 'Tipo de trabalho: -----';
  }

  const departmentInfo = await getAllEmployeesFromDepartment();

  const coworkersSection = document.querySelector('.userpage__main--coworkers');
  const coworkersHeader = document.querySelector(
    '.userpage__coworkers--header'
  );
  const coworkersList = document.querySelector('.userpage__coworkers--list');
  const coworkersListMessage = document.querySelector(
    '.userpage__coworkers--none'
  );
  coworkersListMessage.classList.add('hidden');
  coworkersList.classList.remove('hidden');

  if (departmentInfo.length === 1) {
    const companyInfo = await getAllDepartmentsFromCompany();
    coworkersHeader.classList.remove('hidden');
    coworkersHeader.innerText = `${companyInfo.name} - ${departmentInfo[0].name}`;

    const allEmployeesFromDepartment = departmentInfo[0].users;
    const coworkers = allEmployeesFromDepartment.filter(
      employees => employees.uuid !== user.uuid
    );
    renderCoworkersList(coworkers);

    if (coworkers.length < 1) {
      coworkersListMessage.innerText =
        'Nenhum colega de trabalho no seu departamento.';
      coworkersList.classList.add('hidden');
      coworkersListMessage.classList.remove('hidden');
    }
  } else {
    coworkersSection.style.padding = '0';
    coworkersListMessage.innerText = 'Você ainda não foi contratado.';
    coworkersList.classList.add('hidden');
    coworkersListMessage.classList.remove('hidden');
  }
}
renderUserpage();

function showEditModal() {
  const modalController = document.querySelector('.modal__controller');
  const editUserBtn = document.querySelector('.user__interaction--edit');
  editUserBtn.addEventListener('click', () => {
    const submitBtn = document.querySelector('.modal__container--submitBtn');
    submitBtn.addEventListener('click', async event => {
      event.preventDefault();

      const editedUser = handleEdit();
      if (typeof editedUser === 'object') {
        await updateUserInfo(editedUser);

        renderUserpage();

        modalController.close();
      }
    });
    showModal();
    closeModal();
  });
}

function handleEdit() {
  const modalController = document.querySelector('.modal__controller');
  const inputs = modalController.querySelectorAll('.modal__input');

  const objectBody = {};

  inputs.forEach(input => {
    input.classList.remove('invalid');
    input.addEventListener('click', () => {
      inputs.forEach(input => {
        input.classList.remove('invalid');
      });
    });
  });

  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    objectBody[input.name] = input.value;
  }

  const checkInputs = Object.values(objectBody).filter(
    inputValues => inputValues !== ''
  );

  if (checkInputs.length < 1) {
    const message = 'Por favor, altere pelo menos um campo.';
    toastModal(message);
    return handleEditError();
  }

  inputs.forEach(input => {
    input.value = '';
  });
  return objectBody;
}

function handleEditError() {
  const modalController = document.querySelector('.modal__controller');
  const inputs = modalController.querySelectorAll('.modal__input');

  inputs.forEach(input => {
    input.classList.add('invalid');
  });
}

function showModal() {
  const modalController = document.querySelector('.modal__controller');
  modalController.close();
  modalController.showModal();
}

function closeModal() {
  const modalController = document.querySelector('.modal__controller');
  const closeModal = document.querySelector('.modal__container--closeBtn');
  closeModal.addEventListener('click', () => {
    modalController.close();
  });
}
