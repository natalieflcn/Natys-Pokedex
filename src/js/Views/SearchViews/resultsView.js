/**
 * Search Views – Results View
 * ---------------------
 * Responsible for rendering Pokémon search results controls and managing results-related DOM interactions.
 *
 * Emits events to the searchController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.search__preview--container');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  // Sentinel elemnt used for infinite scroll
  _sentinel = document.querySelector('.search__sentinel');
  _observer = null;

  /**
   * Calls handler function (to load Pokémon search results) when View loads.
   *
   * @param {Function} handler - Search controller callback (controlSearchResults)
   */
  addHandlerLoadResults(handler) {
    this._parentEl.addEventListener('load', handler);
  }

  /**
   * Observes the sentinel element for infinite scroll.
   * Triggers loading more results when sentinel enters viewport.
   *
   * @param {Function} handler - Search controller callback (controlSearchInfiniteScroll)
   */
  observeSentinel(handler) {
    this._observer = new IntersectionObserver(entries =>
      entries.forEach(
        entry => {
          if (entry.isIntersecting) handler();
        },
        { root: null, threshold: 0.01, rootMargin: '100%' },
      ),
    );

    this._observer.observe(this._sentinel);
  }

  // Stops observing sentinel element to prevent additional callbacks.
  // Useful when there are no more search results to be rendered
  unobserveSentinel() {
    if (!this._observer || !this._sentinel) return;
    this._observer.unobserve(this._sentinel);
  }

  /**
   * Scrolls to the currently active Pokémon.
   *
   * @param {string} pokemonName - Name of Pokémon who should be currently active
   */
  scrollIntoView(pokemonName) {
    const pokemon = this._parentEl.querySelector(`.search__preview--active`);

    if (!pokemon) return;

    if (
      pokemon.querySelector('.search__preview--name').textContent !==
      pokemonName
    )
      return;

    pokemon.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  _generateMarkup() {
    // Map an array of previewViews to be rendered and appended to resultsView
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
