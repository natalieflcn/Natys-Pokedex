/**
 * Maps Views - Header View
 * ---------------------
 * Responsible for rendering the number of Caught Pokémon on the Map module
 *
 * Emits events to mapController.
 * Does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class HeaderView extends View {
  _parentEl = document.querySelector('.map__header--caught');
  _errorMessage = 'There was an error loading the number of Caught Pokémon.';

  /**
   * Adds handler to trigger rendering of number of Caught Pokémon
   *
   * @param {Function} handler - Map controller callback (controlMapLoadSummary)
   */
  addHandlerLoadSummary(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  _generateMarkup() {
    return `${this._data}`;
  }
}

export default new HeaderView();
