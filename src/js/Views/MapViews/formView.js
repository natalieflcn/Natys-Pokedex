import View from '../View.js';

class FormView extends View {
  _parentEl = document.querySelector('.map__entry--form');
  _errorMessage = 'There was an error loading the Map form.';

  /**
   * Adds handler to trigger rendering of profile details during browser navigation events
   *
   * @param {Function} handler - Profile controller callback (controlProfileLoad)
   */

  showMapForm() {
    this._parentEl.classList.remove('hidden');
  }

  getFormName() {
    return this._parentEl.querySelector('.map__input--name').value;
  }

  updateFormNameAndId(name, id) {
    this._parentEl.querySelector('.map__input--name').value = name;
    this._parentEl.querySelector('.map__input--id').value = id;
  }

  updateFormLocation(location) {
    this._parentEl.querySelector('.map__input--location').value = location;
  }

  hideMapForm() {
    this._parentEl.classList.add('hidden');
  }

  isFormOpen() {
    return !this._parentEl.classList.contains('hidden');
  }

  getFormData() {
    const pokemonData = [
      ...new FormData(this._parentEl.querySelector('.map__form')),
    ];
    console.log(Object.fromEntries(pokemonData));
    return Object.fromEntries(pokemonData);
  }

  addHandlerLogEntry(handler) {
    this._parentEl
      .querySelector('.map__btn--submit')
      .addEventListener('click', handler);
  }

  scrollIntoView() {
    this._parentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  clearForm() {
    this._parentEl.querySelector('.map__input--name').value = '';
    this._parentEl.querySelector('.map__input--id').value = '';
    this._parentEl.querySelector('.map__input--name').value = '';
    this._parentEl.querySelector('.map__input--location').value = '';
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
