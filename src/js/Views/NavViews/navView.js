/**
 * Navigation View
 * ---------------------
 * Responsible for rendering Pokédex navigation buttons managing navigation-related DOM interactions.
 *
 * Emits events to navController and interacts with searchController when redirecting from Profile to Search module.
 * Does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class NavView extends View {
  _parentEl = document.querySelector('.container');
  _errorMessage = 'There was an error loading the navigation bar.';

  /**
   * Adds handler to navigation menu buttons.
   *
   * @param {Function} handler - Navigation controller callback (controlNavBtn)
   */
  addHandlerNavigateBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.header__btn');
      if (!btn) return;

      const page = btn.dataset.page;
      if (!page) return;

      handler(page);
    });
  }

  addHandlerLogo(handler) {
    this._parentEl
      .querySelector('.header__logo')
      .addEventListener('click', handler);
  }
  /**
   * Adds handler that renders the appropriate module when user is navigating around browser history stack
   *
   * @param {Function} handler - Navigation controller callback (controlNavBrowser)
   */
  addHandlerBrowser(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  /**
   * Adds handler that rewrites root URL '/' to '/search' to maintain URL consistency
   *
   * @param {Function} handler - Navigation controller callback (controlNavInitialLoad)
   */
  addHandlerInitialLoad(handler) {
    document.addEventListener('DOMContentLoaded', handler);
  }

  // Removes all active classes and hides the current screens, prepping to instantiate a module
  resetNav() {
    this._parentEl
      .querySelectorAll(
        '.screen__1--search, .screen__2--search, .screen__1--map, .screen__2--map, .screen__1--profile, .screen__2--profile, .screen__1--about, .screen__2--about, .screen__1--page-not-found, .screen__2--page-not-found',
      )
      .forEach(page => page.classList.add('hidden'));

    this._parentEl
      .querySelectorAll(
        '.lights__inner--blue, .lights__inner--yellow, .lights__inner--green, .lights__inner--red',
      )
      .forEach(light => light.classList.remove('lights__inner--active'));

    this._parentEl
      .querySelectorAll(
        '.header__btn--search, .header__btn--map, .header__btn--profile, .header__btn--about',
      )
      .forEach(btn => btn.classList.remove('btn--active', 'btn--disabled'));
  }

  // Adds active classes to Search module and displays Search module screens
  toggleNavSearch() {
    this._parentEl
      .querySelectorAll('.screen__1--search, .screen__2--search')
      .forEach(screen => screen.classList.remove('hidden'));

    this._parentEl
      .querySelector('.lights__inner--blue')
      .classList.add('lights__inner--active');

    this._parentEl
      .querySelector('.header__btn--search')
      .classList.add('btn--active', 'btn--disabled');
  }

  // Adds active classes to Map module and displays Map module screens
  toggleNavMap() {
    this._parentEl
      .querySelectorAll('.screen__1--map, .screen__2--map')
      .forEach(screen => screen.classList.remove('hidden'));

    this._parentEl
      .querySelector('.lights__inner--yellow')
      .classList.add('lights__inner--active');

    this._parentEl
      .querySelector('.header__btn--map')
      .classList.add('btn--active', 'btn--disabled');
  }

  // Adds active classes to Profile module and displays Profile module screens
  toggleNavProfile() {
    this._parentEl
      .querySelectorAll('.screen__1--profile, .screen__2--profile')
      .forEach(screen => screen.classList.remove('hidden'));

    this._parentEl
      .querySelector('.lights__inner--green')
      .classList.add('lights__inner--active');

    this._parentEl
      .querySelector('.header__btn--profile')
      .classList.add('btn--active', 'btn--disabled');
  }

  // Adds active classes to About module and displays About module screens
  toggleNavAbout() {
    this._parentEl
      .querySelectorAll('.screen__1--about, .screen__2--about')
      .forEach(screen => screen.classList.remove('hidden'));

    this._parentEl
      .querySelector('.lights__inner--red')
      .classList.add('lights__inner--active');

    this._parentEl
      .querySelector('.header__btn--about')
      .classList.add('btn--active', 'btn--disabled');
  }

  // Adds active classes to Page Not Found module and displays Page Not Found module
  toggleNavPageNotFound() {
    this._parentEl
      .querySelectorAll(
        '.screen__1--page-not-found, .screen__2--page-not-found',
      )
      .forEach(screen => screen.classList.remove('hidden'));
  }
}

export default new NavView();
