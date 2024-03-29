const DButils = require("./DButils");

async function markFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}',${recipe_id})`);
}

async function removeFavorite(user_id, recipe_id){
    await DButils.execQuery(`delete from favoriterecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
}

async function getFavoriteRecipesIds(user_id){
    let recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    const res = [];
    recipes_id.map(recipes_id => res.push(recipes_id.recipe_id))
    return res;
    
}
async function getMyRecipes(user_id){
    const recipes = await DButils.execQuery(`select * from recipes where user_id='${user_id}'`);
    return recipes;
}

async function getIngredients(recipe_id){
    const ingrediants = await DButils.execQuery(`select name, amount from ingredients where recipe_id='${recipe_id}'`);
    return await Promise.all(ingrediants);
}


async function createRecipe(recipe_details){
    const recipes = await DButils.execQuery(`select title from recipes where user_id='${recipe_details.user_id}'`);
    recipes.map(recipe => {
        if(recipe.title == recipe_details.title)
            throw 409;
    })

    await DButils.execQuery(`INSERT INTO recipes VALUES ('${recipe_details.user_id}', NULL, 
        '${recipe_details.title}', '${recipe_details.readyInMinutes}', '${recipe_details.image}',
        '${recipe_details.popularity}', '${recipe_details.vegan}', '${recipe_details.vegetarian}',
        '${recipe_details.gluten_free}', '${recipe_details.instructions}', '${recipe_details.servings}')`);

    DButils.execQuery(`select recipe_id from recipes where
        user_id='${recipe_details.user_id}' and title='${recipe_details.title}'`
        ).then(recipe_id => {
            recipe_details.ingredientsNameAmount.map(async iningredient => {
                await DButils.execQuery(`INSERT INTO ingredients VALUES ('${recipe_id[0].recipe_id}', '${iningredient.name}', '${iningredient.amount}')`);
            });
        }).catch(err => next(err));
}




exports.markFavorite = markFavorite;
exports.removeFavorite = removeFavorite;
exports.getFavoriteRecipesIds = getFavoriteRecipesIds;
exports.createRecipe = createRecipe;
exports.getMyRecipes = getMyRecipes;
exports.getIngredients = getIngredients;
