import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useNavigate } from "react-router-dom";
import { getFavorites } from "../services/favorites";

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const favs = getFavorites();
        setFavorites(favs);
        setLoading(false);
    }, []);

    // Refresh favorites when coming back to this page
    useEffect(() => {
        const handleStorageChange = () => {
            setFavorites(getFavorites());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h1>❤️ My Favorites ({favorites.length})</h1>
                <button onClick={() => navigate(-1)} style={{ padding: "8px 16px" }}>
                    ← Back
                </button>
            </div>

            {favorites.length === 0 ? (
                <div style={{ 
                    textAlign: "center", 
                    padding: 60, 
                    color: "#888",
                    fontSize: "1.2rem"
                }}>
                    <p>You don't have any favorite movies yet.</p>
                    <p>Go back and click the ❤️ on movies you like!</p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: 20,
                        justifyItems: "center",
                    }}
                >
                    {/* LOADING */}
                    {loading
                    ? Array.from({ length: 20 }).map((_, index) => (
                        <SkeletonCard key={index} />
                        ))
                    : favorites.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;