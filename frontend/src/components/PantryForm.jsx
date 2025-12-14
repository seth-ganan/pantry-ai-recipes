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
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Ingredient Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <input
        type="text"
        placeholder="Amount(ex: 2 cans)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button type="submit" style={{ padding: "5px 10px" }}>
        Add
      </button>
    </form>
  );
}
