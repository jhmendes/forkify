import Search from './models/Search';


const search = new Search('pizza');
console.log(search);
//API KEY for food2fork 33321ee2df8b9bd14d62e171ce07d7de
//http://food2fork.com/api/search 

search.getResults();

