import { hireEmployee, dismissEmployee } from './requests.js';

//TOAST
function createToast() {
  const main = document.querySelector('main');
  const toastContainer = document.createElement('div');

  toastContainer.classList.add('toast__container');

  main.appendChild(toastContainer);

  setTimeout(() => {
    toastContainer.classList.add('toast__remove');
  }, 3000);
  //   }, 5000); //3000

  setTimeout(() => {
    main.removeChild(toastContainer);
  }, 4990);
  //   }, 6990); //4990
}

export function toastLogin(message) {
  createToast();
  const toastContainer = document.querySelector('.toast__container');

  toastContainer.classList.add('toast__error');

  if (message === 'email invalid!') {
    toastContainer.innerText = 'Email inválido!';
  } else if (message === 'password invalid!') {
    toastContainer.innerText = 'Senha inválida!';
  } else {
    toastContainer.innerText = message;
  }
}

// TOAST REGISTER
export function toastRegister(success, message) {
  createToast();
  const toastContainer = document.querySelector('.toast__container');

  if (success) {
    toastContainer.classList.add('toast__success');
  } else {
    toastContainer.classList.add('toast__error');
  }
  toastContainer.innerText = message;
}

// TOAST MODAL
export function toastModal(message) {
  const modalContainer = document.querySelector('.modal__container');
  const toastContainer = document.createElement('div');

  toastContainer.classList.add('toast__container', 'toast__error');
  toastContainer.innerText = message;

  modalContainer.appendChild(toastContainer);

  setTimeout(() => {
    toastContainer.classList.add('toast__remove');
  }, 3000);

  setTimeout(() => {
    modalContainer.removeChild(toastContainer);
  }, 4990);
}

//MODAL
export function renderDeleteModal(object) {
  const modalContainer = document.querySelector('.modal__container');
  modalContainer.innerHTML = '';

  const closeModalBtn = document.createElement('img');
  closeModalBtn.classList.add('modal__container--closeBtn');
  closeModalBtn.src = '../assets/icons/X.svg';

  const modalDeleteContainer = document.createElement('div');
  modalDeleteContainer.classList.add('modal__container--delete');

  const modalTitle = document.createElement('h1');
  modalTitle.classList.add('modal__container--title');

  const confirmBtn = document.createElement('button');
  confirmBtn.classList.add('modal__container--confirmBtn', 'button--green');

  if (object.username) {
    modalTitle.innerText = `Realmente deseja remover o usuário ${object.username}?`;
    confirmBtn.innerText = 'Deletar';
  } else {
    modalTitle.innerText = `Realmente deseja deletar o departamento ${object.name} e demitir seus funcionários?`;
    confirmBtn.innerText = 'Confirmar';
  }

  modalDeleteContainer.append(modalTitle, confirmBtn);
  modalContainer.append(closeModalBtn, modalDeleteContainer);
}

