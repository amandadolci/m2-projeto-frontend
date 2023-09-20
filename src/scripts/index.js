import {
  validateUserType,
  listAllCompanies,
  listCompaniesBySector,
  listAllSectors,
} from './requests.js';

import { renderCompaniesCards, renderSectorList } from './render.js';

async function authentication() {
  const token = localStorage.getItem('@kenzieEmpresas:token');
  if (token) {
    const isAdmin = await validateUserType(token);
    if (isAdmin) {
      window.location.replace('./src/pages/adminpage.html');
    } else {
      window.location.replace('./src/pages/userpage.html');
    }
  }
}
authentication();

async function renderHomepage() {
  await getAndRenderAllCompanies();
  await getAndRenderAllSectors();

  const sectorsList = document.querySelector('.section__list--sectors');
  const sectorOptions = document.querySelectorAll('.sectors__list');

  sectorOptions.forEach(async option => {
    option.addEventListener('click', async event => {
      sectorsList.classList.toggle('hidden');
      const sector = event.target.innerText;
      if (sector !== 'Todos') {
        const companiesBySector = await listCompaniesBySector(sector);
        renderCompaniesCards(companiesBySector);
      } else {
        await getAndRenderAllCompanies();
      }
    });
  });
}
renderHomepage();

async function getAndRenderAllCompanies() {
  const allCompanies = await listAllCompanies();
  return renderCompaniesCards(allCompanies);
}

async function getAndRenderAllSectors() {
  const allSectors = await listAllSectors();
  return renderSectorList(allSectors);
}

function showMenu() {
  const menuBtns = document.querySelectorAll('.menu__button');
  const menu = document.querySelector('.homepage__header--nav');
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

function showSectorList() {
  const selectContainer = document.querySelector('.section__list--header');
  const sectorsList = document.querySelector('.section__list--sectors');

  selectContainer.addEventListener('click', () => {
    sectorsList.classList.toggle('hidden');
  });
}
showSectorList();
