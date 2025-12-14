import { useState } from "react";

export default function PantryForm({ onAdd }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    onAdd({ name, amount });
    setName("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Ingredient"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Amount (e.g. 2 cans)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
