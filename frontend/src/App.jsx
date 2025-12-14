import { useEffect, useState } from "react";
import PantryForm from "./components/PantryForm";
import PantryList from "./components/PantryList";

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
        body: JSON.stringify(item)
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
      const names = await res.json();
      setRecipeNames(names);
    } catch (err) {
      console.error("Failed to fetch recipe names:", err);
    }
  };

  const readRecipe = async (name) => {
    try {
      const res = await fetch(`${API_BASE}/api/recipes/generate-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeName: name })
      });
      const recipe = await res.json();
      setCurrentRecipe(recipe);

      setSavedRecipes((prev) => [...prev, recipe]);
    } catch (err) {
      console.error("Failed to fetch recipe details:", err);
    }
  };

  useEffect(() => {
    fetchPantry();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>My Pantry</h1>
      <PantryForm onAdd={addItem} />
      <PantryList items={pantry} onDelete={deleteItem} />

      <hr style={{ margin: "20px 0" }} />

      <button onClick={findRecipes} style={{ padding: "10px 20px" }}>
        Find Recipes
      </button>

      {recipeNames.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Generated Recipes</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {recipeNames.map((name, idx) => (
              <button
                key={idx}
                onClick={() => readRecipe(name)}
                style={{ padding: "5px 10px" }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentRecipe && (
        <div style={{ marginTop: "20px" }}>
          <h2>{currentRecipe.name}</h2>
          <h3>Ingredients:</h3>
          <ul>
            {currentRecipe.ingredients.map((ing, idx) => (
              <li key={idx}>
                {ing.name} - {ing.amount}
              </li>
            ))}
          </ul>
          <h3>Steps:</h3>
          <ol>
            {currentRecipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {savedRecipes.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Saved Recipes</h2>
          <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
            {savedRecipes.map((r, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <strong>{r.name}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
