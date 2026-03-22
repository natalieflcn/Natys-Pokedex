/**
 * Search Views – Pagination View
 * ---------------------
 * Responsible for rendering Pokémon panel pagination controls and managing pagination-related DOM interactions.
 *
 * Emits events to the searchController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.screen__2--search');
  _errorMessage = 'There was a problem paginating through Pokémon.';

  /**
   * Adds handler to Pokémon panel pagination buttons ('prev'/'next')
   *
   * @param {Function} handler - Search controller callback (controlSearchPagination)
   */
  addHandlerPaginationClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search__btn--next, .search__btn--prev');
      if (!btn) return;

      const direction = btn.dataset.page;

      handler(direction);
    });
  }

  /**
   * Disables pagination button
   *
   * @param {string} btn - 'prev' or 'next' button
   */
  disablePaginationBtn(btn) {
    this._parentEl
      .querySelector(`.search__btn--${btn}`)
      .classList.add('btn--disabled');
  }

  /**
   * Enables pagination button
   *
   * @param {string} btn - 'prev' or 'next' button
   */
  enablePaginationBtn(btn) {
    this._parentEl
      .querySelector(`.search__btn--${btn}`)
      .classList.remove('btn--disabled');
  }

  /**
   * Removes pagination button in the event that a single Pokémon is being rendered outside of a collection
   */
  removePaginationBtns() {
    this._parentEl
      .querySelectorAll('.search__btn--prev, .search__btn--next')
      .forEach(btn => btn.classList.add('search__btn--hidden'));
  }
}

export default new PaginationView();
