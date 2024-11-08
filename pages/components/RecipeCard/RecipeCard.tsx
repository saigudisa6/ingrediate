import { colors } from "@/pages/generateRecipes";
import { StaticImageData } from "next/image";
import Image  from "next/image";
import { Recipe } from "@/pages/generateRecipes";
import 'tailwindcss/tailwind.css';

interface RecipeCardProps {
    recipe: Recipe,
    index: number,
    onViewRecipe(recipe: Recipe): void,
    toggleFavorite(index: string): void,
    isFavorite: boolean,
}

export default function RecipeCard({ recipe, index, onViewRecipe, toggleFavorite, isFavorite }: RecipeCardProps) {

    function cleanHTML(currHtml: string){
        return currHtml.split('.')[0]+'!';
    }

    if(!recipe){
        return (<div>No Recipes</div>)
    }

    return (
        <div
            className="p-4 rounded-lg shadow-lg bg-gray-100 relative h-full flex flex-col justify-between"
            style={{
            backgroundColor: colors.buttonBg,
            padding: '1.5rem',
            borderRadius: '8px',
            overflow: 'hidden',
            minHeight: '450px',
            }}
        >
            <Image src={recipe.image} alt={recipe.title} width={100} height={32} className="w-auto rounded-lg mb-4 object-cover" />
            <h3
            className="text-2xl font-serif mb-2 rounded-lg px-4 py-2"
            style={{ color: 'Black', backgroundColor: colors.buttonLight }}
            >
            {recipe.title}
            </h3>

            <p className="text-md font-serif mb-4" style={{ color: '#FFE8D6' }} dangerouslySetInnerHTML={{ __html: cleanHTML(recipe.description) }}></p>
            <div className="flex justify-between space-x-4 mt-4">
            <button 
                onClick={() => onViewRecipe(recipe)} 
                className="py-2 px-4 rounded-lg text-lg font-serif transition-all hover:shadow-md flex-grow" 
                style={{ backgroundColor: colors.buttonLight }}
            >
                View Recipe
            </button>

            <button 
                onClick={() => toggleFavorite(recipe.id)} 
                className="py-2 px-0.001 rounded-lg text-lg font-serif transition-all hover:shadow-md flex-grow" 
                style={{ color: isFavorite ? 'black' : 'black', backgroundColor: colors.buttonLight }}
            >
                {isFavorite ? '★' : '☆'}
            </button>
            </div>

        </div>
    )
}