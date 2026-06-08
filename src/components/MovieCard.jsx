import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import "./MovieCard.css";

function MovieCard({ movie }) {
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite } = useFavorites();

    const isFav = isFavorite(movie.id);
    const releaseYear = movie.release_date
        ? movie.release_date.split("-")[0]
        : "N/A";

    function getRatingColor(rating) {
        if (!rating || rating === 0) return "gray";
        if (rating >= 7) return "green";
        if (rating >= 5) return "orange";
        return "red";
    }

    const handleToggleFavorite = (e) => {
        e.stopPropagation(); // blok navigate
        toggleFavorite(movie);
    };

    return (
    <div
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="movie-card"
    >
        <div className="movie-card-image-wrapper">
            <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="movie-card-image"
            />
            {/* ❤️ BUTTON */}
            <div
                onClick={handleToggleFavorite}
                className={`favorite-button ${isFav ? "favorite" : "not-favorite"}`}
            >
                {isFav ? "❤️" : "🤍"}
            </div>
        </div>
        <div className="movie-card-content">
            <p className="movie-title">{movie.title}</p>
            <p 
                className="movie-rating"
                style={{ 
                    backgroundColor: getRatingColor(movie.vote_average),
                    display: "inline-block",
                }}
            >
                ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </p>
            <p className="movie-year">📅 {releaseYear}</p>
        </div>
    </div>
  );
}

export default MovieCard;