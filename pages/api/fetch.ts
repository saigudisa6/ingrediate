// pages/api/fetch-data.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export async function getRecipesHandler(ingredients: string) {
    return fetch(`http://localhost:5000/recipes?ingredients=${ingredients}`)
                .then((response) => response.json())
                .then((data) => {
                    return data
                });
}

