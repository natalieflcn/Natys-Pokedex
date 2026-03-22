import View from '../View.js';

class TypesView extends View {
  _parentEl = document.querySelector('.profile__types');
  _errorMessage = 'There was an error loading the profile.';

  _generateMarkup() {
    const mode = this._data.mode === 'Caught' ? 'caught' : 'favorites';

    console.log(0 / this._data[mode].length);

    return `
            <h2>Types of Pokémon ${this._data.mode}</h2>
            <div class="profile__stats">
              <div class="profile__stats--column">
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Normal"
                    style="background-color: var(--type--Normal)"
                  >
                    Normal
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Normal
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                    <span class="profile__progress progress__inner" style="background-color: var(--type--Normal); width:${
                      (this._data.types.Normal / this._data[mode].length) *
                        100 || 0
                    }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Fire" style="background-color: var(--type--Fire)""
                  >
                    Fire
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Fire
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Fire); width:${
                    (this._data.types.Fire / this._data[mode].length) * 100 || 0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Water" style="background-color: var(--type--Water)"
                  >
                    Water
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Water
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Water); width:${
                    (this._data.types.Water / this._data[mode].length) * 100 ||
                    0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Electric" style="background-color: var(--type--Electric)"
                  >
                    Electric
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Electric
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Electric); width:${
                    (this._data.types.Electric / this._data[mode].length) *
                      100 || 0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Grass" style="background-color: var(--type--Grass)"
                  >
                    Grass
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Grass
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Grass); width:${
                    (this._data.types.Grass / this._data[mode].length) * 100 ||
                    0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p class="profile__stats--type pokemon__type" data-type="ice" style="background-color: var(--type--Ice)">
                    Ice
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Ice
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Ice); width:${
                    (this._data.types.Ice / this._data[mode].length) * 100 || 0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Fighting" style="background-color: var(--type--Fighting)"
                  >
                    Fighting
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Fighting
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Fighting); width:${
                    (this._data.types.Fighting / this._data[mode].length) *
                      100 || 0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Poison" style="background-color: var(--type--Poison)"
                  >
                    Poison
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Poison
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Poison); width:${
                    (this._data.types.Poison / this._data[mode].length) * 100 ||
                    0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Ground" style="background-color: var(--type--Ground)"
                  >
                    Ground
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Ground
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Ground); width:${
                    (this._data.types.Ground / this._data[mode].length) * 100 ||
                    0
                  }%"></span>
                  </div>
                </div>
              </div>

              <div class="profile__stats--column">
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Flying" style="background-color: var(--type--Flying)"
                  >
                    Flying
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Flying
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Flying); width:${
                    (this._data.types.Flying / this._data[mode].length) * 100 ||
                    0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Psychic" style="background-color: var(--type--Psychic)"
                  >
                    Psychic
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Psychic
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Psychic); width:${
                    (this._data.types.Psychic / this._data[mode].length) *
                      100 || 0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p class="profile__stats--type pokemon__type" data-type="Bug" style="background-color: var(--type--Bug)"> 
                    Bug
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Bug
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Bug); width:${
                    (this._data.types.Bug / this._data[mode].length) * 100 || 0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Rock" style="background-color: var(--type--Rock)"
                  >
                    Rock
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Rock
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Rock); width:${
                    (this._data.types.Rock / this._data[mode].length) * 100 || 0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Ghost" style="background-color: var(--type--Ghost)"
                  >
                    Ghost
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Ghost
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Ghost); width:${
                    (this._data.types.Ghost / this._data[mode].length) * 100 ||
                    0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Dragon" style="background-color: var(--type--Dragon)"
                  >
                    Dragon
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Dragon
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Dragon); width:${
                    (this._data.types.Dragon / this._data[mode].length) * 100 ||
                    0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Dark" style="background-color: var(--type--Dark)"
                  >
                    Dark
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Dark
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Dark); width:${
                    (this._data.types.Dark / this._data[mode].length) * 100 || 0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Steel" style="background-color: var(--type--Steel)"
                  >
                    Steel
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Steel
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Steel); width:${
                    (this._data.types.Steel / this._data[mode].length) * 100 ||
                    0
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Fairy" style="background-color: var(--type--Fairy)"
                  >
                    Fairy
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.types.Fairy
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Fairy); width:${
                    (this._data.types.Fairy / this._data[mode].length) * 100 ||
                    0
                  }%"></span>
                  </div>
                </div>
              </div>
            </div>
            `;
  }
}

export default new TypesView();
