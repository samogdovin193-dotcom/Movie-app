import { useEffect, useState } from "react";
import { getTrendingMovies, searchMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useNavigate } from "react-router-dom";
import { getFavorites } from "../services/favorites";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

      {/* FAVORITES BUTTON */}
      <button 
        onClick={() => navigate("/favorites")}
        style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "10px 20px",
            fontSize: "1.1rem",
            backgroundColor: "#e63939",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        ❤️ Favorites ({getFavorites().length})
      </button>

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
      </div>
    </div>
  );
}

export default Home;