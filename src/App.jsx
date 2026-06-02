import { useEffect, useState } from "react";
import { getTrendingMovies } from "./services/tmdb";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      const data = await getTrendingMovies();
      setMovies(data.results);
      setLoading(false);
    }

    loadMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>🎬 Trending Movies</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              width: 150,
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 10,
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%" }}
            />

            <p style={{ fontSize: 12 }}>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;