import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        //https://crossorigin.me/
        //https://cors-anywhere.herokuapp.com/
        const key = '33321ee2df8b9bd14d62e171ce07d7de';
    
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }
       
    }
}




  

