/**
 * Search Controller
 * ---------------------
 * Orchestrates Search module: loading data, managing sorting state, handling queries, implementing infinite scroll and lazy loading of search results, initializing all Pokémon references, pagination of search results, managing Pokémon in Caught/Favorite states.
 *
 * Emits actions to Search views but does not own state, perform data fetching, or manipulate the DOM.
 */

import {
  getHasMorePokemonResults,
  getLoadedReferences,
  getPokemonCurrentBatch,
  getPokemonLoading,
  getPokemonResults,
  getPokemonSortBy,
  loadNextPokemon,
  loadPokemonBatch,
  resetPokemonState,
  setPokemonSortBy,
  startPokemonRequest,
  storeAllPokemonReferences,
  updateHasMorePokemonResults,
} from '../models/pokemonModel.js';
import {
  getHasMoreQueryResults,
  getQuery,
  getQueryCurrentBatch,
  getQueryLoading,
  getQueryRedirect,
  getQueryResults,
  loadQueryBatch,
  resetQueryState,
  setQuery,
  setQueryRedirect,
  startPokemonQuery,
  storeQueryResults,
  updateHasMoreQueryResults,
} from '../models/queryModel.js';
import {
  addCaughtPokemon,
  getCaughtPokemon,
  removeCaughtPokemon,
} from '../models/caughtModel.js';
import {
  addFavoritePokemon,
  getFavoritePokemon,
  removeFavoritePokemon,
} from '../models/favoriteModel.js';
import { getPokemon, loadPokemon } from '../models/panelModel.js';
import pokemonState from '../models/state/pokemonState.js';
import caughtState from '../models/state/caughtState.js';
import favoriteState from '../models/state/favoriteState.js';
import {
  navResolveSortParams,
  navSanitizeSort,
} from '../services/navService.js';
import {
  getPokemonPagination,
  loadGuaranteedBatch,
} from '../services/pokemonService.js';
import navView from '../views/NavViews/navView.js';
import queryView from '../views/SearchViews/queryView.js';
import resultsView from '../views/SearchViews/resultsView.js';
import previewView from '../views/SearchViews/previewView.js';
import sortView from '../views/SearchViews/sortView.js';
import panelView from '../views/SearchViews/panelView.js';
import paginationView from '../views/SearchViews/paginationView.js';
import { capitalize, debounce } from '../helpers.js';
import panelState from '../models/state/panelState.js';
import queryState from '../models/state/queryState.js';
import { controlAppError } from './appController.js';
import { controlProfilePokemonResults } from './profileController.js';
import {
  controlMapDeleteMarker,
  controlMapLoadEntries,
  controlMapLoadSummary,
  controlMapRedirect,
} from './mapController.js';

let infiniteScrollLocked = false;
let initializedSearchResults = false;
let currentSearchResultsController;

// SEARCH CONTROLLER FUNCTIONS

