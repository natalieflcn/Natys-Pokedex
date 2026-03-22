/**
 * Maps Views - Delete Entry View
 * ---------------------
 * Responsible for rendering button that will allow the associated entry to be deleted.
 *
 * Emits events to mapController.
 * Does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class DeleteEntryView extends View {
  _parentEl = document.querySelector('.map__entry--container');
  _errorMessage = 'There was an error deleting this entry.';

  /**
   * Adds handler to entry 'delete' button.
   * Returns Pokemon Name to the callback function.
   *
   * @param {Function} handler - Map controller callback (controlMapDeleteEntry)
   */
  addHandlerDeleteBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest('.map__entry--delete');
      if (!btn) return;

      const pokemon = btn
        .closest('.map__entry--options')
        .previousElementSibling.textContent.split('#')[0]
        .trim();

      handler(pokemon);
    });
  }
}

export default new DeleteEntryView();
