/**
 * Map Views – Query View
 * ---------------------
 * Responsible for rendering Pokémon Map module input where user can query for Caught Pokémon and managing query-related DOM interactions.
 *
 * Emits events to the mapController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class QueryView extends View {
  _parentEl = document.querySelector('.caught__input');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  /**
   * Adds handler for map input events:
   * - 'input' for live updates
   * - 'keydown' to prevent default submission
   * - 'load' to attach controller handler
   *
   * @param {Function} handler - Map controller callback (controlMapLoadEntries)
   */
  addHandlerQuery(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));

    this._parentEl.addEventListener('input', handler);

    this._parentEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }

  // Returns the current value of the map input field
  getQuery() {
    return this._parentEl.value;
  }

  // Clears the map input field
  clearInput() {
    this._parentEl.value = '';
  }

  // Changes placeholder text of input field when screen size changes, if applicable
  changePlaceholderText() {
    const windowWidth = window.innerWidth;

    if (windowWidth < 1200) {
      this._parentEl.setAttribute('placeholder', 'Search...');
    } else {
      this._parentEl.setAttribute('placeholder', 'Search Caught Pokémon...');
    }
  }

  // Attaches handler to input field to change placeholder text when window is resized
  addHandlerChangePlaceholder() {
    this.changePlaceholderText();
    window.addEventListener('resize', this.changePlaceholderText.bind(this));
  }
}

export default new QueryView();
