import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
}


//'Pasta with tomato and spinach' > turns to array with each word
/*
acc: 0  / acc + cur.length = 5;  ['Pasta']
acc: 5 / acc + cur.length = 9; ['Pasta', 'With']
acc: 9 / acc + cur.length = 15;  ['Pasta', 'With', 'Tomato']
acc: 15 / acc + cur.length = 18;  ['Pasta', 'With', 'Tomato']
acc: 18 / acc + cur.length = 18;  ['Pasta', 'With', 'Tomato'] -program stops here

*/
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
 if (title.length > limit) {

    title.split(' ').reduce((acc, cur) => {
        if (acc + cur.length <= limit) {
            newTitle.push(cur);
        }
        return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
 }
  return title;
};


const renderRecipe = recipe => {
  //this is a private function to this file
  const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const renderResults = recipes => {
  //this receives an array of 30 recipes
  recipes.forEach(renderRecipe);
};
