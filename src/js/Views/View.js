import pokeball from '../../../public/imgs/logo.svg';

export default class View {
  _data;

  // Clears the current view
  _clear() {
    this._parentEl.innerHTML = '';
  }

  /**
   * Renders a Pokéball spinner to provide visual feedback while data is loading
   *
   * @param {boolean} append - Determines whether the view should be cleared before rendering spinner or if spinner should be appended
   */
  renderSpinner = function (append = false) {
    const markup = `
    <div class="spinner__div">
        <img class="spinner__img" src="${pokeball}"/>
    </div>
  `;

    if (!append) this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  };

  /**
   * Renders incoming data for the current view.
   *
   * @param {string} data - Markup text to be rendered
   * @param {boolean} render - Determines whether the data should be rendered immediately or returned as markup text
   * @param {boolean} append - Determines whether the view should be cleared before rendering data or if data should be appended
   */
  render(data, render = true, append = false) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    if (!append) this._clear();

    this._parentEl.insertAdjacentHTML(
      `${append ? 'beforeend' : 'afterbegin'}`,
      markup,
    );
  }

  /**
   * Renders error for the current view.
   *
   * @param {string} message - Error message to be rendered
   */
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
          </svg>
          <p>${message}</p> 
      </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // Manually removes spinner
  removeSpinner() {
    const spinner = this._parentEl.querySelector('.spinner__div');
    spinner?.remove();
  }
}
