import View from './View.js';

class PageNotFoundView extends View {
  _parentEl = document.querySelector('.screen__2--page-not-found');
  _errorMessage = "The page you were looking for doesn't exist.";

  addHandlerBackToSearchBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.page-not-found-2__btn');

      if (!btn) return;

      handler();
    });
  }
}

export default new PageNotFoundView();
