import { useEffect, useState } from "react";
import { getTrendingMovies, searchMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies(searchQuery = "") {
    setLoading(true);

    let data;

    if (searchQuery.trim()) {
      data = await searchMovies(searchQuery);
      setSearchTerm(searchQuery);
    } else {
      data = await getTrendingMovies();
      setSearchTerm("");
    }

    setMovies(data.results || []);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>
        {searchTerm
          ? `Search results for "${searchTerm}"`
          : "🎬 Trending Movies"}
      </h1>

      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            loadMovies(query);
          }
        }}
        placeholder="Search movies..."
      />

      <button onClick={() => loadMovies(query)}>
        Search
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 10,
          marginTop: 20,
          justifyItems: "center",
        }}
      >
        {/* LOADING */}
        {loading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
        ))}
        {/* MOVIE-CARDS */}
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

    </div>
  );
}

export default Home;