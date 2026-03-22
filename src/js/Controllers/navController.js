/**
 * Navigation Controller
 * ---------------------
 * Orchestrates Pokémon sorting, DOM updates, and URL state.
 * Implements basic routing and enforces navigation flow.
 * Renders the appropriate views with fresh data.
 *
 * This controller does not own state or perform data fetching.
 */

import { getPokemonSortBy } from '../models/pokemonModel';
import { getCaughtRender } from '../models/caughtModel';
import {
  navCheckRoute,
  navHydrateSortParams,
  navResolveSortParams,
  navSanitizeSort,
} from '../services/navService';
import {
  controlSearchPokemonPanel,
  controlSearchRenderSort,
  controlSearchSortLoad,
} from './searchController';
import {
  controlProfileRenderCategory,
  controlProfileSortLoad,
} from './profileController';
import navView from '../views/NavViews/navView';
import categoryView from '../views/ProfileViews/categoryView';
import { getFavoriteRender } from '../models/favoriteModel';
import lightsView from '../views/NavViews/lightsView';
import resultsView from '../views/SearchViews/resultsView';
import { capitalize } from '../helpers';
import aboutView from '../views/AboutView';
import pageNotFoundView from '../views/pageNotFoundView';

/**
 * Renders module with appropriate data (based on the URL path)
 *
 * @param {string} route - Route identifier derived from navigation button or URL
 */
const controlNavRenderView = function (route) {
  // console.log('running controlnavrenderview');
  navView.resetNav();

  // let pokemon = null;
  // TODO move this into navService later
  if (route.startsWith('/search/')) {
    // pokemon = route.split('/search/')[1];
    route = '/search';
  }

  switch (route) {
    case '/search':
      navView.toggleNavSearch();
      // controlSearchRenderSort(getPokemonSortBy());
      controlSearchSortLoad();
      controlSearchPokemonPanel();

      // testing
      const pokemonName = capitalize(
        window.location.pathname.split('/search/')[1],
      );

      if (pokemonName) resultsView.scrollIntoView(pokemonName);

      break;

    case '/map':
      navView.toggleNavMap();

      break;

    // case '/profile':
    //   navView.toggleNavProfile();

    //   // Determines if the profile is currently in 'Caught' or 'Favorites' mode for rendering
    //   const category = getCaughtRender() ? 'caught' : 'favorites';
    //   console.log(category);
    //   controlProfileRenderCategory(category);
    //   break;

    case '/profile/caught':
      navView.toggleNavProfile();
      categoryView.toggleCaughtCategory();

      if (getCaughtRender()) controlProfileRenderCategory('caught');
      controlProfileSortLoad();
      break;

    case '/profile/favorites':
      navView.toggleNavProfile();
      categoryView.toggleFavoritesCategory();

      if (getFavoriteRender()) controlProfileRenderCategory('favorites');
      controlProfileSortLoad();

      break;

    case '/about':
      navView.toggleNavAbout();
      // window.scrollTo({ top: 0, behavior: 'auto' });
      aboutView.scrollToTop();
      break;

    default:
      navView.toggleNavPageNotFound();
      break;
  }
};

/**
 * Handles navigation button clicks.
 * Updates the URL and triggers rendering of appropriate module.
 *
 * @param {string} page - Route identifier derived from navigation button
 */
export const controlNavBtn = function (page) {
  navSanitizeSort();
  // console.log('running controlnavbtn');

  const route = navCheckRoute(page);

  if (!route) return;

  const currentURL = navResolveSortParams(route);

  window.history.pushState({ page: route }, '', currentURL);
  controlNavRenderView(route);
};

// Reads the URL and navigates to appropriate module when user interacts with browser history stack
const controlNavBrowser = function () {
  // console.log('running controlnavbrowser');
  navHydrateSortParams();
  const route = window.location.pathname;

  // console.log(route);
  controlNavRenderView(route);
};

// Rewrites the root URL '/' to '/search' to maintain URL consistency across page loads
const controlNavInitialLoad = function () {
  // console.log('running controlnavinitialload');
  if (window.location.pathname === '/') {
    window.history.replaceState({ page: 'search' }, '', '/search');
  }
};

const controlNavLogo = function () {
  if (window.location.pathname === '/about') return;

  controlNavBtn('about');
};

const controlNavBackToSearch = function () {
  // console.log('running controlnavbacktosearch');
  controlNavBtn('search');
};
/**
 * Initializes Navigation Controller event handlers
 */
export const controlNavInit = function () {
  navView.addHandlerNavigateBtn(controlNavBtn);
  navView.addHandlerBrowser(controlNavBrowser);
  navView.addHandlerInitialLoad(controlNavInitialLoad);
  navView.addHandlerLogo(controlNavLogo);
  lightsView.addHandlerLightBtn(controlNavBtn);
  pageNotFoundView.addHandlerBackToSearchBtn(controlNavBackToSearch);
};
