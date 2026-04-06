/**
 * Profile Controller
 * ---------------------
 * Orchestrates Profile module logic: loading data, managing category and sorting state, handling queries, updating URL and browser history, and redirecting to Search module.
 *
 * Emits actions to Profile views but does not own state, perform data fetching, or manipulate the DOM.
 */

import {
  getQueryResults,
  loadQueryBatch,
  resetQueryState,
  startPokemonQuery,
  storeQueryResults,
} from '../Models/queryModel.js';
import {
  getCaughtPokemon,
  getCaughtRender,
  getTypesPokemonCaught,
  loadCaughtPokemon,
  setCaughtRender,
  setCaughtSortBy,
  updateTypesPokemonCaught,
} from '../Models/caughtModel.js';
import {
  getFavoritePokemon,
  getTypesPokemonFavorited,
  loadFavoritePokemon,
  setFavoriteRender,
  setFavoriteSortBy,
  updateTypesPokemonFavorited,
} from '../Models/favoriteModel.js';
import {
  navResolveSortParams,
  navSanitizeSort,
} from '../services/navService.js';
import { controlSearchRedirect } from './searchController.js';
import { controlAppError } from './appController.js';
import profileView from '../Views/ProfileViews/profileView.js';
import previewView from '../Views/ProfileViews/previewView.js';
import savedPokemonView from '../Views/ProfileViews/savedPokemonView.js';
import categoryView from '../Views/ProfileViews/categoryView.js';
import sortView from '../Views/ProfileViews/sortView.js';
import queryView from '../Views/ProfileViews/queryView.js';
import typesView from '../Views/ProfileViews/typesView.js';

// GENERAL PROFILE CONTROLLER FUNCTIONS

// To populate the Profile with the appropriate data upon load
const controlProfileLoad = function () {
  const profileData = {
    caught: getCaughtPokemon(),
    favorites: getFavoritePokemon(),
  };

  profileView.render(profileData);
  controlProfileLoadTypes();
};

const controlProfileLoadTypes = function () {
  updateTypesPokemonCaught();
  updateTypesPokemonFavorited();

  const mode =
    window.location.pathname.split('/profile/')[1] === 'caught'
      ? 'Caught'
      : 'Favorited';

  const typesData = {
    mode: mode,
    types:
      mode === 'Caught' ? getTypesPokemonCaught() : getTypesPokemonFavorited(),
    caught: getCaughtPokemon(),
    favorites: getFavoritePokemon(),
  };

  typesView.render(typesData);
};

// To populate the savedPokemonView with either all Caught/Favorite Pokémon or queried Caught/Favorite Pokémon
export const controlProfilePokemonResults = async function () {
  try {
    resetQueryState();

    const requestId = startPokemonQuery();

    const query = queryView.getQuery();

    savedPokemonView.renderSpinner();

    // Loading all of the Caught/Favorite Pokémon before working with the query
    const profileCategory = window.location.pathname.split('/profile/')[1];

    if (!profileCategory) return;

    const pokemonBatch =
      profileCategory === 'caught'
        ? await loadCaughtPokemon()
        : await loadFavoritePokemon();

    // Rendering all of the Caught/Favorite Pokémon results if there is no query
    if (!query && pokemonBatch.length > 0)
      savedPokemonView.render(pokemonBatch);
    else if (!query && pokemonBatch.length < 1) {
      controlAppError(
        new Error('Pokemon Not Found'),
        savedPokemonView,
        `You haven't saved any Pokémon here yet! Start tracking your ${
          getCaughtRender() ? 'caught' : 'favorite'
        } Pokémon from the Search module.`,
      );
    }

    // Rendering Pokémon query results
    if (query) {
      storeQueryResults(query, pokemonBatch);
      await loadQueryBatch(requestId);
      const queryBatch = getQueryResults();

      if (queryBatch.length > 0) savedPokemonView.render(queryBatch);
      else {
        controlAppError(
          new Error('Pokemon Not Found'),
          savedPokemonView,
          `We couldn't find that Pokémon! Add more ${
            getCaughtRender() ? 'caught' : 'favorite'
          } Pokémon from the Search module. `,
        );
      }
    }
  } catch (err) {
    controlAppError(err, savedPokemonView);
    console.error(err);
  }
};

