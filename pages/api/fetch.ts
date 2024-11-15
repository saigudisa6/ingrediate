// pages/api/fetch-data.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export async function getRecipesHandler(ingredients: string) {
    return fetch(`/api/flask/recipes?ingredients=${ingredients}`)
                .then((response) => response.json())
                .then((data) => {
                    return data
                });
}

export async function getTranslationHandler(htmlText: string, targetLang: string){
    return fetch(`http://localhost:5000/translateText?text=${htmlText}&targetLanguage=${targetLang}`)
                .then((response) => response.json())
                .then((data) => {
                    return data
                }); 
}

export async function getFavorites(userId: string | undefined){
    return fetch(`http://localhost:5000/getFavs?userId=${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    return data
                }); 
}

export async function addFavorite(userId: string | undefined, recipeId: string){
    return fetch('http://localhost:5000/addFav', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, recipeId }),
      });
}

export async function removeFavorite(userId: string | undefined, recipeId: string){
    return fetch('http://localhost:5000/removeFav', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, recipeId }),
      });
}

export async function getRecipeById(recipeId: string | undefined){
    return fetch(`http://localhost:5000/getRecipeById?recipeId=${recipeId}`)
                .then((response) => response.json())
                .then((data) => {
                    return data
                }); 
}

