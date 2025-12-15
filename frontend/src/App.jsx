import React, { useEffect, useState } from "react";
import PantryForm from "./components/PantryForm";
import PantryList from "./components/PantryList";
import RecipeList from "./components/RecipeList";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [pantry, setPantry] = useState([]);
  const [recipeNames, setRecipeNames] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const fetchPantry = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pantry`);
      const data = await res.json();
      setPantry(data);
    } catch (err) {
      console.error("Failed to fetch pantry items:", err);
    }
  };

  const addItem = async (item) => {
    try {
      await fetch(`${API_BASE}/api/pantry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      fetchPantry();
    } catch (err) {
      console.error("Failed to add pantry item:", err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`${API_BASE}/api/pantry/${id}`, { method: "DELETE" });
      fetchPantry();
    } catch (err) {
      console.error("Failed to delete pantry item:", err);
    }
  };

  const findRecipes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/recipes/generate-names`);
      const data = await res.json();
      console.log("Fetched recipe names:", data);
      setRecipeNames(data);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    }
  };

  const readRecipe = async (name) => {
    try {
      const res = await fetch(`${API_BASE}/api/recipes/generate-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeName: name }),
      });
      const data = await res.json();
      setCurrentRecipe(data);
    } catch (err) {
      console.error("Failed to fetch recipe details:", err);
    }
  };
  const saveRecipe = async (recipeId) => {
  try {
    const res = await fetch(`${API_BASE}/api/recipes/save/${recipeId}`, {
      method: 'POST',
    });
    const updatedRecipe = await res.json();

    // Update frontend savedRecipes
    setSavedRecipes((prev) => {
      // Avoid duplicates
      if (prev.find(r => r._id === updatedRecipe._id)) return prev;
      return [updatedRecipe, ...prev];
    });
  } catch (err) {
    console.error('Failed to save recipe:', err);
  }
};

const fetchSavedRecipes = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/recipes/saved`);
    const data = await res.json();
    setSavedRecipes(data);
  } catch (err) {
    console.error('Failed to fetch saved recipes:', err);
  }
};

useEffect(() => {
  fetchPantry();
  fetchSavedRecipes();
}, []);


  

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Pantry</h1>
      <PantryForm onAdd={addItem} />
      <PantryList items={pantry} onDelete={deleteItem} />

      <hr style={{ margin: "20px 0" }} />

      <button onClick={findRecipes} style={{ marginBottom: "10px" }}>
        Find Recipes
      </button>

      <RecipeList
        recipeNames={recipeNames}
        readRecipe={readRecipe}
        currentRecipe={currentRecipe}
        saveRecipe={saveRecipe} 
        savedRecipes={savedRecipes} 
      />
    </div>
  );
}
