import { useEffect, useState } from "react";
import PantryForm from "./components/PantryForm";
import PantryList from "./components/PantryList";

// Get backend URL from Netlify environment variable
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [pantry, setPantry] = useState([]);

  // Fetch all pantry items
  const fetchPantry = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pantry`);
      const data = await res.json();
      setPantry(data);
    } catch (err) {
      console.error("Failed to fetch pantry items:", err);
    }
  };

  // Add new pantry item
  const addItem = async (item) => {
    try {
      await fetch(`${API_BASE}/api/pantry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      fetchPantry(); // Refresh list
    } catch (err) {
      console.error("Failed to add pantry item:", err);
    }
  };

  useEffect(() => {
    fetchPantry();
  }, []);

  return (
    <div>
      <h1>My Pantry</h1>
      <PantryForm onAdd={addItem} />
      <PantryList items={pantry} />
    </div>
  );
}
