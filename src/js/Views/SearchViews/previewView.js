/**
 * Search Views – Preview View
 * ---------------------
 * Responsible for rendering Pokémon preview panels for search results and managing preview-related DOM interactions.
 *
 * Emits events to the searchController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';
import { capitalize } from '../../helpers.js';

class PreviewView extends View {
  _parentEl = document.querySelector('.search__preview--container');
  _errorMessage = 'There was an error Pokémon previews for the search results.';

  /**
   * Adds handler to Pokémon preview panels
   *
   * @param {Function} handler - Search controller callback (controlSearchClickPreview)
   */
  addHandlerClickActivePreview(handler) {
    this._parentEl.addEventListener('click', e => {
      const preview = e.target.closest('.search__preview');
      if (!preview) return;

      // If there's already an active Pokémon preview, remove its active class
      const currentlyActive = this._parentEl.querySelector(
        '.search__preview--active',
      );
      if (currentlyActive && currentlyActive !== preview)
        currentlyActive.classList.remove('search__preview--active');

      // Setting the selected Pokémon preview as the active preview
      preview.classList.add('search__preview--active');

      const pokemonName = preview.querySelector(
        '.search__preview--name',
      ).textContent;
      handler(pokemonName);
    });
  }

  _generateMarkup() {
    const id = capitalize(window.location.pathname.split('/search/')[1]);

    return `
            <div class="search__preview ${
              this._data.name === id ? 'search__preview--active' : ''
            }">
                <span class="pokemon__id search__preview--id">#${
                  this._data.id
                }</span
                ><img
                  class="search__preview--img"
                  src=${this._data.img}
                  alt=""
                />
                <p class="search__preview--name">${this._data.name}</p>
            </div>
            `;
  }
}

export default new PreviewView();
