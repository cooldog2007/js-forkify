// import icons from '../img/icons.svg'; //parcel 1
import 'regenerator-runtime/runtime';
import 'core-js/stable';
import { API_URL, MODAL_CLOSE_SECS } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    await model.loadRecipe(API_URL, id);
    resultsView.render(model.getResultsPage());
    bookmarkView.update(model.state.bookmarks);

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err.message);
    recipeView.renderError(err.message);
  }
};

const controlSearchResults = async function () {
  try {
    const query = `${searchView.getQuery()}`;
    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchResult(query);
    resultsView.render(model.getResultsPage());
    paginationView.render(model.state.search.result);
  } catch (err) {
    console.error(err.message);
  }
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function (recipe) {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(recipe);
  } else model.deleteBookmark(recipe.id);

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const constrolAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECS * 1000);
    addRecipeView.renderMessage();

    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const controlPagination = function (page) {
  console.log(page);
  resultsView.render(model.getResultsPage(page));
  paginationView.render(model.state.search.result);
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  paginationView.addHandlerPage(controlPagination);
  searchView.addHandlerSearch(controlSearchResults);
  addRecipeView.addHandlerUpload(constrolAddRecipe);
};
init();
