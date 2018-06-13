import axios from 'axios';

async function getResults(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '33321ee2df8b9bd14d62e171ce07d7de';

    try {
        const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        console.log(recipes);
    } catch (error) {
        alert(error);
    }
   
}
  
getResults('pizza'); 

//API KEY for food2fork 33321ee2df8b9bd14d62e171ce07d7de
//http://food2fork.com/api/search 

