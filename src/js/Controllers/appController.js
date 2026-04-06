/**
 * App Controller
 * ---------------------
 * Initializes all domain-level controllers to start the application.
 *
 * This controller does not own state, implement business logic, perform data fetching, or manipulate the DOM.
 */

import { controlNavInit, controlNavBtn } from './navController';
import { controlSearchInit } from './searchController';
import { controlMapInit } from './mapController';
import { controlProfileInit } from './profileController';
import AboutView from '../views/AboutView';
import resultsView from '../views/SearchViews/resultsView';
import '../../css/style.css';

const controlAboutBtns = function (action) {
  switch (action) {
    // In-app redirects
    case 'search':
      controlNavBtn('search');
      break;

    case 'map':
      controlNavBtn('map');
      break;

    case 'profile':
      controlNavBtn('profile');
      break;

    // External redirects
    case 'source-code':
      window.open('https://github.com/natalieflcn/Natys-Pokedex', '_blank');
      break;

    case 'github':
      window.open('https://github.com/natalieflcn', '_blank');
      break;

    case 'linkedin':
      window.open('https://www.linkedin.com/in/nataliedfalcon/', '_blank');
      break;

    case 'portfolio':
      alert('Portfolio coming soon... Stay tuned!');
      break;
  }
};

export const controlAppError = function (err, view, message) {
  switch (err.message) {
    case 'Pokemon Not Found':
    case 'Map failed to load':
      view.renderError(message || view._errorMessage);
      break;

    case 'NETWORK_ERROR':
      view.renderError(
        'You appear to be offline. Please connect to the internet and try again.',
      );
      break;

    case 'HTTP_400':
      view.renderError('We were unable to fulfill your request.');
      break;

    case 'HTTP_429':
      view.renderError(
        "Oops, sorry! You've sent us too many requests, please try again later.",
      );
      break;

    case 'HTTP_500':
    case 'HTTP_503':
      view.renderError(
        "We're experiencing some technical difficulties, but we're working to fix it. Please refresh the page or return to the Search module.",
      );
      break;

    default:
      view.renderError('Something went wrong!');
      break;
  }
};

const init = async function () {
  // Prevents app from duplication initialization during development (HMR)
  if (window.appInitialized) return;

  window.appInitialized = true;

  try {
    controlNavInit();
    await controlSearchInit();
    await controlMapInit();
    controlProfileInit();
    AboutView.addHandlerAboutBtn(controlAboutBtns);
  } catch (err) {
    controlAppError(
      new Error('HTTP_400'),
      resultsView,
      `Something went wrong! Please refresh the page.`,
    );
  }
};

init();
