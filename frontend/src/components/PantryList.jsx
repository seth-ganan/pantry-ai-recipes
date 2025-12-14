export default function PantryList({ items, onDelete }) {
  if (!items || items.length === 0) return <p>No pantry items yet.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item) => (
        <li
          key={item._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
            padding: "5px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <span>
            {item.name} - {item.amount}
          </span>
          <button
            onClick={() => onDelete(item._id)}
            style={{ padding: "2px 5px" }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
