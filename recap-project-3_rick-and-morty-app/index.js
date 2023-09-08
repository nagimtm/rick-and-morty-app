import { createCharacterCard } from "./components/card/card.js";
import { createButton } from "./components/nav-button/nav-button.js";

const searchBarContainer = document.querySelector(
  '[data-js="search-bar-container"]'
);

const searchBar = document.querySelector('[data-js="search-bar"]');

export const cardContainer = document.querySelector(
  '[data-js="card-container"]'
);

const navigation = document.querySelector('[data-js="navigation"]');
const pagination = document.querySelector('[data-js="pagination"]');

// States
let page = 1;
// pagination.innerHTML = `${page} / ${maxPage}`;

let searchQuery = "";

export async function fetchCharacters(page = 1, searchQuery = "") {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${page}&name=${searchQuery}`
    );
    if (response.ok) {
      const data = await response.json();
      let maxPage = data.info.pages;
      pagination.innerHTML = `${page} / ${maxPage}`;
      const characters = data.results;
      const characterCards = characters
        .map((character) => {
          return createCharacterCard(character);
        })
        .join("");
      cardContainer.innerHTML = characterCards;
    } else {
      cardContainer.innerHTML = `
      <li class="card-not-found">
        <img src="./assets/notfound.gif" width="480" height="400" frameBorder="0" class="giphy-embed" allowFullScreen><p></p>
        </li>`;

      console.log("Bad response!");
      // <iframe src="https://giphy.com/embed/dsWOUTBz5aae8ET8Ss" width="480" height="400" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p></p>
    }
  } catch (e) {
    console.error(e);
  }
}

searchBar.addEventListener("submit", (event) => {
  event.preventDefault();
  searchQuery = event.target.query.value;
  console.log("searchQuery", searchQuery);
  fetchCharacters(page, searchQuery);
});

const prevButton = createButton("previous", "button--prev", decrementPage);
const nextButton = createButton("next", "button--next", incrementPage);

navigation.append(prevButton);
navigation.append(pagination);
navigation.append(nextButton);

function incrementPage(page) {
  page++;
  if (page === 42) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
    prevButton.disabled = false;
  }
  // page < 42 ? (nextButton.disabled = false) : (nextButton.disabled = true);
  cardContainer.innerHTML = "";
  fetchCharacters(page, searchQuery);
  pagination.innerHTML = `${page} / ${maxPage}`;
}

function decrementPage(page) {
  page--;
  if (page === 1) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
    nextButton.disabled = false;
  }

  cardContainer.innerHTML = "";
  fetchCharacters(page, searchQuery);
  pagination.innerHTML = `${page} / ${maxPage}`;
}

fetchCharacters(page, searchQuery);
