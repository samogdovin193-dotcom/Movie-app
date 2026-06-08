import { useEffect, useState } from "react";
import { searchMovies, discoverMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import "./Home.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // LOADING MOVIES
  async function loadMovies() {
    setLoading(true);

    let data;

    if (urlQuery) {
      data = await searchMovies(urlQuery, page);
      data.results = sortResults(data.results, sortBy);
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

  // SORT MAP
  const sortMap = {
    popularity: "popularity.desc",
    rating: "vote_average.desc",
    release: "release_date.desc",
    title: "original_title.asc",
  };

  // SORTING
  function sortResults(list, sortBy) {
    const sorted = [...list];

    switch (sortBy) {
      case "rating":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);

      case "release":
        return sorted.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );

      case "title":
        return sorted.sort((a, b) =>
          a.title.localeCompare(b.title)
        );

      case "popularity":
      default:
        return sorted.sort((a, b) => b.popularity - a.popularity);
    }
  }

  // GENRE MAPPING
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
    <div className="home-container">

      <h1>
        {urlQuery
          ? `Search results for "${urlQuery}"`
          : "🎬 Trending Movies"}
      </h1>

      {/* FAVORITES BUTTON */}
      <button 
        onClick={() => navigate("/favorites")}
        className="favorites-button"
      >
        ❤️ Favorites ({favorites.length})
      </button>

      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        onKeyDown={(e) => {
          if (e.key === "Enter") 
            handleSearch();
        }}
        placeholder="Search movies..."
      />

      <button 
        onClick={handleSearch} 
        className="button_and_select"
      >
        Search
      </button>

      {/* SORT */}
      <select
        value={sortBy}
        onChange={handleSortChange}
        className="button_and_select"
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
        className="button_and_select"
      >
        <option value="all">All Genres</option>

        {Object.entries(genres).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>

      <div className="movies-grid">
        {/* LOADING */}
        {loading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {/* PAGING */}
      <div className="pagination"> 
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