/**
 * Navigation Service
 * ---------------------
 * Responsible for resolving routes, sanitizing and applying URL search parameters, and preventing duplicate navigation entries in the browser history.
 *
 * This service does not own state, implement business logic, or perform data fetching.
 * It only interacts with URL and History Browser APIs.
 */

import { getPokemonSortBy, setPokemonSortBy } from '../Models/pokemonModel';
import {
  getCaughtRender,
  getCaughtSortBy,
  setCaughtSortBy,
} from '../Models/caughtModel';
import { getFavoriteSortBy, setFavoriteSortBy } from '../Models/favoriteModel';
import { getPokemon } from '../Models/panelModel';
import { getMapSortBy, setMapSortBy } from '../Models/mapModel';
import { BASE_POKEDEX_URL } from '../config';

/**
 * Resolves pages identifiers to application routes.
 * Resolves appropriate subroutes (if applicable) to maintain URL consistency
 *
 * @param {string} page - Page identifier derived from navigation button or URL
 */
export const navResolveRoute = function (page) {
  if (page === 'profile') {
    // Determines if the profile is currently in 'Caught' or 'Favorites' mode to define appropriate path
    const category = getCaughtRender() ? 'caught' : 'favorites';

    return `/profile/${category}`;
  }

  // Resolves the /search route to have its appropriate subroute if a user is viewing Pokémon details
  if (page === 'search' && Object.keys(getPokemon()).length !== 0) {
    return `/search/${getPokemon().name.toLowerCase()}`;
  }

  return `/${page}`;
};

/**
 * Compares the requested route against the current route to prevent duplicate entries in the browser history stack

@param {string} page - Page identifier derived from navigation button or URL
*/
export const navCheckRoute = function (page) {
  const currentURL = window.location.pathname.split('/').at(1);

  // To guard against duplicate entries
  if (currentURL === page) return null;
  return navResolveRoute(page);
};

/*
 * Sanitizes URL of sort search parameters
 */
export const navSanitizeSort = function () {
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.delete('sort');
  window.history.replaceState({}, '', currentURL);
};

/**
 * Creates a new URL object with the specified route and appends any sort search parameters (if applicable) from STATE

@param {string} route - Route identifier derived from navigation button or URL
*/
export const navResolveSortParams = function (route) {
  const currentURL = new URL(route.toString(), BASE_POKEDEX_URL);

  let sortBy;

  if (route.startsWith('/search')) sortBy = getPokemonSortBy();
  else if (route === '/profile/caught') sortBy = getCaughtSortBy();
  else if (route === '/profile/favorites') sortBy = getFavoriteSortBy();
  else if (route === '/map') sortBy = getMapSortBy();

  if (sortBy === 'name') currentURL.searchParams.set('sort', 'name');
  else if (sortBy === 'id' && route === '/map')
    currentURL.searchParams.set('sort', 'id');
  else navSanitizeSort();

  return currentURL;
};

// Hydrates sort parameters from URL into state
export const navHydrateSortParams = function () {
  const currentURL = new URL(window.location.href);
  const sort = currentURL.searchParams.get('sort');
  const currentRoute = window.location.pathname;

  if (sort !== 'name' && sort !== 'id' && sort !== 'date') {
    navSanitizeSort();
    return;
  }

  if (
    currentRoute.startsWith('/search') ||
    currentRoute.startsWith('/profile')
  ) {
    if (sort !== 'name' && sort !== 'id') return;
  }

  if (currentRoute.startsWith('/search')) setPokemonSortBy(sort);
  if (currentRoute.startsWith('/profile/caught')) setCaughtSortBy(sort);
  if (currentRoute.startsWith('/profile/favorites')) setFavoriteSortBy(sort);
  if (currentRoute.startsWith('/map')) setMapSortBy(sort);
};
