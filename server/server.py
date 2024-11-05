from flask import Flask, request
import requests
import json
from dotenv import load_dotenv
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['RECIPE_KEY'] = os.getenv('RECIPE_KEY')
base_url = 'https://api.spoonacular.com'

def parse_initial_res(response_list):

    parsed_recipes = []
    for recipe in response_list:
        curr_missing = recipe['missedIngredients']
        curr_here = recipe['usedIngredients']
    
        missing_ingredients = []
        present_ingredients = []
        
        for i in range(len(curr_missing)):
            missing_ingredients.append({
                'id':curr_missing[i]['id'],
                'name':curr_missing[i]['original']
            })
        
        for i in range(len(curr_here)):
            present_ingredients.append({
                'id': curr_here[i]['id'],
                'name': curr_here[i]['original']
            })
            
        parsed_recipes.append(
            {
                'id':recipe['id'],
                'recipeName':recipe['title'],
                'image':recipe['image'],
                'numMissingIngrediets':recipe['missedIngredientCount'],
                'missingIngredients':missing_ingredients,
                'presentIngredients':present_ingredients,
            }
        )
    
    return parsed_recipes

@app.route('/recipes', methods=['GET'])
def recipes():
    ingredients = request.args.get('ingredients')
    if not ingredients:
        return "ERROR, PLEASE PASS IN INGREDIENTS"

    num_results = '5'
    ranking = '2' # 1 for most missing to least, 2 for opposite
    ignore_pantry = 'false' # ignores basic pantry items such as flour, water, etc
    
    params = {
        'apiKey':app.config['RECIPE_KEY'],
        'ingredients':ingredients,
        'number':num_results,
        'limitLicense':'true',
        'ranking':ranking,
        'ignorePantry':ignore_pantry,
        }

    initial_res = requests.get(f"https://api.spoonacular.com/recipes/findByIngredients", params=params)
    response_recipes = parse_initial_res(initial_res.json())
    recipe_info_list = [get_recipe_info(r['id']) for r in response_recipes]
    
    
    final_res=[]
    for initial_res, more_info in zip(response_recipes, recipe_info_list):
        final_res.append({
            'initialInfo': initial_res,
            'moreInfo':more_info
        })
    
    return json.dumps(final_res)
# 
def get_recipe_info(recipe_id):
    params = {
        'apiKey':app.config['RECIPE_KEY'],
        'includeNutrition':'false'
    }

    recipe_res = requests.get(f"{base_url}/recipes/{recipe_id}/information", params=params).json()

    return recipe_res

if __name__ == "__main__":
    app.run(debug=True)