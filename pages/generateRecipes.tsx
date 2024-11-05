import React, { useState } from 'react';
import logoImage from '../public/img/accountLogo.png';
import avocadoImage from '../public/img/avocadoToast.jpg';
import pastaImage from '../public/img/gbChicken.jpg';
import smoothieImage from '../public/img/bsb.jpg';
import quinoaSaladImage from '../public/img/qs.jpg';
import honeyGarlicChickenImage from '../public/img/hgc.jpg';
import blackBeanTacosImage from '../public/img/bbtacos.jpg';
import bananaBreadImage from '../public/img/bbread.jpg';
import shrimpSkilletImage from '../public/img/ss.jpg';
import Image from 'next/image';
import 'tailwindcss/tailwind.css';
import styles from './styles/Generate.module.css';
import { StaticImageData } from "next/image";
import { getRecipesHandler, getTranslationHandler } from './api/fetch';

import bannerPNG from './kitchenBanner.png';
import Blobs from './components/Blobs/Blobs';
import RecipeCard from './components/RecipeCard/RecipeCard';
import DOMPurify from 'dompurify';



export const colors = {
  background: '#DDBEA9',
  buttonBg: '#6B705C',
  buttonLight: '#D3D3C7',
};

export interface Recipe{
    title: string;
    description: string;
    image: string;
    instructions: string;
    missingIngredients: string;
    ingredientsUsed: string;
}

const languages = ['English', 'Spanish', 'French', 'Italian'];
const langMap: { [key: string]: string } = {};

langMap[languages[0]] =  'en';
langMap[languages[1]] =  'es';
langMap[languages[2]] =  'fr';
langMap[languages[3]] =  'it';


const GenerateRecipesPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState<string>('');
  const [showRecipes, setShowRecipes] = useState<boolean>(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState<boolean>(false);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null);
  const [favorites, setFavorites] = useState<boolean[]>([false]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [clicked, setClicked] = useState(false);
  const [isLogoActive, setIsLogoActive] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([])

  const handleSubmit = async () => {
    setClicked(true);
    let res = await getRecipesHandler(ingredients.join(','))
    
    let new_recipes = res.map((curr_recipe: any, idx: number) => { // TODO: need to fix the any
        if(!curr_recipe.initialInfo || !curr_recipe.moreInfo) return {}
        return {
            title:curr_recipe.initialInfo.recipeName,
            description: curr_recipe.moreInfo.summary,
            instructions: curr_recipe.moreInfo.instructions,
            image: curr_recipe.initialInfo.image,
            missingIngredients: curr_recipe.initialInfo.missingIngredients.map((curr: {id: number, name: string}) => {return curr.name}).join(','),
            ingredientsUsed: curr_recipe.initialInfo.presentIngredients.map((curr: {id: number, name: string}) => {return curr.name}).join(','),
          }
    })
    console.log(new_recipes)
    setRecipes(new_recipes);
    handleGenerateRecipes(); // Call your original function here
  };

  const handleLogoClick = () => {
    setIsLogoActive((prev) => !prev);
    
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
      setShowRecipes(false);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
    setShowRecipes(false);
  };

  const handleGenerateRecipes = () => {
    if (ingredients.length > 0) {
      setShowRecipes(true);
      setHasGeneratedOnce(true);
    }
  };

  const handleNextRecipe = () => {
    setCurrentRecipeIndex((currentRecipeIndex + 1) % (recipes.length-1));
  };

  const handlePrevRecipe = () => {
    setCurrentRecipeIndex((currentRecipeIndex - 1 + recipes.length) % recipes.length);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  const toggleFavorite = (index: number) => {
    const newFavorites = [...favorites];
    newFavorites[index] = !newFavorites[index];
    setFavorites(newFavorites);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  async function translateRecipes(language: string) {
    let new_recipes: Recipe[] = await Promise.all(recipes.map(async (curr_recipe: Recipe, idx: number) => {
        let langCode = langMap[language];
        let translatedTitle: string = (await getTranslationHandler(curr_recipe.title, langCode)).translatedText;
        let translatedDescription: string = (await getTranslationHandler(curr_recipe.description, langCode)).translatedText;
        let translatedInstructions: string = (await getTranslationHandler(curr_recipe.instructions, langCode)).translatedText;
        let translatedMissingIngredients: string = (await getTranslationHandler(curr_recipe.missingIngredients, langCode)).translatedText
        let translatedPresentIngredients: string = (await getTranslationHandler(curr_recipe.ingredientsUsed, langCode)).translatedText
        return {
            title: translatedTitle,
            description: translatedDescription,
            instructions: translatedInstructions,
            image: curr_recipe.image,
            missingIngredients: translatedMissingIngredients,
            ingredientsUsed: translatedPresentIngredients
        };
    }));

    console.log(new_recipes);
    setRecipes(new_recipes)
}

  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
    // setShowRecipes(false);
  
    translateRecipes(language);
  
    setIsDropdownOpen(false);
  };

  const getMessage = () => {
    if (hasGeneratedOnce) {
      return ingredients.length === 0 ? 
        "Add Ingredients!" : 
        "Click Generate!";
    }
    return "Generate Again!";
  };

  return (
    <div
    className="h-screen w-screen flex flex-col items-center"
    style={{
      backgroundColor: colors.background,
      height: '100vh',
      overflowY: 'auto',
      }}
    >
    <div className="p-10 h-screen w-screen flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <div>
          <h1 className="text-6xl font-serif" style={{ color: '#1A1A1A' }}>Ingrediate</h1>
          <p className="text-xl font-serif" style={{ color: '#1A1A1A', marginTop: '0.5rem' }}>
            Turning Nothing, Into Something.
          </p>
        </div>
        <a href='api/auth/logout'>
          <button
            onClick={handleLogoClick}
            className={`p-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition-transform duration-200 ${
              isLogoActive ? 'ring-[#B7B7A4]' : 'ring-transparent'
            } hover:scale-110`}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          >
            <Image src={logoImage} alt="Logo" className="w-16 h-16" />
          </button>
        </a>
        
      </div>


      <div className="flex flex-col lg:flex-row w-full lg:justify-between items-start" 
      style={{ height: '50%' }}>
        <div className="flex flex-col p-6 rounded-lg shadow-lg max-w-full lg:max-w-2/5" style={{ backgroundColor: colors.buttonBg }}>
        <h2
          className="text-2xl font-serif mb-4 text-center rounded-lg px-4 py-2"
          style={{ color: 'black', backgroundColor: '#B7B7A4'}}
        >
          Digital Pantry
        </h2>

          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Add an ingredient"
              className="flex-1 p-2 rounded-lg border border-gray-400"
              style={{color: 'black', backgroundColor: "#FFE8D8", }}
            />
            <button onClick={handleAddIngredient} className="px-4 py-2 rounded-lg font-serif transition-all hover:scale-110 hover:shadow-md" style={{ backgroundColor: '#B7B7A4' }}>
              Add
            </button>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="grid grid-cols-3 gap-2 overflow-y-auto mb-4" style={{ maxHeight: '300px' }}>
              {ingredients.map((ingredient, index) => (
                <button
                  key={index}
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="py-2 px-4 rounded-full font-serif transition-all hover:shadow-md text-sm max-w-[15ch] truncate whitespace-normal text-center"
                  style={{color: 'black', backgroundColor: '#FFE8D6' }}
                  title={ingredient}
                >
                  {ingredient} ✕
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className={`py-3 rounded-lg text-lg font-serif transition-all hover:scale-110 hover:shadow-md`}
              style={{
                backgroundColor: (clicked && showRecipes) ? 'black' : '#B7B7A4',
                color: (clicked && showRecipes) ? 'white' : 'inherit',
              }}
            >
      Generate Recipes
    </button>

            <div className="relative w-full max-w mt-4">
              <button onClick={toggleDropdown} className="w-full flex justify-between items-center p-2 rounded-lg font-serif hover:scale-110 hover:shadow-md" style={{ backgroundColor: '#B7B7A4' }}>
                <span>{selectedLanguage}</span>
                <span>{isDropdownOpen ? '▲' : '▼'}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute w-full mt-1 rounded-lg shadow-lg z-10" style={{ backgroundColor: colors.buttonLight }}>
                  {languages
                    .filter(language => language !== selectedLanguage)
                    .map((language, index) => (
                      <button
                        key={index}
                        onClick={() => selectLanguage(language)}
                        className="w-full p-2 text-left font-serif hover:bg-gray-300"
                        style={{
                          backgroundColor: colors.buttonLight,
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        {language}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showRecipes ? (
          <div className="flex-grow flex justify-center items-center w-full lg:w-3/5 overflow-hidden relative" style={{ marginLeft: '1rem' }}>
            <button onClick={handlePrevRecipe} className="absolute left-[-0.01rem] p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-all z-10" 
             style={{
                backgroundColor: '#FFE8D6'
              }}>
              ◀
            </button>

            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(currentRecipeIndex - 1) * 33.33}%)`,
                width: '300%',
              }}
            >
              {recipes.map((recipe, index) => (
                <div key={index} className={`w-[28%] flex-shrink-0 px-4 transition-all duration-500 ${index === currentRecipeIndex ? 'scale-105' : 'scale-95'} ${index === currentRecipeIndex ? 'z-20' : 'z-10'}`}>
                  <RecipeCard recipe={recipe} index={index} onViewRecipe={handleViewRecipe} toggleFavorite={toggleFavorite} isFavorite={favorites[index]}/>
                </div>
              ))}
            </div>

            <button onClick={handleNextRecipe} className="absolute right-[-0.01rem] p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-all z-10"
            style={{
              backgroundColor: '#FFE8D6'
            }}>
              ▶
            </button>
          </div>
        ) : (
            <Blobs hasGeneratedOnce={hasGeneratedOnce} ingredientsLen={ingredients.length}/>
        )}
        
      </div>

      {showModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="p-8 bg-gray-100 rounded-lg shadow-lg max-w-lg w-full relative" style={{ backgroundColor: colors.buttonBg }}>
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-xl">✕</button>
            <Image src={selectedRecipe.image} alt={selectedRecipe.title} width={100} height={32} className="rounded-lg mb-4 w-full h-48 object-cover" />
            <h2 className="text-2xl font-serif mb-2 rounded-lg px-4 py-2" style={{ color: 'Black', backgroundColor: colors.buttonLight }}>Recipe For {selectedRecipe.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedRecipe.instructions)}}/>
            <div><b>USES:</b> {selectedRecipe.ingredientsUsed}</div>
            <div><b>MISSING:</b> {selectedRecipe.missingIngredients}</div>
          </div>
        </div>
      )}
    </div>

    <div className="w-full mt-auto">
      <Image src={bannerPNG} alt="Banner" className="w-full h-auto" style={{ objectFit: 'cover' }} />
    </div>
  </div>
  );
};

export default GenerateRecipesPage;