export function renderEditModal(object = {}, allCompanies = []) {
  const modalContainer = document.querySelector('.modal__container');
  modalContainer.innerHTML = '';

  const closeModalBtn = document.createElement('img');
  closeModalBtn.classList.add('modal__container--closeBtn');
  closeModalBtn.src = '../assets/icons/X.svg';

  const modalTitle = document.createElement('h1');
  modalTitle.classList.add('modal__container--title');

  const inputsContainer = document.createElement('div');
  inputsContainer.classList.add('modal__container--inputs');

  const submitBtn = document.createElement('button');
  submitBtn.classList.add('modal__container--submitBtn', 'button--blue');

  if (!object) {
    modalTitle.innerText = 'Criar Departamento';
    // INPUTS CRIAR DEPARTAMENTO
    const departmentName = document.createElement('input');
    departmentName.classList.add('modal__input--text', 'modal__input');
    departmentName.name = 'name';
    departmentName.autocomplete = 'off';
    departmentName.placeholder = 'Nome do departamento';

    const departmentDescription = document.createElement('input');
    departmentDescription.classList.add('modal__input--text', 'modal__input');
    departmentDescription.name = 'description';
    departmentDescription.placeholder = 'Descrição';

    //SELECT
    const selectContainer = document.createElement('div');
    selectContainer.classList.add('modal__input--select', 'select');

    const selectPlaceholder = document.createElement('p');
    selectPlaceholder.innerText = 'Selecionar empresa';
    selectPlaceholder.dataset.name = 'company_uuid';

    const selectArrow = document.createElement('img');
    selectArrow.classList.add('modal__select--downArrow', 'downArrow');
    selectArrow.src = '../assets/icons/dropdown-arrow.svg';
    selectArrow.ariaLabel = 'Mostrar lista de empresas';

    const optionsContainer = document.createElement('ul');
    optionsContainer.classList.add(
      'modal__select--list',
      'options__container',
      'hidden'
    );

    allCompanies.forEach(company => {
      const option = document.createElement('li');
      option.classList.add('modal__select--option', 'option');
      option.innerText = company.name;
      option.dataset.companyId = company.uuid;
      optionsContainer.appendChild(option);
    });
    submitBtn.innerText = 'Criar o departamento';

    selectContainer.append(selectPlaceholder, selectArrow, optionsContainer);
    inputsContainer.append(
      departmentName,
      departmentDescription,
      selectContainer,
      submitBtn
    );
    modalContainer.append(closeModalBtn, modalTitle, inputsContainer);
  } else {
    if (object.username) {
      modalTitle.innerText = 'Editar Usuário';

      const selectOptions = [
        ['home office', 'presencial', 'hibrido'],
        ['estágio', 'júnior', 'pleno', 'sênior'],
      ];
      for (let i = 0; i < selectOptions.length; i++) {
        const option = selectOptions[i];
        //SELECT
        const selectContainer = document.createElement('div');
        selectContainer.classList.add('modal__input--select', 'select');

        const selectPlaceholder = document.createElement('p');

        const selectArrow = document.createElement('img');
        selectArrow.classList.add('modal__select--downArrow', 'downArrow');
        selectArrow.src = '../assets/icons/dropdown-arrow.svg';

        const optionsContainer = document.createElement('ul');
        optionsContainer.classList.add(
          'modal__select--list',
          'options__container',
          'hidden'
        );
        if (i === 0) {
          selectContainer.id = 'select__0';
          selectPlaceholder.innerText = 'Selecionar modalidade de trabalho';
          selectPlaceholder.dataset.name = 'kind_of_work';
          selectArrow.ariaLabel = 'Mostrar modalidades de trabalho';
        } else if (i === 1) {
          selectContainer.id = 'select__1';
          selectPlaceholder.innerText = 'Selecionar nível profissional';
          selectPlaceholder.dataset.name = 'professional_level';
          selectArrow.ariaLabel = 'Mostrar níveis profissionais';
        }

        option.forEach(element => {
          const option = document.createElement('li');
          option.classList.add('modal__select--option', 'option');
          option.innerText = element;
          option.dataset.value = element;
          optionsContainer.appendChild(option);
        });

        selectContainer.append(
          selectPlaceholder,
          selectArrow,
          optionsContainer
        );
        inputsContainer.appendChild(selectContainer);
      }

      submitBtn.innerText = 'Editar';
      inputsContainer.appendChild(submitBtn);
      modalContainer.append(closeModalBtn, modalTitle, inputsContainer);
    } else {
      // TEXTAREA EDITAR DEPARTAMENTO
      const textarea = document.createElement('textarea');
      textarea.classList.add('modal__input--textarea', 'modal__input');
      textarea.name = 'description';
      textarea.placeholder = 'Descrição do departamento';
      textarea.wrap = 'soft';
      textarea.value = object.description;

      modalTitle.innerText = 'Editar Departamento';
      submitBtn.innerText = 'Salvar alterações';
      inputsContainer.append(textarea, submitBtn);
      modalContainer.append(closeModalBtn, modalTitle, inputsContainer);
    }
  }
}

