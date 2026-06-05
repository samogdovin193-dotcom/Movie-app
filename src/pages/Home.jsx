import { useEffect, useState } from "react";
import { getTrendingMovies, searchMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedGenre, setSelectedGenre] = useState("all");

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

  const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    27: "Horror",
    9648: "Mystery",
    878: "Sci-Fi",
    53: "Thriller",
  };
  
  const filteredMovies = movies.filter((movie) => {
    if (selectedGenre === "all") return true;

    return movie.genre_ids?.includes(Number(selectedGenre));
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.vote_average - a.vote_average;

      case "release":
        return new Date(b.release_date) - new Date(a.release_date);

      case "title":
        return a.title.localeCompare(b.title);

      case "popularity":
      default:
        return b.popularity - a.popularity;
    }
  });

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
        ❤️ Favorites ({favorites.length})
      </button>

      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          marginTop: 15,
          marginLeft: 10,
          padding: "8px",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            loadMovies(query);
          }
        }}
        placeholder="Search movies..."
      />

      <button onClick={() => loadMovies(query)} 
        style={{
          marginLeft: 10,
          padding: "8px",
        }}>
        Search
      </button>

      {/* SORT */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{
          marginLeft: 10,
          padding: "8px",
        }}
      >
        <option value="popularity">Popularity</option>
        <option value="rating">Rating</option>
        <option value="release">Release Date</option>
        <option value="title">Title A-Z</option>
      </select>

      {/* FILTER */}
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        style={{
            marginLeft: 10,
            padding: "8px",
        }}
      >
        <option value="all">All Genres</option>

        {Object.entries(genres).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>

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
          : sortedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Home;