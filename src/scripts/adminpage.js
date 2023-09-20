import {
  validateUserType,
  listAllCompanies,
  getAllEmployees,
  getDepartmentlessEmployees,
  updateEmployeeInfo,
  deleteEmployee,
  getAllDepartments,
  getAllCompanyDepartments,
  createDepartment,
  hireEmployee,
  dismissEmployee,
  updateDepartment,
  deleteDepartment,
} from './requests.js';

import {
  renderCompaniesList,
  renderDepartmentsList,
  renderUsersList,
} from './render.js';

import {
  renderDeleteModal,
  renderEditModal,
  renderMoreDetailsModal,
  toastModal,
} from './modal.js';

async function authentication() {
  const token = localStorage.getItem('@kenzieEmpresas:token');
  if (!token) {
    window.location.replace('../../index.html');
  } else {
    const isAdmin = await validateUserType(token);
    if (!isAdmin) {
      window.location.replace('./userpage.html');
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
  const menu = document.querySelector('.adminpage__header--nav');
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

async function renderAdminpage() {
  await getAndRenderAllCompanies();
  await getAndRenderAllDepartments();
  await getAndRenderAllUsers();
  showAllModals();
}
renderAdminpage();

async function getAndRenderAllCompanies() {
  const allCompanies = await listAllCompanies();
  renderCompaniesList(allCompanies);

  const selectContainer = document.querySelector(
    '.departments__header--select'
  );
  const selectPlaceholder = document.querySelector(
    '.departments__header--select > p'
  );
  const selectBtn = document.querySelector('.header__select--downArrow');
  const companiesList = document.querySelector('.header__select--companies');

  selectBtn.addEventListener('click', () => {
    selectContainer.removeChild(selectPlaceholder);
    selectPlaceholder.innerText = 'Selecionar empresa';
    selectPlaceholder.style.color = 'var(--black50)';
    selectContainer.insertAdjacentElement('afterbegin', selectPlaceholder);
    companiesList.classList.toggle('hidden');
  });
}

async function getAndRenderAllDepartments() {
  const allDepartments = await getAllDepartments();
  renderDepartmentsList(allDepartments);

  const selectContainer = document.querySelector(
    '.departments__header--select'
  );
  const selectPlaceholder = document.querySelector(
    '.departments__header--select > p'
  );
  const companiesList = document.querySelector('.header__select--companies');
  const companiesOptions = document.querySelectorAll('.select__companies');

  companiesOptions.forEach(async option => {
    option.addEventListener('click', async event => {
      let departments = event.target.innerText;
      const companyId = event.target.dataset.companyId;

      companiesList.classList.toggle('hidden');
      selectContainer.removeChild(selectPlaceholder);
      selectPlaceholder.style.color = 'var(--black100)';

      if (departments !== 'Todos') {
        if (departments.length > 18) {
          const toArray = departments.split(' ');
          if (toArray[1].length >= 10) {
            departments = `${toArray[0]} ${toArray[1].substring(0, 7)}...`;
          } else if (toArray[1].length >= 4) {
            departments = `${toArray[0]} ${toArray[1]}...`;
          }
        }
        selectPlaceholder.innerText = departments;

        const allCompanyDepartments = await getAllCompanyDepartments(companyId);
        renderDepartmentsList(allCompanyDepartments);
        showAllModals();
        if (allCompanyDepartments.length < 1) {
          const noDepartments = document.querySelector(
            '.departments__list--noDepartments'
          );
          noDepartments.classList.remove('hidden');
        }
      } else {
        selectPlaceholder.innerText = 'Selecionar empresa';
        selectPlaceholder.style.color = 'var(--black50)';

        renderDepartmentsList(allDepartments);
        showAllModals();
      }
      selectContainer.insertAdjacentElement('afterbegin', selectPlaceholder);
    });
  });
}

async function getAndRenderAllUsers() {
  const allEmployees = await getAllEmployees();
  const employeesOnly = allEmployees.filter(employee => !employee.is_admin);
  const allDepartments = await getAllDepartments();
  renderUsersList(employeesOnly, allDepartments);
}

function showDeleteModal() {
  const modalController = document.querySelector('.modal__controller');
  const deleteBtns = document.querySelectorAll('.interaction--delete');

  deleteBtns.forEach(button => {
    button.addEventListener('click', async event => {
      if (event.target.dataset.userId) {
        const userId = event.target.dataset.userId;
        const users = await getAllEmployees();
        const user = users.find(user => user.uuid === userId);
        renderDeleteModal(user);

        const confirmBtn = document.querySelector(
          '.modal__container--confirmBtn'
        );
        confirmBtn.addEventListener('click', async () => {
          await deleteEmployee(userId);

          renderAdminpage();

          modalController.close();
        });
      } else if (event.target.dataset.departmentId) {
        const departmentId = event.target.dataset.departmentId;
        const departments = await getAllDepartments();
        const department = departments.find(
          department => department.uuid === departmentId
        );
        renderDeleteModal(department);

        const confirmBtn = document.querySelector(
          '.modal__container--confirmBtn'
        );
        confirmBtn.addEventListener('click', async () => {
          await deleteDepartment(departmentId);

          renderAdminpage();

          modalController.close();
        });
      }
      showModal();
      closeModal();
    });
  });
}

function showEditModal() {
  const modalController = document.querySelector('.modal__controller');
  const editBtns = document.querySelectorAll('.interaction--edit');
  const createBtn = document.querySelector('.departments__header--create');

  // BOTÕES DE EDITAR DEPARTAMENTO E USUÁRIO
  editBtns.forEach(button => {
    button.addEventListener('click', async event => {
      if (event.target.dataset.userId) {
        const userId = event.target.dataset.userId;
        const users = await getAllEmployees();
        const user = users.find(user => user.uuid === userId);
        renderEditModal(user);
        showOptionsList();

        const submitBtn = document.querySelector(
          '.modal__container--submitBtn'
        );
        submitBtn.addEventListener('click', async () => {
          if (Object.keys(handleEdit()).length === 0) {
            const message = 'Por favor, altere pelo menos um campo.';
            return toastModal(message);
          } else {
            await updateEmployeeInfo(userId, handleEdit());

            renderAdminpage();

            modalController.close();
          }
        });
      } else if (event.target.dataset.departmentId) {
        const departmentId = event.target.dataset.departmentId;
        const departments = await getAllDepartments();
        const department = departments.find(
          department => department.uuid === departmentId
        );
        renderEditModal(department);

        const submitBtn = document.querySelector(
          '.modal__container--submitBtn'
        );
        submitBtn.addEventListener('click', async () => {
          const departmentBody = handleEdit();
          if (!departmentBody) {
            const message = 'Por favor, não deixe o campo em branco.';
            return toastModal(message);
          } else {
            await updateDepartment(departmentId, departmentBody);
          }

          renderAdminpage();

          modalController.close();
        });
      }
      showModal();
      closeModal();
    });
  });

  // BOTÃO DE CRIAR NOVO DEPARTAMENTO
  createBtn.addEventListener('click', async () => {
    renderEditModal(false, await listAllCompanies());
    showOptionsList();

    const submitBtn = document.querySelector('.modal__container--submitBtn');
    const selectPlaceholder = document.querySelector(
      '.modal__input--select > p'
    );
    submitBtn.addEventListener('click', async () => {
      if (!handleEdit() || !selectPlaceholder.dataset.value) {
        const message = 'Por favor, preencha todos os campos.';
        return toastModal(message);
      }
      const departmentBody = handleEdit();
      await createDepartment(departmentBody);

      renderAdminpage();

      modalController.close();
    });
    showModal();
    closeModal();
  });
}

function showOptionsList() {
  const modalController = document.querySelector('.modal__controller');
  const selectContainer = modalController.querySelectorAll(
    '.modal__input--select'
  );
  const selectContainer1 = modalController.querySelector('#select__1');

  selectContainer.forEach(container => {
    const selectArrow = container.querySelector('.modal__select--downArrow');
    const selectPlaceholder = container.querySelector(
      '.modal__input--select > p'
    );
    const selectText = selectPlaceholder.innerText;
    const optionsContainer = container.querySelector('.modal__select--list');
    const options = optionsContainer.querySelectorAll('.option');

    selectArrow.addEventListener('click', () => {
      if (container.id === 'select__0') {
        selectContainer1.classList.toggle('invisible');
        const optionsContainer1 = selectContainer1.querySelector(
          '.modal__select--list'
        );
        if (!optionsContainer1.classList.contains('hidden')) {
          optionsContainer1.classList.add('hidden');
        }
      }
      container.removeChild(selectPlaceholder);
      selectPlaceholder.innerText = selectText;
      selectPlaceholder.style.color = 'var(--black50)';
      container.insertAdjacentElement('afterbegin', selectPlaceholder);
      optionsContainer.classList.toggle('hidden');
    });
    options.forEach(option => {
      option.addEventListener('click', event => {
        if (container.id === 'select__0') {
          selectContainer1.classList.toggle('invisible');
        }
        optionsContainer.classList.toggle('hidden');
        const optionName = event.target.innerText;
        if (event.target.dataset.companyId) {
          const optionId = event.target.dataset.companyId;
          selectPlaceholder.dataset.value = optionId;
        } else {
          const dataValue = event.target.dataset.value;
          selectPlaceholder.dataset.value = dataValue;
        }
        container.removeChild(selectPlaceholder);
        selectPlaceholder.innerText = optionName;
        selectPlaceholder.style.color = 'var(--black100)';
        container.insertAdjacentElement('afterbegin', selectPlaceholder);
      });
    });
  });
}

function showMoreDetailsModal() {
  const moreDetailsBtns = document.querySelectorAll('.interaction--details');

  moreDetailsBtns.forEach(button => {
    button.addEventListener('click', async event => {
      const departmentId = event.target.dataset.departmentId;
      getAndRenderMoreDetailsModal(departmentId);
    });
  });
}

async function getAndRenderMoreDetailsModal(departmentId) {
  const departments = await getAllDepartments();
  const department = departments.find(
    department => department.uuid === departmentId
  );
  // console.log(department);

  const unhiredEmployees = await getDepartmentlessEmployees();
  // console.log(unhiredEmployees);

  const allEmployees = await getAllEmployees();
  const employeesFromDepartment = allEmployees.filter(
    employees => employees.department_uuid === departmentId
  );
  renderMoreDetailsModal(department, unhiredEmployees, employeesFromDepartment);
  detailsModalSelect();
  interactionMoreDetailsModal(departmentId);
  showModal();
  closeModal();
}

function detailsModalSelect() {
  const modalController = document.querySelector('.modal__controller');
  const selectContainer = modalController.querySelector(
    '.modal__input--select'
  );
  const selectArrow = modalController.querySelector(
    '.modal__select--downArrow'
  );
  const selectContainerText = modalController.querySelector(
    '.modal__input--select > p'
  );
  const optionsContainer = modalController.querySelector(
    '.modal__select--list'
  );
  const options = modalController.querySelectorAll('.option');

  selectArrow.addEventListener('click', () => {
    selectContainer.removeChild(selectContainerText);
    selectContainerText.innerText = 'Selecionar usuário';
    selectContainer.insertAdjacentElement('afterbegin', selectContainerText);
    optionsContainer.classList.toggle('hidden');
  });
  options.forEach(option => {
    option.addEventListener('click', event => {
      optionsContainer.classList.toggle('hidden');
      const optionName = event.target.innerText;
      const dataValue = event.target.dataset.value;
      selectContainer.removeChild(selectContainerText);
      selectContainerText.innerText = optionName;
      selectContainerText.dataset.value = dataValue;
      selectContainer.insertAdjacentElement('afterbegin', selectContainerText);
    });
  });
}

function interactionMoreDetailsModal(departmentId) {
  const modalController = document.querySelector('.modal__controller');
  const selectContainerText = modalController.querySelector(
    '.modal__input--select > p'
  );

  const hireBtn = modalController.querySelector(
    '.modal__container--confirmBtn'
  );
  hireBtn.addEventListener('click', async () => {
    const employeeId = selectContainerText.dataset.value;
    await hireEmployee(employeeId, departmentId);

    getAndRenderMoreDetailsModal(departmentId);
    // detailsModalSelect();
    // interactionMoreDetailsModal(departmentId);
    // showModal();
    // closeModal();
  });

  const dismissBtns = modalController.querySelectorAll(
    '.user__card--dismissBtn'
  );
  if (dismissBtns.length >= 1) {
    dismissBtns.forEach(button => {
      button.addEventListener('click', async event => {
        const employeeId = event.target.dataset.employeeId;
        await dismissEmployee(employeeId);

        getAndRenderMoreDetailsModal(departmentId);
        // detailsModalSelect();
        // interactionMoreDetailsModal(departmentId);
        // showModal();
        // closeModal();
      });
    });
  }
}

function handleEdit() {
  const modalController = document.querySelector('.modal__controller');
  const inputs = modalController.querySelectorAll('.modal__input');
  const selectPlaceholder = modalController.querySelectorAll(
    '.modal__input--select > p'
  );
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
    if (input.value === '') {
      return handleEditError();
    } else {
      objectBody[input.name] = input.value;
    }
  }

  if (selectPlaceholder.length > 0) {
    selectPlaceholder.forEach(select => {
      if (select.dataset.value) {
        objectBody[select.dataset.name] = select.dataset.value;
      }
    });
  }
  // console.log(objectBody);
  return objectBody;
}

function handleEditError() {
  const modalController = document.querySelector('.modal__controller');
  const inputs = modalController.querySelectorAll('.modal__input');

  inputs.forEach(input => {
    input.classList.add('invalid');
  });
}

function showAllModals() {
  showDeleteModal();
  showEditModal();
  showMoreDetailsModal();
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
    renderAdminpage();
  });
}
