import icons from 'url:../../img/icons.svg';
import View from './view.js';
import { RES_PER_PAGE } from '../config.js';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  currentPage = 1;
  _data;

  _generateMarkup() {
    const markup = [];
    if (this.currentPage < Math.ceil(this._data.length / RES_PER_PAGE))
      markup.push(` <button data-go-to="${
        this.currentPage + 1
      }"  class="btn--inline pagination__btn--next">
            <span>Page ${this.currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`);
    if (this.currentPage > 1)
      markup.push(`<button data-go-to="${
        this.currentPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this.currentPage - 1}</span>
    </button>`);
    return markup.join('');
  }

  addHandlerPage(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (btn && btn.classList.contains('pagination__btn--prev')) {
        this.currentPage--;
        return handler(Number(btn.dataset.goTo));
      }

      if (btn) {
        this.currentPage++;

        return handler(Number(btn.dataset.goTo));
      }
    });
  }

  resetPagination() {
    this.currentPage = 1;
    this.render(this._data);
  }
}

export default new PaginationView();
