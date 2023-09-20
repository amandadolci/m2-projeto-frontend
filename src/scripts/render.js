//INDEX
// RENDER COMPANY CARDS
export function renderCompaniesCards(companies) {
  const companiesList = document.querySelector('.section__list--companies');
  companiesList.innerHTML = '';

  companies.forEach(company => {
    const liContainer = document.createElement('li');
    const companyName = document.createElement('h2');
    const companyHours = document.createElement('small');
    const companySector = document.createElement('span');

    liContainer.classList.add('section__list--company');
    companyName.classList.add('list__company--name');
    companyHours.classList.add('list__company--hours');
    companySector.classList.add('list__company--sector', 'button--white');

    companyName.innerText = company.name;
    companyHours.innerText = company.opening_hours;
    companySector.innerText = company.sectors.description;

    liContainer.append(companyName, companyHours, companySector);
    companiesList.append(liContainer);
  });
}

// ADMINPAGE
// RENDER DEPARTMENT CARDS
export function renderDepartmentsList(departments) {
  const departmentsList = document.querySelector(
    '.departments__container--list'
  );
  departmentsList.innerHTML = '';
  const noDepartments = document.createElement('h1');
  noDepartments.classList.add('departments__list--noDepartments', 'hidden');
  noDepartments.innerText =
    'Nenhum departamento encontrado para a empresa selecionada.';
  departmentsList.appendChild(noDepartments);

  departments.forEach(department => {
    const cardContainer = document.createElement('li');
    const cardDetailsContainer = document.createElement('div');
    const name = document.createElement('h2');
    const description = document.createElement('small');
    const companyName = document.createElement('small');

    const cardInteractionContainer = document.createElement('div');
    const moreDetailsBtn = document.createElement('img');
    const editBtn = document.createElement('img');
    const deleteBtn = document.createElement('img');

    cardContainer.classList.add('department__list--card');
    cardDetailsContainer.classList.add('department__card--details');
    cardInteractionContainer.classList.add('department__card--interaction');

    moreDetailsBtn.classList.add(
      'department__interaction--moreDetails',
      'interaction--icon',
      'interaction--details'
    );
    moreDetailsBtn.dataset.departmentId = department.uuid;

    editBtn.classList.add(
      'department__interaction--edit',
      'interaction--icon',
      'interaction--edit'
    );
    editBtn.dataset.departmentId = department.uuid;
    deleteBtn.classList.add(
      'department__interaction--delete',
      'interaction--icon',
      'interaction--delete'
    );
    deleteBtn.dataset.departmentId = department.uuid;

    name.innerText = department.name;
    description.innerText = department.description;
    companyName.innerText = department.companies.name;

    moreDetailsBtn.src = '../assets/icons/purple-eye.svg';
    moreDetailsBtn.ariaLabel = 'Visualizar mais detalhes do departamento';
    editBtn.src = '../assets/icons/purple-pencil.svg';
    editBtn.ariaLabel = 'Editar departamento';
    deleteBtn.src = '../assets/icons/bin.svg';
    deleteBtn.ariaLabel = 'Deletar departamento';

    cardDetailsContainer.append(name, description, companyName);
    cardInteractionContainer.append(moreDetailsBtn, editBtn, deleteBtn);
    cardContainer.append(cardDetailsContainer, cardInteractionContainer);
    departmentsList.appendChild(cardContainer);
  });
}

// ADMINPAGE
// RENDER USER CARDS
export function renderUsersList(users, departments) {
  const usersList = document.querySelector('.users__container--list');
  usersList.innerHTML = '';

  users.forEach(user => {
    const cardContainer = document.createElement('li');
    const cardDetailsContainer = document.createElement('div');
    const name = document.createElement('h2');
    const professionalLevel = document.createElement('small');
    const companyName = document.createElement('small');

    const cardInteractionContainer = document.createElement('div');
    const editBtn = document.createElement('img');
    const deleteBtn = document.createElement('img');

    // ALTERADO
    cardContainer.classList.add('user__list--card');
    // cardContainer.classList.add('list__user--card');
    cardDetailsContainer.classList.add('user__card--details');
    cardInteractionContainer.classList.add('user__card--interaction');

    editBtn.classList.add('user__interaction--edit', 'interaction--edit');
    editBtn.classList.add('interaction--icon');
    editBtn.dataset.userId = user.uuid;
    deleteBtn.classList.add('user__interaction--delete', 'interaction--delete');
    deleteBtn.classList.add('interaction--icon');
    deleteBtn.dataset.userId = user.uuid;

    editBtn.src = '../assets/icons/purple-pencil.svg';
    editBtn.ariaLabel = 'Editar usuário';
    deleteBtn.src = '../assets/icons/bin.svg';
    deleteBtn.ariaLabel = 'Deletar usuário';

    name.innerText = user.username;
    professionalLevel.innerText = user.professional_level;

    if (!user.department_uuid) {
      companyName.innerText = 'Não contratado';
    } else {
      const department = departments.find(department => {
        return department.uuid === user.department_uuid;
      });
      companyName.innerText = department.companies.name;
    }

    cardDetailsContainer.append(name, professionalLevel, companyName);
    cardInteractionContainer.append(editBtn, deleteBtn);
    cardContainer.append(cardDetailsContainer, cardInteractionContainer);
    usersList.appendChild(cardContainer);
  });
}

// USERPAGE
// RENDER COWORKERS CARDS
export function renderCoworkersList(coworkers) {
  const usersList = document.querySelector('.userpage__coworkers--list');
  usersList.innerHTML = '';

  coworkers.forEach(coworker => {
    const cardContainer = document.createElement('li');
    const cardDetailsContainer = document.createElement('div');
    const name = document.createElement('h2');
    const professionalLevel = document.createElement('small');

    // ALTERADO
    cardContainer.classList.add('coworkers__list--card');
    cardDetailsContainer.classList.add('coworker__card--details');

    name.innerText = `${coworker.username}`;
    professionalLevel.innerText = `Cargo: ${coworker.professional_level[0].toUpperCase()}${coworker.professional_level.slice(
      1
    )}`;

    cardDetailsContainer.append(name, professionalLevel);
    cardContainer.appendChild(cardDetailsContainer);
    usersList.appendChild(cardContainer);
  });
}

// SELECT RENDER
//INDEX
export function renderSectorList(sectors) {
  const sectorsList = document.querySelector('.section__list--sectors');
  sectorsList.innerHTML = '';

  const allSectorsOption = document.createElement('li');
  allSectorsOption.classList.add('sectors__list', 'option');
  allSectorsOption.innerText = 'Todos';
  sectorsList.append(allSectorsOption);

  sectors.forEach(sector => {
    const sectorName = document.createElement('li');

    sectorName.classList.add('sectors__list', 'option');

    sectorName.innerText = sector.description;

    sectorsList.append(sectorName);
  });
}

//SELECT RENDER
//ADMINPAGE
export function renderCompaniesList(array) {
  const optionsList = document.querySelector('.options__container');
  optionsList.innerHTML = '';

  const optionAll = document.createElement('li');
  optionAll.classList.add('select__companies', 'option');
  optionAll.innerText = 'Todos';
  optionsList.append(optionAll);

  array.forEach(option => {
    const optionName = document.createElement('li');

    optionName.classList.add('select__companies', 'option');

    optionName.dataset.companyId = option.uuid;

    optionName.innerText = option.name;

    optionsList.append(optionName);
  });
}
