/**
 * Maps Views - Form View
 * ---------------------
 * Responsible for rendering the form that generates details on the newly caught Pokémon.
 *
 * Emits events to mapController.
 * Does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class FormView extends View {
  _parentEl = document.querySelector('.map__entry--form');
  _errorMessage = 'There was an error loading the Map form.';

  /**
   * Adds handler to submit form and invoke a function when the 'Log Entry' button is clicked
   *
   * @param {Function} handler - Map controller callback (controlMapLogEntry)
   */
  addHandlerLogEntry(handler) {
    this._parentEl
      .querySelector('.map__btn--submit')
      .addEventListener('click', handler);
  }

  // Reveals the map entry form
  showMapForm() {
    this._parentEl.classList.remove('hidden');
  }

  // Hides the map entry form
  hideMapForm() {
    this._parentEl.classList.add('hidden');
  }

  // Informs whether the map entry form is currently displayed or hidden
  isFormOpen() {
    return !this._parentEl.classList.contains('hidden');
  }

  /**
   * Updates the name and ID fields of the map entry form
   *
   * @param {string} name - Pokémon Name
   * @param {number} id - Pokémon ID
   */
  updateFormNameAndId(name, id) {
    this._parentEl.querySelector('.map__input--name').value = name;
    this._parentEl.querySelector('.map__input--id').value = id;
  }

  /**
   * Updates the location field of the map entry form
   *
   * @param {string} location - Formatted location where Pokémon was caught
   */
  updateFormLocation(location) {
    this._parentEl.querySelector('.map__input--location').value = location;
  }

  // Returns the Pokémon name pre-populated into the map entry form
  getFormName() {
    return this._parentEl.querySelector('.map__input--name').value;
  }

  // Returns all the data populated into the map entry form (Name, ID, Location)
  getFormData() {
    const pokemonData = [
      ...new FormData(this._parentEl.querySelector('.map__form')),
    ];
    console.log(Object.fromEntries(pokemonData));
    return Object.fromEntries(pokemonData);
  }

  // Clears all inputs of the form
  clearForm() {
    this._parentEl.querySelector('.map__input--name').value = '';
    this._parentEl.querySelector('.map__input--id').value = '';
    this._parentEl.querySelector('.map__input--location').value = '';
  }

  // Scrolls the form into view
  scrollIntoView() {
    this._parentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  _generateMarkup() {
    return `
    <div class="map__entry map__entry--new">
              <form class="map__form">
                <div class="map__form--row">
                  <label for="pokemon-name">Name</label>
                  <input
                    class="input map__input--name map__input"
                    type="text"
                    name="pokemon-name"
                    id="pokemon-name"
                    placeholder="Pokémon Name"
                    auto-complete="off"
                  />
                  <label for="pokemon-id">ID</label>
                  <input
                    class="input map__input--id map__input"
                    type="number"
                    name="pokemon-id"
                    id="pokemon-id"
                    placeholder="Pokémon ID"
                    auto-complete="off"
                  />
                </div>
                <div class="map__form--row">
                  <label for="pokemon-location">Location</label>
                  <input
                    class="input map__input--location map__input"
                    type="text"
                    name="pokemon-location"
                    id="pokemon-location"
                    placeholder="Last Caught Pokémon in..."
                    auto-complete="off"
                  />
                  <input type="hidden" id="latitude" name="latitude" value="">
                  <input type="hidden" id="longitude" name="longitude" value="">
                </div>
              </form>
              <button class="btn map__btn--submit btn--red">Log Entry</button>
            </div>     
            `;
  }
}

export default new FormView();
