/**
 * Profile Views – Profile View
 * ---------------------
 * Responsible for rendering Pokémon profile details and managing profile-related DOM interactions.
 *
 * Emits events to the profileController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class ProfileView extends View {
  _parentEl = document.querySelector('.profile__header');
  _errorMessage = 'There was an error loading the profile.';

  /**
   * Adds handler to trigger rendering of profile details during browser navigation events
   *
   * @param {Function} handler - Profile controller callback (controlProfileLoad)
   */
  addHandlerLoadProfile(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  _generateMarkup() {
    return `
              <div class="profile__header--details">
                
                <h2 class="heading">Naty's Pokédex</h2>

                <div class="profile__header--labels">
                  <p class="profile__header--label" data-view="caught">
                    Pokémon Caught<span
                      class="profile__header--label label--inset" data-view="caught"
                      >${this._data.caught.length}</span
                    >
                  </p>

                  <p class="profile__header--label" data-view="favorites">
                    Pokémon Favorited<span
                      class="profile__header--label label--inset" data-view="favorites"
                      >${this._data.favorites.length}</span
                    >
                  </p>
                </div>

               <div class="profile__header--bio bio profile__header--full-text">Grew up catching Pokémon in the Bronx, now training my Pokémon and ready for battle in Dyckman.</div>
                
              </div>
            `;
  }
}

export default new ProfileView();
