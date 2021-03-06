import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes'; 
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';


//API KEY for food2fork 33321ee2df8b9bd14d62e171ce07d7de
//http://food2fork.com/api/search 

/**Global State of the app

- Search Object (search query + result)
- Recipe Object
- Shopping list object
- Liked recipes

**/

const state = {};



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
                
                  state.recipe.parseIngredients();
                //Calc servings and time
                    state.recipe.calcTime();
                    state.recipe.calcServings();
                //Render the recipe 
                clearLoader();
                recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
                
            } catch (error) {
                alert('Error processing recipe');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
//How to call the same function over multiple event listeners
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/* LIST CONTROLLER */

const controlList = () => {
    //Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    //Add each ingredient to the list object and user interface
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item); 
    });
};

//Handle delete and update list item events 

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    //handle delete button 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from state 
        state.list.deleteItem(id);
        //delete from ui
        listView.deleteItem(id);

        //handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


/* LIKE CONTROLLER */

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;

    //user has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        //add like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        );
        //toggle like button styling
        likesView.toggleLikeBtn(true);
        //add like to UI list
        likesView.renderLike(newLike);
        
        //user HAS liked current recipe
    } else {

        //remove like to the state 
        state.likes.deleteLike(currentID);

        //toggle like button styling
        likesView.toggleLikeBtn(false);
        //remove like to UI 
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipe on page load

window.addEventListener('load', () => {

state.likes = new Likes();

//Restore likes
state.likes.readStorage();

//Toggle like menu button
likesView.toggleLikeMenu(state.likes.getNumLikes());

//Render the existing likes

state.likes.likes.forEach(like => {
    likesView.renderLike(like)
    });
});

//Handling recipe button clicks 

elements.recipe.addEventListener('click', e => {
    
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1 ) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller call
        controlLike();
    }
});


