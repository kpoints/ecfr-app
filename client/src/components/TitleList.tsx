export default function TitleList({ titles }) {
    if (titles.length === 0) {
      return <p className="text-gray-600">No titles found.</p>;
    }
  
    return (
      <ul className="grid grid-cols-2 gap-4">
        {titles.map(num => (
          <li
            key={num}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <a
              className="text-blue-600 hover:underline"
              href={`/api/titles/${num}`}
            >
              Title {num}
            </a>
          </li>
        ))}
      </ul>
    );
  }