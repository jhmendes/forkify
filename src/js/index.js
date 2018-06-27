import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';



//API KEY for food2fork 33321ee2df8b9bd14d62e171ce07d7de
//http://food2fork.com/api/search 

/**Global State of the app

- Search Object (search query + result)
- Recipe Object
- Shopping list object
- Liked recipes

**/
const state = {

}

/* SEARCH CONTROLLER */

const controlSearch =  async () => {
    //1. get the query from the view
     const query = searchView.getInput(); 

    
    //2. Create new search object
    
    if (query) {
        //New search object and add to state
        state.search = new Search(query);
      
        //3 Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4) search for 
        try {
            await state.search.getResults();
    
            //5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
            
            console.log(state.search.result);
        } catch (error) {
            alert('Error processing search');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
    
});


/* RECIPE CONTROLLER */

const controlRecipe = async () => {

    //Get ID from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);


    if (id) {
        //Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item

        if (state.search) {
            searchView.highlightSelected(id);
        }
        //Create new recipe object
            state.recipe = new Recipe(id);

        

            try {
                
                //Get recipe data and parse ingredients
                  await  state.recipe.getRecipe();
                console.log(state.recipe.ingredients);
                  state.recipe.parseIngredients();
                //Calc servings and time
                    state.recipe.calcTime();
                    state.recipe.calcServings();
                //Render the recipe 
                clearLoader();
                recipeView.renderRecipe(state.recipe);
                
            } catch (error) {
                alert('Error processing recipe');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
//How to call the same function over multiple event listeners
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));