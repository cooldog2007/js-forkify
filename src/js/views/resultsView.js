import icons from "url:../../img/icons.svg";
import View from "./view.js";
import paginationView from "./paginationView.js";
import previewView from "./previewView.js";
import { RES_PER_PAGE } from "../config.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _data;
  _errorMessage = "No recipes found. Try again !";

  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join(" ");
  }
}

export default new ResultsView();
