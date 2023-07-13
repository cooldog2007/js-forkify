import View from './view.js';
import paginationView from './paginationView.js';

class SearchView extends View {
  #parentElement = document.querySelector('.search');

  getQuery() {
    return this.#parentElement.querySelector('.search__field').value;
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler.call();
      paginationView.resetPagination();
    });
  }
}

export default new SearchView();
