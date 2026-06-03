import { useNavigate } from "react-router-dom";
import { getFavorites, saveFavorites } from "../services/favorites";
import { useState, useEffect } from "react";

function MovieCard({ movie }) {
    const navigate = useNavigate();
    const [isFav, setIsFav] = useState(false);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const favs = getFavorites();
        setIsFav(favs.some((m) => m.id === movie.id));
    }, [movie.id]);

    const releaseYear = movie.release_date
        ? movie.release_date.split("-")[0]
        : "N/A";

    function getRatingColor(rating) {
        if (!rating || rating === 0) return "gray";
        if (rating >= 7) return "green";
        if (rating >= 5) return "orange";
        return "red";
    }

    function toggleFavorite(e) {
    e.stopPropagation(); // blok navigate

    let favs = getFavorites();

    if (favs.some((m) => m.id === movie.id)) {
        favs = favs.filter((m) => m.id !== movie.id);
        setIsFav(false);
    } else {
        favs.push(movie);
        setIsFav(true);
    }

        saveFavorites(favs);
    }

    return (
    <div
        onClick={() => navigate(`/movie/${movie.id}`)}
        style={{
            position: "relative",
            width: 180,
            border: "1px solid #ddd",
            borderRadius: 12,
            marginTop: 20,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            cursor: "pointer"
        }}

        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
        }}

        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        }}
    >
        <div style={{ position: "relative" }}>
            <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{ 
                    width: "100%",
                    height: 270,
                    objectFit: "cover",
                }}
            />
            {/* ❤️ BUTTON */}
            <div
                onClick={toggleFavorite}
                style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    fontSize: 22,
                    cursor: "pointer",
                    zIndex: 2,
                    color: isFav ? "red" : "white",
                    opacity: isFav ? 1 : 0.6,
                    transition: "opacity 0.2s, transform 0.2s",
                    transform: hover ? "scale(1.15)" : "scale(1)",
                    textShadow: "0 0 6px rgba(0,0,0,0.9)"
                }}
            >
                {isFav ? "❤️" : "🤍"}
            </div>
        </div>
        <div style={{ padding: 10 }}>
            <p style={{ fontSize: 16, color: "black", marginBottom: 8, fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{movie.title}</p>
            <p style={{ 
                    color: "white",
                    backgroundColor: getRatingColor(movie.vote_average),
                    display: "inline-block",
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: "bold",
                }}
            >
                ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </p>
            <p style={{ color: "black" }}>📅 {releaseYear}</p>
        </div>
    </div>
  );
}

export default MovieCard;