import icons from "url:../../img/icons.svg";

import View from "./view.js";
const Fraction = require("fractional").Fraction;
class RecipeView extends View {
  _parentElement = document.querySelector(".recipe");
  _data;
  _errorMessage = "couldn load :(";
  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  addHandlerServings(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn--update-servings");
      if (btn && btn.dataset.updateTo > 0) return handler(btn.dataset.updateTo);
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn--round");

      if (btn) return handler(this._data);
    });
  }

  _generateMarkup = function () {
    return `
    
  <figure class="recipe__fig">
    <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button data-update-to="${
          Number(this._data.servings) - 1
        }" class="btn--tiny btn--update-servings">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button data-update-to="${
          Number(this._data.servings) + 1
        }" class="btn--tiny btn--update-servings">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    ${this._data?.key ? this._renderUserGenerated() : ""}

    <button class="btn--round">
      <svg class="">
        <use href="${icons}#icon-bookmark${
      this._data?.bookmarked === true ? "-fill" : ""
    }"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
    ${this._generateMarkupIngredients(this._data.ingredients)}
    </ul>
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;
  };

  _renderUserGenerated() {
    return `<div class="recipe__user-generated">
    <svg>
      <use href="${icons}#icon-user"></use>
    </svg>
  </div>`;
  }

  _generateMarkupIngredients(ingredients) {
    console.log(ingredients);
    return `${ingredients
      .map((ing) => {
        return ` <li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ing.quantity ? new Fraction(ing.quantity).multiply(1).toString() : ""
      // ing.quantity ? ing.quantity.toString() : ""
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit ?? ""}</span>
      ${ing.description}
    </div>
  </li>
    `;
      })
      .join(" ")}`;
  }

  renderMessage(
    msg = `Start by searching for a recipe or an ingredient. Have fun!`
  ) {
    const markup = `<div class="recipe">
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${msg}</p>
    </div>`;
  }
}
export default new RecipeView();
