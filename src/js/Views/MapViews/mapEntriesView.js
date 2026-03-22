/**
 * Maps Views - Map Entries View
 * ---------------------
 * Responsible for rendering the container where all map entries will be held.
 *
 * Emits events to mapController.
 * Does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';
import mapEntryView from './mapEntryView.js';

class mapEntriesView extends View {
  _parentEl = document.querySelector('.map__entry--container');
  _errorMessage = 'We could not load your Caught Pokémon. Please try again!';

  /**
   * Adds handler to each map entry.
   * When entry is clicked, it will become toggled active.
   * Returns the Pokémon name of associated entry to callback function.
   *
   * @param {Function} handler - Map controller callback (controlMapClickEntry)
   */
  addHandlerClickEntry(handler) {
    this._parentEl.addEventListener('click', e => {
      const entry = e.target.closest('.map__entry');
      if (!entry) return;

      const currentlyActive = this._parentEl.querySelector(
        '.map__entry--active',
      );

      if (currentlyActive && currentlyActive !== entry)
        currentlyActive.classList.remove('map__entry--active');

      // Makes the current entry active
      entry.classList.add('map__entry--active');

      const pokemonName = entry
        .querySelector('.map__entry--name')
        .textContent.trim()
        .split('#')[0];

      handler(pokemonName);
    });
  }

  /**
   * Manually toggles a map entry to be active.
   *
   * @param {string} pokemonName - Name of Pokémon whose entry should be toggled active
   */
  toggleActiveEntry(pokemonName) {
    // Removing currently active map entry, if it exists
    const currentlyActive = this._parentEl.querySelector('.map__entry--active');

    // Finding map entry
    const entriesNodes = this._parentEl.querySelectorAll('.map__entry');
    const entriesArray = [...entriesNodes];
    const entry = entriesArray.find(entry =>
      entry
        .querySelector('.map__entry--name')
        .textContent.includes(pokemonName),
    );

    // Removing active class on other entry, if applicable
    if (currentlyActive && currentlyActive !== entry)
      currentlyActive.classList.remove('map__entry--active');

    // Making map entry active
    entry.classList.add('map__entry--active');

    // Scrolling map entry into view
    entry.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Maps an array of previewViews to be rendered and appended to the savedPokemonView
  _generateMarkup() {
    return this._data.map(entry => mapEntryView.render(entry, false)).join('');
  }

  // Clears the mapEntries container
  _clear() {
    this._parentEl.innerHTML = '';
  }
}

export default new mapEntriesView();
