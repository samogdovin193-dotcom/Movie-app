import { useEffect, useState } from "react";
import { getTrendingMovies } from "./services/tmdb";
import MovieCard from "./components/MovieCard";

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
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </div>
  );
}

export default App;