// To coordinate rendering of the Pokémon search results
const controlSearchResults = async function () {
  try {
    if (!window.appInitialized) return;

    if (initializedSearchResults) panelView._clear();
    else initializedSearchResults = true;

    if (currentSearchResultsController) {
      currentSearchResultsController.abort();
    }

    currentSearchResultsController = new AbortController();
    const { signal } = currentSearchResultsController;

    // Retrieve query from user input
    resetQueryState();
    resetPokemonState();

    if (resultsView._observer) resultsView.unobserveSentinel();

    const query = queryView.getQuery();

    const pokemonName = capitalize(
      window.location.pathname.split('/search/')[1],
    );

    let requestId, pokemonResults, hasMoreResults;

    resultsView.renderSpinner();

    if (query) {
      requestId = startPokemonQuery();

      // if (redirectedFromProfile) {
      //   setQueryRedirect(false);
      //   // await controlSearchPokemonPanel();
      // } else {
      window.history.replaceState({ page: `search` }, '', `/search`);
      // }

      storeQueryResults(query, pokemonState.allPokemonReferences);

      await loadGuaranteedBatch(requestId, loadQueryBatch, signal);
      // await loadQueryBatch(requestId);

      pokemonResults = getQueryResults();
      hasMoreResults = getHasMoreQueryResults();
      // console.log(pokemonResults, hasMoreResults);
    } else {
      requestId = startPokemonRequest();

      // window.history.replaceState({ page: `search` }, '', `/search`);

      // await controlSearchPokemonPanel();
      await loadGuaranteedBatch(requestId, loadPokemonBatch, signal);
      // await loadPokemonBatch(requestId);

      // console.log(pokemonState.results);
      pokemonResults = getPokemonResults();
      // console.log(pokemonResults);

      hasMoreResults = getHasMorePokemonResults();
      // console.log(pokemonResults);
    }

    if (pokemonResults.length < 1) {
      resultsView._clear();
      throw new Error('Pokemon Not Found');
      // resultsView.renderError();
    }

    if (hasMoreResults) {
      resultsView.observeSentinel(controlSearchInfiniteScroll);
    }

    resultsView.render(pokemonResults);

    //testing

    if (pokemonName) resultsView.scrollIntoView(pokemonName);

    resultsView.scrollIntoView;
  } catch (err) {
    resultsView.unobserveSentinel();
    // console.log('controlsearchresults line 156 calling error');
    // console.log(err);
    // console.log('request aborted');
    if (err.name === 'AbortError') return;

    controlAppError(err, resultsView);
    // console.error(err);
  }
};

const debouncedControlSearchResults = function () {
  debounce(controlSearchResults);
};
// To determine the scroll position of the client and to load more data, if necessary
const controlSearchInfiniteScroll = async function () {
  if (infiniteScrollLocked) return;
  infiniteScrollLocked = true;

  const query = getQuery();

  let requestId,
    hasMoreResults,
    loadBatch,
    updateHasMoreResults,
    getCurrentBatch;

  if (query) {
    requestId = startPokemonQuery();
    // loading = getQueryLoading();
    hasMoreResults = getHasMoreQueryResults();
    loadBatch = loadQueryBatch;
    updateHasMoreResults = updateHasMoreQueryResults;
    getCurrentBatch = getQueryCurrentBatch;
  } else {
    requestId = startPokemonRequest();
    // loading = getPokemonLoading();
    hasMoreResults = getHasMorePokemonResults();
    loadBatch = loadPokemonBatch;
    updateHasMoreResults = updateHasMorePokemonResults;
    getCurrentBatch = getPokemonCurrentBatch;
  }

  if (!hasMoreResults) {
    infiniteScrollLocked = false;
    return;
  }

  resultsView.renderSpinner(true);

  await loadGuaranteedBatch(requestId, loadBatch);

  const currentBatch = getCurrentBatch();

  resultsView.removeSpinner();
  // There are no more results to be rendered
  if (!currentBatch || currentBatch.length === 0) {
    updateHasMoreResults();
    infiniteScrollLocked = false;
    return;
  }

  // Return Pokémon data to controlSearchResults
  resultsView.render(currentBatch, true, true);

  infiniteScrollLocked = false;
};

export const controlSearchRenderSort = function (sort) {
  // console.log('controlsearchrendersort, ' + sort);
  // console.log(getPokemonSortBy());
  switch (sort || getPokemonSortBy()) {
    case 'name':
      sortView.toggleSearchSortName();
      break;

    case 'id':
    default:
      sortView.toggleSearchSortId();
      break;
  }

  // console.log('running controlsearchrendersort');
};

/**
 * Handles sort button click and keeps URL search params in sync with sorting mode
 *
 * @param {string} sort - Sort mode ('name' or 'id)
 */
const controlSearchSortBtn = async function (sort) {
  const currentURL = new URL(window.location.href);

  // console.log(sort);
  if (sort === 'name') {
    currentURL.searchParams.set('sort', sort);
    window.history.replaceState({}, '', currentURL);
  } else {
    sort === 'id';
    navSanitizeSort();
  }

  // console.log('controlsearchsortbtn, ' + sort);
  setPokemonSortBy(sort);
  // console.log(getPokemonSortBy());
  // console.log('running controlsearchsortbtn');
  controlSearchRenderSort(sort);
  await controlSearchResults();
};