/**
 * To redirect user to the Search Module with the selected Pokémon's details rendered in the panel
 *
 * @param {string} pokemon - Pokémon name
 */
const controlProfileClickPreview = async function (pokemon) {
  const pokemonName = pokemon.toLowerCase();

  window.history.pushState(
    { page: `search/${pokemonName}` },
    '',
    `/search/${pokemonName}`,
  );

  savedPokemonView._clear();

  controlSearchRedirect();
};

// RENDERING AND ROUTING PROFILE CATEGORY (Caught/Favorite)

/**
 * Renders the appropriate category view
 *
 * @param {string} view - Category View ('caught' or 'favorite')
 */
export const controlProfileRenderCategory = async function (view) {
  switch (view) {
    case 'caught':
      categoryView.toggleCaughtCategory();

      setCaughtRender(true);
      setFavoriteRender(false);
      break;

    case 'favorites':
      categoryView.toggleFavoritesCategory();

      setCaughtRender(false);
      setFavoriteRender(true);
      break;
  }

  await controlProfilePokemonResults();
  controlProfileLoad();
};

// Updates the URL and renders appropriate view when user clicks a category button
const controlProfileCategoryBtn = async function (view) {
  queryView.clearInput();
  savedPokemonView._clear();
  resetQueryState();

  const currentURL = navResolveSortParams(`/profile/${view}`);

  window.history.replaceState({ page: `profile/${view}` }, '', currentURL);

  controlProfileRenderCategory(view);
  await controlProfilePokemonResults();
};

// Reads the URL and navigates to appropriate view when user navigates around browser history stack
const controlProfileCategory = function () {
  const view = window.location.pathname.replace('/profile/', '');
  controlProfileRenderCategory(view);
};

// Replaces the URL with /profile/caught route if user navigates to /profile route to maintain URL consistency
const controlProfileCategoryLoad = function () {
  if (window.location.pathname === '/profile') {
    const category = getCaughtRender() ? 'caught' : 'favorites';

    window.history.replaceState(
      { page: `profile/${category}` },
      '',
      `/profile/${category}`,
    );
  }
};

// RENDERING AND ROUTING PROFILE SORTING VIEW (Name/Id)

/**
 * Renders the appropriate sorting mode
 *
 * @param {string} sort - Sort mode ('name' or 'id')
 */
const controlProfileRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      sortView.toggleProfileSortName();
      break;

    case 'id':
      sortView.toggleProfileSortId();
      break;

    default:
      sortView.toggleProfileSortId();
      break;
  }
};

/**
 * Updates the URL search params and renders appropriate view when user clicks a sort button
 *
 * @param {string} sort - Sort mode ('name' or 'id')
 */
const controlProfileSortBtn = async function (sort) {
  const currentURL = navResolveSortParams(window.location.pathname);

  if (sort === 'name') {
    currentURL.searchParams.set('sort', sort);
    window.history.replaceState({}, '', currentURL);
  } else if (sort === 'id') {
    navSanitizeSort();
  }

  setFavoriteSortBy(sort);
  setCaughtSortBy(sort);

  controlProfileRenderSort(sort);
  await controlProfilePokemonResults();
};

// Sets the sorting mode to 'id' upon load/reload of the platform
export const controlProfileSortLoad = function () {
  const route = window.location.pathname;

  const currentURL = navResolveSortParams(route);

  window.history.replaceState({ page: route }, '', currentURL);

  const sort = currentURL.searchParams.get('sort');
  controlProfileRenderSort(sort);
};

/**
 * Initializes Profile Controller event handlers and attach them to Profile Views
 */
export const controlProfileInit = function () {
  profileView.addHandlerLoadProfile(controlProfileLoad);

  queryView.addHandlerQuery(controlProfilePokemonResults);
  queryView.addHandlerChangePlaceholder();

  previewView.addHandlerRedirect(controlProfileClickPreview);

  categoryView.addHandlerCategoryBtn(controlProfileCategoryBtn);
  categoryView.addHandlerCategory(controlProfileCategory);
  categoryView.addHandlerCategoryLoad(controlProfileCategoryLoad);

  sortView.addHandlerSortBtn(controlProfileSortBtn);
  sortView.addHandlerSortLoad(controlProfileSortLoad);
};