export function renderMoreDetailsModal(
  department,
  unhiredEmployees,
  hiredEmployees
) {
  const modalContainer = document.querySelector('.modal__container');
  modalContainer.innerHTML = '';

  const closeModalBtn = document.createElement('img');
  closeModalBtn.classList.add('modal__container--closeBtn');
  closeModalBtn.src = '../assets/icons/X.svg';

  const modalDetailsContainer = document.createElement('div');
  modalDetailsContainer.classList.add('modal__container--moreDetails');

  const modalTitle = document.createElement('h1');
  modalTitle.classList.add('modal__container--title');
  modalTitle.innerText = department.name;

  const sectionContainer = document.createElement('div');
  sectionContainer.classList.add('modal__container--section');

  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('modal__section--description');

  const departmentDescription = document.createElement('h2');
  departmentDescription.innerText = department.description;

  const companyName = document.createElement('p');
  companyName.innerText = department.companies.name;

  descriptionContainer.append(departmentDescription, companyName);

  const usersContainer = document.createElement('div');
  usersContainer.classList.add('modal__section--users');

  const selectContainer = document.createElement('div');
  selectContainer.classList.add('modal__input--select', 'select');

  const selectPlaceholder = document.createElement('p');
  selectPlaceholder.innerText = 'Selecionar usuário';

  const selectArrow = document.createElement('img');
  selectArrow.classList.add('modal__select--downArrow', 'downArrow');
  selectArrow.src = '../assets/icons/dropdown-arrow.svg';

  const optionsContainer = document.createElement('ul');
  optionsContainer.classList.add(
    'modal__select--list',
    'options__container',
    'hidden'
  );

  unhiredEmployees.forEach(employee => {
    const option = document.createElement('li');
    option.classList.add('modal__select--option', 'option');
    option.innerText = employee.username;
    option.dataset.value = employee.uuid;
    optionsContainer.appendChild(option);
  });

  selectContainer.append(selectPlaceholder, selectArrow, optionsContainer);

  const hireBtn = document.createElement('button');
  hireBtn.classList.add('modal__container--confirmBtn', 'button--green');
  hireBtn.innerText = 'Contratar';

  usersContainer.append(selectContainer, hireBtn);
  sectionContainer.append(descriptionContainer, usersContainer);

  const listContainer = document.createElement('div');
  listContainer.classList.add('modal__container--list');

  const employeesList = document.createElement('ul');
  employeesList.classList.add('.modal__list--users');
  listContainer.append(employeesList);

  if (hiredEmployees.length < 1) {
    const noEmployees = document.createElement('h1');
    noEmployees.innerText = 'Nenhum funcionário neste departamento.';
    noEmployees.style.fontSize = '1.125rem';
    listContainer.style.justifyContent = 'center';
    listContainer.style.textAlign = 'center';
    employeesList.innerHTML = '';
    employeesList.append(noEmployees);
  } else {
    hiredEmployees.forEach(employee => {
      const cardContainer = document.createElement('li');
      cardContainer.classList.add('list__user--card');

      const cardDetailsContainer = document.createElement('div');
      cardDetailsContainer.classList.add('user__card--details');

      const name = document.createElement('h2');
      const professionalLevel = document.createElement('small');
      const companyName = document.createElement('small');

      name.innerText = employee.username;
      professionalLevel.innerText = `Cargo: ${employee.professional_level[0].toUpperCase()}${employee.professional_level.slice(
        1
      )}`;
      companyName.innerText = `Empresa: ${department.companies.name}`;

      cardDetailsContainer.append(name, professionalLevel, companyName);

      const dismissBtn = document.createElement('button');
      dismissBtn.classList.add('user__card--dismissBtn', 'button--red');
      dismissBtn.innerText = 'Desligar';
      dismissBtn.dataset.employeeId = employee.uuid;

      cardContainer.append(cardDetailsContainer, dismissBtn);
      listContainer.appendChild(cardContainer);
    });
  }
  modalDetailsContainer.append(
    modalTitle,
    sectionContainer,
    usersContainer,
    listContainer
  );
  modalContainer.append(closeModalBtn, modalDetailsContainer);
  // modalContainer.append(
  //   closeModalBtn,
  //   modalTitle,
  //   sectionContainer,
  //   usersContainer,
  //   listContainer
  // );
}
