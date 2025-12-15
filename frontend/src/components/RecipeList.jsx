export default function RecipeList({
  recipeNames,
  readRecipe,
  currentRecipe,
  saveRecipe,
  savedRecipes,
}) {
  return (
    <div>
      {/* Generated Recipes */}
      {recipeNames.length > 0 && <h2>Generated Recipes</h2>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recipeNames.map((name, idx) => (
          <li key={idx} style={{ marginBottom: "5px" }}>
            <button onClick={() => readRecipe({ name })}>{name}</button>
          </li>
        ))}
      </ul>

      {/* Current Selected Recipe */}
      {currentRecipe && (
        <div style={{ marginTop: "20px" }}>
          <h3>{currentRecipe.name}</h3>
          {currentRecipe.ingredients?.length > 0 && (
            <>
              <p><strong>Ingredients:</strong></p>
              <ul>
                {currentRecipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </>
          )}
          {currentRecipe.steps?.length > 0 && (
            <>
              <p><strong>Steps:</strong></p>
              <ol>
                {currentRecipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </>
          )}
          <button onClick={() => saveRecipe(currentRecipe._id)} style={{ marginTop: "10px" }}>
            Save Recipe
          </button>
        </div>
      )}

      {/* Saved Recipes */}
      {savedRecipes.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Saved Recipes</h2>
          <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
            {savedRecipes.map((recipe, idx) => (
              <div key={idx} style={{ marginBottom: "15px" }}>
                <button onClick={() => readRecipe(recipe)} style={{ fontWeight: "bold" }}>
                  {recipe.name}
                </button>
                {recipe.ingredients?.length > 0 && (
                  <>
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                      {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                    </ul>
                  </>
                )}
                {recipe.steps?.length > 0 && (
                  <>
                    <p><strong>Steps:</strong></p>
                    <ol>
                      {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
