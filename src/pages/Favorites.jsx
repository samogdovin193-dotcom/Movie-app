import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useFavorites } from "../context/FavoritesContext";
import "./Favorites.css";

function Favorites() {
    const { favorites } = useFavorites();
    const navigate = useNavigate();

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <h1>❤️ My Favorites ({favorites.length})</h1>
                <button 
                    onClick={() => navigate(-1)} 
                    className="favorites-back-button"
                >
                    ← Back
                </button>
            </div>

            <div className="favorites-grid">
                {favorites.length === 0 ? (
                    <div className="favorites-empty">
                        <p>You don't have any favorite movies yet.</p>
                        <p>Go back and click the ❤️ on movies you like!</p>
                    </div>
                ) : (
                    favorites.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Favorites;