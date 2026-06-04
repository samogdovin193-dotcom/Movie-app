import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useFavorites } from "../context/FavoritesContext";

function Favorites() {
    const { favorites } = useFavorites();
    const navigate = useNavigate();

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                <h1>❤️ My Favorites ({favorites.length})</h1>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ padding: "8px 18px", fontSize: "1rem" }}
                >
                    ← Back
                </button>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 20,
                    justifyItems: "center",
                }}
            >
                {favorites.length === 0 ? (
                    <div style={{ 
                        gridColumn: "1 / -1",
                        textAlign: "center", 
                        padding: 100, 
                        color: "#888",
                        fontSize: "1.3rem"
                    }}>
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