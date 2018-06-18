import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements} from './views/base';




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

        //4) search for Recipes
        await state.search.getResults();

        //5) Render results on UI
        searchView.renderResults(state.search.result);
        
        console.log(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});




