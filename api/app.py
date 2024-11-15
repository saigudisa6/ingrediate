from flask import Flask, request, jsonify
import requests
import json
from dotenv import load_dotenv
import os
from flask_cors import CORS
from bs4 import BeautifulSoup
from google.cloud import translate_v2 as translate
import base64
from pymongo import MongoClient

load_dotenv()
app = Flask(__name__)
CORS(app)
client = MongoClient(os.getenv('CONNECTION_STRING'))
recipe_favs = client['user_data']['favorites']

app.config['RECIPE_KEY'] = os.getenv('RECIPE_KEY')
base_url = 'https://api.spoonacular.com'

j_data = base64.b64decode(os.getenv("ENCODED_TRANSLATE_JSON")).decode('utf-8')
with open("service-file.json", "w") as j_file:
    j_file.write(j_data)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service-file.json"

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

@app.route('/api/flask/getRecipeById', methods=['GET'])
def getRecipeById():
    recipe_id = request.args.get('recipeId')
    return getRecipeInfo(recipe_id)

def getRecipeInfo(recipe_id):
    params = {
        'apiKey':app.config['RECIPE_KEY'],
        'includeNutrition':'false'
    }

    recipe_res = requests.get(f"{base_url}/recipes/{recipe_id}/information", params=params).json()

    return recipe_res

@app.route('/api//flask/recipes', methods=['GET'])
def recipes():
    ingredients = request.args.get('ingredients')
    if not ingredients:
        return "ERROR, PLEASE PASS IN INGREDIENTS"

    num_results = '5'
    ranking = '2' # 1 for most missing to least, 2 for opposite
    ignore_pantry = 'false' # if set, ignores basic pantry items such as flour, water, etc
    
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
    recipe_info_list = [getRecipeInfo(r['id']) for r in response_recipes]
    
    
    final_res=[]
    for initial_res, more_info in zip(response_recipes, recipe_info_list):
        final_res.append({
            'initialInfo': initial_res,
            'moreInfo':more_info
        })
    
    return json.dumps(final_res)

@app.route('/translateText', methods=['GET'])
def translateText():
    text = request.args.get('text')
    target_lang = request.args.get('targetLanguage')    
    
    translate_client = translate.Client()
    
    # Translate the text
    result = translate_client.translate(text, target_language=target_lang)
    
    return json.dumps({"translatedText" : result['translatedText']})


@app.route('/addFav', methods=['POST'])
def addFav():
    user_id = request.json.get('userId')
    recipe_id = request.json.get('recipeId')

    user = recipe_favs.find_one({'_id': user_id})

    if user:
        result = recipe_favs.update_one(
            {'_id': user_id},
            {'$addToSet': {'favorites': recipe_id}}
        )
    else:
        result = recipe_favs.insert_one({
            '_id': user_id,
            'favorites': [recipe_id]
        })
    return jsonify({"message": "Favorite added", "id": str(recipe_id)}), 201

@app.route('/getFavs', methods=['GET'])
def get_favorites():
    user_id = request.args.get('userId')
    favorites = list(recipe_favs.find({"_id": user_id}))
    
    return jsonify(favorites)

@app.route('/removeFav', methods=['DELETE'])
def removeFav():
    user_id = request.json.get('userId')
    recipe_id = request.json.get('recipeId')

    result = recipe_favs.update_one(
            {'_id': user_id},
            {'$pull': {'favorites': recipe_id}}
        )
    
    return jsonify({"message": "Favorite removed", "id": str(recipe_id)}), 201
if __name__ == "__main__":
    app.run(debug=True)