import { useEffect, useState } from "react";
import { searchMovies, discoverMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [searchTerm, setSearchTerm] = useState("");
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const [totalPages, setTotalPages] = useState(1);
  
  const sortBy = searchParams.get("sort") || "popularity";
  const selectedGenre = searchParams.get("genre") || "all";
  const urlQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    loadMovies();
  }, [urlQuery, selectedGenre, sortBy, page]);

  async function loadMovies() {
  setLoading(true);

  let data;

  if (urlQuery) {
    data = await searchMovies(urlQuery, page);
  } else {
    data = await discoverMovies({
      genreId: selectedGenre,
      sortBy: sortMap[sortBy],
      page,
    });
  }

  setMovies(data.results || []);
  setTotalPages(data.total_pages || 1);

  setLoading(false);
}

const sortMap = {
  popularity: "popularity.desc",
  rating: "vote_average.desc",
  release: "release_date.desc",
  title: "original_title.asc",
};

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

  // SEARCH
  const handleSearch = () => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);

      if (query.trim()) {
        params.set("q", query);
        params.set("genre", "all");
      } else {
        params.delete("q");
      }

      params.set("page", 1);

      return params;
    });
  };

  // 🎭 GENRE
  const handleGenreChange = (e) => {
    const genre = e.target.value;

    setSearchParams(prev => {
      const params = new URLSearchParams(prev);

      params.set("genre", genre);
      params.set("page", 1);
      params.delete("q");

      return params;
    });
  };

  // 📊 SORT
  const handleSortChange = (e) => {
    const sort = e.target.value;

    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set("sort", sort);
      params.set("page", 1);
      return params;
    });
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>
        {urlQuery
          ? `Search results for "${urlQuery}"`
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
          if (e.key === "Enter") 
            handleSearch();
        }}
        placeholder="Search movies..."
      />

      <button onClick={handleSearch} 
        style={{
          marginLeft: 10,
          padding: "8px",
        }}>
        Search
      </button>

      {/* SORT */}
      <select
        value={sortBy}
        onChange={handleSortChange}
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
        onChange={handleGenreChange}
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
          : movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div 
        style={{ 
          marginTop: 20, 
          display: "flex", 
          gap: 10 
          }}
      > 
        <button
          disabled={page <= 1 || loading}
          onClick={() => {
            setSearchParams(prev => {
              const params = new URLSearchParams(prev);
              params.set("page", page - 1);
              return params;
            });
          }}
        >
          ⬅ Prev
        </button>

        <span>Page {page}</span>

        <button
          disabled={page >= totalPages || loading}
          onClick={() => {
            setSearchParams(prev => {
              const params = new URLSearchParams(prev);
              params.set("page", page + 1);
              return params;
            });
          }}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default Home;