export const controlSearchSortLoad = function () {
  const currentURL = new URL(window.location.href);
  const sort = currentURL.searchParams.get('sort');

  // console.log('controlsearchsortload, ' + sort);
  // console.log();
  if (!sort || sort !== 'name') navSanitizeSort();

  // console.log('running controlsearchsortload');
  // const route = window.location.href;

  // const currentURL = navResolveSortParams(new URL(route));

  // window.history.replaceState({ page: '/search' }, '', currentURL);

  // const sort = currentURL.searchParams.get('sort');

  controlSearchRenderSort(sort);
};

/**
 * Updates URL to reflect current Pokémon being rendered.
 * Renders specified Pokémon in Pokémon panel.
 *
 * @param {string} pokemon - Pokémon name (unique identifier)
 */
const controlSearchClickPreview = function (pokemon) {
  const pokemonName = pokemon.toLowerCase();

  window.history.replaceState(
    { page: `search/${pokemonName}` },
    '',
    `/search/${pokemonName}`,
  );

  controlSearchPokemonPanel();
};

const controlSearchLoadActivePreview = function () {
  const query = getQuery();

  if (query) resultsView.render(getQueryResults());
  else resultsView.render(getPokemonResults());
};

// To render Pokémon details (desc, stats, moves) for the Pokémon panel
export const controlSearchPokemonPanel = async function () {
  try {
    const pokemonName = window.location.pathname.split('/search/')[1];
    // Retrieve Pokémon name from URL

    if (!pokemonName) return;

    // Load Pokémon (data) panel details
    panelView.renderSpinner();

    await loadPokemon(pokemonName);

    // if (window.location.pathname.split('/search/')[1] !== pokemonName) {
    //   panelView._clear();
    //   return;
    // }

    // Render Pokémon panel
    const pokemon = getPokemon();

    // Configuring pagination buttons of Pokémon panel
    let pokemonResults, loadMoreResults;

    const query = getQuery();

    if (query) {
      pokemonResults = getQueryResults();
      loadMoreResults = getHasMoreQueryResults();
    } else {
      pokemonResults = getPokemonResults();
      loadMoreResults = getHasMorePokemonResults();
    }

    // console.log(pokemonResults, loadMoreResults);
    const { prev, next } = getPokemonPagination(
      pokemon.name,
      pokemonResults,
      loadMoreResults,
    );

    panelView.render(pokemon);
    if (!prev && next) paginationView.disablePaginationBtn('prev');
    if (!next && prev) paginationView.disablePaginationBtn('next');
    if (!prev && !next) paginationView.removePaginationBtns();

    // console.log(prev, next);
  } catch (err) {
    panelView._clear();
    // console.log('controlpokemonpanel line 344 calling error');
    controlAppError(
      new Error('Pokemon Not Found'),
      panelView,
      `We couldn't load the Pokémon, ${capitalize(window.location.pathname.split('/search/')[1])}. Please try again.`,
    );
    // panelView.renderError();
    console.error(err);
  }
};

/**
 * Manages pagination buttons on Pokémon panel.
 * Determines if pagination buttons should be enabled/disabled based on length of Pokémon results.
 *
 * @param {string} direction - 'prev' or 'next pagination button
 */
const controlSearchPagination = async function (direction) {
  const query = getQuery();
  let pokemonResults, loadMoreResults, requestId;

  // Determining if the pokemonResults should reflect the entire Pokémon database or the query results
  if (query) {
    requestId = startPokemonQuery();
    pokemonResults = getQueryResults();
    loadMoreResults = getHasMoreQueryResults();
  } else {
    requestId = startPokemonRequest();
    pokemonResults = getPokemonResults();
    loadMoreResults = getHasMorePokemonResults();
  }

  // Loading the prev/next Pokémon based on the user-selected direction
  let nextPokemon = loadNextPokemon(direction, pokemonResults);

  // Loading more Pokémon preview results (if the user navigates to a Pokémon that hasn't been rendered yet)

  if (!nextPokemon && loadMoreResults) {
    paginationView.enablePaginationBtn('next');
    panelView.renderSpinner();

    const numResults = pokemonResults.length;

    // Loading the next appropriate Pokémon batch
    // if (query) await loadQueryBatch();
    if (query) await loadGuaranteedBatch(requestId, loadQueryBatch);
    // else await loadPokemonBatch();
    else await loadGuaranteedBatch(requestId, loadPokemonBatch);

    // Updating the Pokémon preview search results
    // await controlSearchResults();
    // resultsView.render(currentBatch, true, true);

    // Manually setting the next Pokémon to the first element of the updated Pokémon preview search results
    nextPokemon = pokemonResults[numResults];
  }

  // Updating the url to reflect the Pokémon that will be navigated to via pagination button
  if (nextPokemon) {
    const pokemonName = nextPokemon.name.toLowerCase();

    window.history.replaceState(
      { page: `search/${pokemonName}` },
      '',
      `/search/${pokemonName}`,
    );
  }

  // Updating the Pokémon panel (for the Pokémon that has been navigated to via pagination button, now reflected in the url)
  controlSearchLoadActivePreview();
  await controlSearchPokemonPanel();
};

