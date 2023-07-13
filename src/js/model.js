import { AJAX, createRecipeObj } from './helpers.js';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
  },
  bookmarks: [],
};

export const loadRecipe = async function (url, id) {
  try {
    const data = await AJAX(`${url}${id}?key=${KEY}`);

    state.recipe = createRecipeObj(data);

    if (state.bookmarks.some(rec => rec.id === id))
      state.recipe.bookmarked = true;
  } catch (err) {
    console.error(`${err} : unda da knee`);
    throw new Error(`No recipe found. Try again nigger boy!`);
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        publisher: rec.publisher,
        title: rec.title,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // state.searchResults = recipes;
  } catch (err) {
    console.error(`${err} : unda da knee`);
    throw new Error(`No recipe found. Try again nigger boy!`);
  }
};

export const getResultsPage = function (page = 1) {
  return state.search.result.slice(
    page * RES_PER_PAGE - RES_PER_PAGE,
    page * RES_PER_PAGE
  );
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipe.servings;
  });
  state.recipe.servings = servings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const i = state.bookmarks.findIndex(rec => rec.id === id);
  state.bookmarks.splice(i, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(en => en[0].includes('ingredient') && en[1] !== '')
      .map(en => {
        const ingArr = en[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Wrong format retard');
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObj(data);
    addBookmark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};

init();
console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
