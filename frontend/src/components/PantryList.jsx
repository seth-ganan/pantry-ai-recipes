export default function PantryList({ items }) {
  if (!items.length) return <p>No pantry items yet.</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item._id}>
          {item.name} — {item.amount}
        </li>
      ))}
    </ul>
  );
}