// To add/remove Pokémon from our active Pokémon panel to our Caught Pokémon
const controlSearchCaughtBtn = function () {
  // Retrieve Pokémon that is highlighted on the Pokémon Panel

  const pokemon = getPokemon();

  // To add/remove Caught status
  if (!pokemon.caught) {
    addCaughtPokemon(pokemon);
    // console.log(caughtState.caughtPokemon);
    window.history.pushState({ page: `map` }, '', `/map`);
    controlMapRedirect();
  } else {
    removeCaughtPokemon(pokemon);

    // controlMapDeleteMarker(pokemon);
    controlMapLoadEntries();
    controlMapLoadSummary();
  }

  panelView.toggleCaughtBtn();

  // controlProfilePokemonResults();
};

// To add/remove Pokémon from our active Pokémon panel to our Favorite Pokémon
const controlSearchFavoriteBtn = function () {
  // Retrieve Pokémon that is highlighted on the Pokémon Panel
  const pokemon = getPokemon();

  // To add/remove Favorite status
  if (!pokemon.favorite) addFavoritePokemon(pokemon);
  else removeFavoritePokemon(pokemon);

  panelView.toggleFavoriteBtn();
  // controlProfilePokemonResults();
};

// To reset the navView and load the Search module when user is redirected from Profile module
export const controlSearchRedirect = async function () {
  // controlSearchLoadQuery();
  // console.log(pokemon);
  // queryView.setQuery(pokemon);
  // setQuery(pokemon);

  navView.resetNav();
  navView.toggleNavSearch();

  // resultsView.renderSpinner();
  // panelView.renderSpinner();

  await controlSearchResults();
  await controlSearchPokemonPanel();
};

// To initialize all Pokémon references to store in our state (pokemonState)
const initPokemonData = async function () {
  if (getLoadedReferences()) return;
  try {
    await storeAllPokemonReferences();
  } catch (err) {
    // console.log(err);
    // console.log('searchcontroller line 466 calling error');
    controlAppError(err, panelView);
    throw err;
  }
};

/**
 * Initializes Search Controller event handlers and attach them to Search Views
 */
export const controlSearchInit = async function () {
  try {
    await initPokemonData();
  } catch (err) {
    controlAppError(
      new Error('HTTP_400'),
      resultsView,
      `Something went wrong! Please refresh the page.`,
    );
    return;
  }

  queryView.addHandlerQuery(debounce(controlSearchResults, 300));
  queryView.addHandlerChangePlaceholder();
  // queryView.addHandlerLoadQuery(controlSearchLoadQuery);

  resultsView.addHandlerLoadResults(controlSearchResults);

  sortView.addHandlerSortBtn(controlSearchSortBtn);
  sortView.addHandlerSortLoad(controlSearchSortLoad);

  previewView.addHandlerClickActivePreview(controlSearchClickPreview);

  panelView.addHandlerRenderPanel(controlSearchPokemonPanel);

  panelView.addHandlerCaughtBtn(controlSearchCaughtBtn);
  panelView.addHandlerFavoriteBtn(controlSearchFavoriteBtn);

  paginationView.addHandlerPaginationClick(controlSearchPagination);
};
