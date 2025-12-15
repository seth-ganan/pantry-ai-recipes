export default function RecipeList({
  recipeNames = [],
  readRecipe,
  currentRecipe,
  saveRecipe,
  savedRecipes = [],
}) {
  return (
    <div>
      {/* Generated Recipes */}
      {recipeNames.length > 0 && <h2>Generated Recipes</h2>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Array.isArray(recipeNames) &&
          recipeNames.map((name, idx) => (
            <li key={idx} style={{ marginBottom: "5px" }}>
              <button
                onClick={() => readRecipe(name)}
                style={{ padding: "5px 10px" }}
              >
                {name}
              </button>
            </li>
          ))}
      </ul>

      {/* Current Recipe */}
      {currentRecipe && (
        <div style={{ marginTop: "20px" }}>
          <h3>{currentRecipe.name}</h3>

          <p><strong>Ingredients:</strong></p>
          <ul>
            {Array.isArray(currentRecipe.ingredients) &&
              currentRecipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
          </ul>

          <p><strong>Steps:</strong></p>
          <ol>
            {Array.isArray(currentRecipe.steps) &&
              currentRecipe.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
          </ol>

          <button
            onClick={() => saveRecipe(currentRecipe._id)}
            style={{ marginTop: "10px", padding: "5px 10px" }}
          >
            Save Recipe
          </button>
        </div>
      )}

      {/* Saved Recipes */}
      {savedRecipes.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Saved Recipes</h2>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            {Array.isArray(savedRecipes) &&
              savedRecipes.map((recipe, idx) => (
                <div key={idx} style={{ marginBottom: "15px" }}>
                  <h4>{recipe.name}</h4>
                  <ul>
                    {Array.isArray(recipe.ingredients) &&
                      recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                  </ul>
                  <ol>
                    {Array.isArray(recipe.steps) &&
                      recipe.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                  </ol>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
