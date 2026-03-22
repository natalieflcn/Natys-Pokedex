import View from '../View.js';

class MapEntryView extends View {
  _parentEl = document.querySelector('.map__entry--container');
  _errorMessage = 'There was an error loading this Caught Pokémon entry.';

  _generateMarkup() {
    // console.log(this._data.types);
    return `
            <div class="map__entry ">
                <img
                  class="map__entry--img img__display"
                  src=${this._data.img}
                />

                <div class="map__entry--details">
                  <header class="map__entry--header">
                    <h2 class="map__entry--name">
                      ${this._data.name}<span class="map__entry--id pokemon__id"
                        >#${this._data.id}</span
                      >
                    </h2>

                    <div class="map__entry--options">
                      <button class="map__entry--edit" aria-describedby="edit-desc">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-gear-wide-connected" viewBox="0 0 16 16">
                        <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/>
                        </svg>
                      </button>
                      
                      <span class="map__entry--tooltip" role="tooltip" id="edit-desc">Edit Pokèmon's Location</span> 

                      <button class="map__entry--delete" aria-describedby="delete-desc">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                      </button>

                      <span class="map__entry--tooltip" role="tooltip" id="delete-desc">Delete Caught Pokémon</span>

                     
                    </div>
                     
                  </header>

                  <div class="map__entry--types">
                    <p class="profile__stats--type pokemon__type" style="background-color: var(--type--${this._data.types[0]})">${this._data.types[0]}</p>

                    ${this._data.types.length == 2 ? `<p class="profile__stats--type pokemon__type" style="background-color: var(--type--${this._data.types[1]})">${this._data.types[1]}</p>` : ''}
                  </div>

                  <div class="map__entry--caught">
                    <p>Last Caught in</p>
                    <p class="map__entry--location">${this._data.location || 'Unknown Location'}</p>
                  </div>
                </div>
              </div>
            `;
  }
}

export default new MapEntryView();
