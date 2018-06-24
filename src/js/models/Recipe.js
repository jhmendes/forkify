import axios from 'axios';
import {key, proxy} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

  async getRecipe() {
      try {
        const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
        this.title = res.data.recipe.title;
        this.author = res.data.recipe.publisher;
        this.img = res.data.recipe.image_url;
        this.url = res.data.recipe.source_url;
        this.ingredients = res.data.recipe.ingredients;
        console.log(res);
    } catch (error) {
          console.log(error);
          alert('Something broke');
      }
   }

   calcTime() {
       //assuming that we need 15 minutes for each 3 ingredients
       const numIng = this.ingredients.length;
       const periods = Math.ceil(numIng / 3);
       this.time = periods * 15;
   }
   calcServings() {
       this.servings = 4;
   }
 
   parseIngredients() {

    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

    //new Ingredients is the mapped array
       const newIngredients = this.ingredients.map( el => {
        //1. Uniform units
        let ingredient = el.toLowerCase();
        unitsLong.forEach((unit, i) => {
            ingredient = ingredient.replace(unit, unitsShort[i]);
        });

        //2.  Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

        //3. Parse Ingredients into count, unit, and ingredient itself
        //example: "1 1/2 cup mozzarella cheese"

        const arrIng = ingredient.split(' ');
        //Find position of unit when you don't know which unit you're looking for
        const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

        let objIng;

        if (unitIndex > -1) {
            //There is a unit
            //Ex. 4 1/2 cups, arrCount = [4, 1/2]; --> "4+1/2" this will be interpreted as JS code calculate it = 4.5
            //Ex. 4 cups, arrCount = [4];

            const arrCount = arrIng.slice(0, unitIndex); 
            let count;
            if (arrCount.length === 1) {
                //Example: 4-1/2...this counts as one item, not two- so you replace - with + and call eval 
                count = eval(arrIng[0].replace('-', '+'));
            } else {
                count = eval(arrIng.slice(0, unitIndex).join('+'));
            }

            objIng = {
                count, 
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex + 1).join(' ')
            }

        } else if (parseInt(arrIng[0], 10)) {
            //There is no unit but 1st element is a number
            objIng = {
                count: parseInt(arrIng[0], 10),
                unit: '',
                ingredient: arrIng.slice(1).join(' ')
            }
        } else if (unitIndex === -1) {
            //There is no unit and no number in first position
            objIng = {
                count: 1,
                unit: '',
                ingredient
            };
        }

        //map requires you to return something to be placed into the new array as the element
        return objIng;

       });
       this.ingredients = newIngredients;
   }
}
