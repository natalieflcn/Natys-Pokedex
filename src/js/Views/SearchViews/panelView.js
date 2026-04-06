/**
 * Search Views – Panel View
 * ---------------------
 * Responsible for rendering Pokémon panel panel-related DOM interactions.
 *
 * Emits events to the searchController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class PanelView extends View {
  _parentEl = document.querySelector('.screen__2--search');
  _errorMessage = 'There was an error loading this Pokémon! Please try again.';

  /**
   * Adds handler to render Pokémon panel
   *
   * @param {Function} handler - Search controller callback (controlSearchPokemonPanel)
   */
  addHandlerRenderPanel(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  /**
   * Adds handler to Pokemon panel 'Caught' button
   *
   * @param {Function} handler - Search controller callback (controlSearchCaughtBtn)
   */
  addHandlerCaughtBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search__btn--caught');

      if (!btn) return;
      handler();
    });
  }

  /**
   * Adds handler to Pokemon panel 'Favorite' button
   *
   * @param {Function} handler - Search controller callback (controlSearchFavoriteBtn)
   */
  addHandlerFavoriteBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search__btn--favorite');

      if (!btn) return;
      handler();
    });
  }

  // Visually toggles 'Favorite' button on Pokémon panel
  toggleFavoriteBtn() {
    this._parentEl
      .querySelector('.search__btn--favorite')
      .classList.toggle('btn--active');
  }

  // Visually toggles 'Caught' button on Pokémon panel
  toggleCaughtBtn() {
    this._parentEl
      .querySelector('.search__btn--caught')
      .classList.toggle('btn--active');
  }

  _generateMarkup() {
    return `
    <div class="search__panel">
              <img
                class="img__display"
                src=${this._data.img}
                alt="Fletchinder"
              />
              <header class="search__panel--header">
                <h2 class="heading">
                  ${this._data.name}<span class="pokemon__id">#${
                    this._data.id
                  }</span>
                </h2>

                <div class="search__panel--types">
                  <span
                    class="profile__stats--type pokemon__type"
                    style="background-color: var(--type--${
                      this._data.types[0]
                    })"
                    >${this._data.types[0]}</span
                  >${
                    this._data.types.length == 2
                      ? `<span class="profile__stats--type pokemon__type" style="background-color: var(--type--${this._data.types[1]})">${this._data.types[1]}</span>`
                      : ''
                  }
                </div>

                <div class="search__panel--measurements">
                  <p>Height <span class="label--inset">${
                    this._data.height
                  }m</span></p>
                  <p>Weight <span class="label--inset">${
                    this._data.weight
                  }kg</span></p>
                </div>
                <p class="search__panel--bio bio">
                  ${this._data.desc}
                </p>
              </header>
            </div>

            <div class="search__abilities">
              <div class="search__stats">
                <h2 class="heading--2">Base Stats</h2>
                <div class="search__stats--row">
                  <p>HP</p>
                  <span class="label--inset">${this._data.stats[0][1]}</span>
                  <div
                    class="progress__outer"
                  ><div class="progress__inner" style="background-color: var(--type--${
                    this._data.types[0]
                  }); width: ${
                    (this._data.stats[0][1] / 255) * 100
                  }%"></div></div>
                </div>
                <div class="search__stats--row">
                  <p>ATK</p>
                  <span class="label--inset">${this._data.stats[1][1]}</span>
                  <div
                    class="progress__outer"
                  ><div class="progress__inner" style="background-color: var(--type--${
                    this._data.types[0]
                  }); width: ${
                    (this._data.stats[1][1] / 255) * 100
                  }%"></div></div>
                </div>
                <div class="search__stats--row">
                  <p>DEF</p>
                  <span class="label--inset">${this._data.stats[2][1]}</span>
                  <div
                    class="progress__outer"
                  ><div class="progress__inner" style="background-color: var(--type--${
                    this._data.types[0]
                  }); width: ${
                    (this._data.stats[2][1] / 255) * 100
                  }%"></div></div>
                </div>
                <div class="search__stats--row">
                  <p>SATK</p>
                  <span class="label--inset">${this._data.stats[3][1]}</span>
                  <div
                    class="progress__outer"
                  ><div class="progress__inner" style="background-color: var(--type--${
                    this._data.types[0]
                  }); width: ${
                    (this._data.stats[3][1] / 255) * 100
                  }%"></div></div>
                </div>
                <div class="search__stats--row">
                  <p>SDEF</p>
                  <span class="label--inset">${this._data.stats[4][1]}</span>
                  <div
                    class="progress__outer"
                  ><div class="progress__inner" style="background-color: var(--type--${
                    this._data.types[0]
                  }); width: ${
                    (this._data.stats[4][1] / 255) * 100
                  }%"></div></div>
                </div>
                <div class="search__stats--row">
                  <p>SPD</p>
                  <span class="label--inset">${this._data.stats[5][1]}</span>
                  <div
                    class="progress__outer"
                  ><div class="progress__inner" style="background-color: var(--type--${
                    this._data.types[0]
                  }); width: ${
                    (this._data.stats[5][1] / 255) * 100
                  }%"></div></div>
                </div>
              </div>

              <div class="search__moves">
                <h2 class="heading--2">Moves</h2>
                <div class=search__moves--collection>
                <p>1<span class="search__moves--known" style="background-color: var(${
                  this._data.moves?.[0]?.[1] ? '--type--' : ''
                }${
                  this._data.moves?.[0]?.[1] ||
                  '--secondary-color--grey-gradient'
                });">${this._data.moves?.[0]?.[0] || '???'}</span></p>

                <p>2<span class="search__moves--known" style="background-color: var(${
                  this._data.moves?.[0]?.[1] ? '--type--' : ''
                }${
                  this._data.moves?.[1]?.[1] ||
                  '--secondary-color--grey-gradient'
                });">${this._data.moves?.[1]?.[0] || '???'}</span></p>

                <p>3<span class="search__moves--known" style="background-color: var(${
                  this._data.moves?.[0]?.[1] ? '--type--' : ''
                }${
                  this._data.moves?.[2]?.[1] ||
                  '--secondary-color--grey-gradient'
                });">${this._data.moves?.[2]?.[0] || '???'}</span></p>

                <p>4<span class="search__moves--known" style="background-color: var(${
                  this._data.moves?.[0]?.[1] ? '--type--' : ''
                }${
                  this._data.moves?.[3]?.[1] ||
                  '--secondary-color--grey-gradient'
                });">${this._data.moves?.[3]?.[0] || '???'}</span></p>

                <p>5<span class="search__moves--known" style="background-color: var(${
                  this._data.moves?.[0]?.[1] ? '--type--' : ''
                }${
                  this._data.moves?.[4]?.[1] ||
                  '--secondary-color--grey-gradient'
                });">${this._data.moves?.[4]?.[0] || '???'}</span></p>

                <p>6<span class="search__moves--known" style="background-color: var(${
                  this._data.moves?.[0]?.[1] ? '--type--' : ''
                }${
                  this._data.moves?.[5]?.[1] ||
                  '--secondary-color--grey-gradient'
                });">${this._data.moves?.[5]?.[0] || '???'}</span></p>
                </div>
              </div>
            </div>

            <div class="search__pagination">
              <button class="btn search__btn--prev btn--blue" data-page="prev">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  class="bi bi-arrow-left-short"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
                  />
                </svg>
              </button>
              
              <button class="btn search__btn--caught btn--yellow ${
                this._data.caught ? 'btn--active' : ''
              }">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  fill="currentColor"
                  class="bi bi-geo-alt-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"
                  />
                </svg>
                <span class="full-text">Caught This Pokémon</span><span class="short-text">Caught</span>
              </button>

              <button class="btn search__btn--favorite btn--red ${
                this._data.favorite ? 'btn--active' : ''
              }">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  fill="currentColor"
                  class="bi bi-suit-heart-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"
                  />
                </svg>
                <span class="full-text">Favorite</span><span class="short-text">Favorite</span>
              </button>
              <button class="btn search__btn--next btn--blue" data-page="next">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  class="bi bi-arrow-right-short"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                  />
                </svg>
              </button>
            </div>
    `;
  }
}

export default new PanelView();
