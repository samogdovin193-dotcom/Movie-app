import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getMovieVideos, getMovieCredits, getSimilarMovies } from "../services/tmdb";
import "./MovieDetails.css";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoKey, setVideoKey] = useState(null);
    const [videoType, setVideoType] = useState(null);
    const [cast, setCast] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
    let isMounted = true;

    const fetchMovie = async () => {
        console.log("FETCH START - id:", id);

        setLoading(true);
        setError(null);

        try {
            const [movieData, videoData, creditsData, similarData] = await Promise.all([
                    getMovieDetails(id),
                    getMovieVideos(id),
                    getMovieCredits(id),
                    getSimilarMovies(id)
                ]);

            if (!isMounted) return;

            console.log("Data loaded successfully");

            setMovie(movieData);

            // VIDEOS
            const videos = videoData.results.filter(v => v.site === "YouTube");
            const trailer =
                videos.find(v => v.type === "Trailer") ||
                videos.find(v => v.type === "Teaser");

            setVideoKey(trailer?.key || null);
            setVideoType(trailer?.type || null);

            // CAST AND SIMILAR
            setCast(creditsData.cast.slice(0, 8));
            setSimilar((similarData.results || []).slice(0, 10));

        } catch (error) {
            console.error("MovieDetails error:", error);
            if (isMounted) {
                setError("Failed to load movie details");
                setMovie(null);
            }
        } finally {
            console.log("FINALLY - setting loading false");
            if (isMounted) {
                setLoading(false);
            }
        }
    }

    fetchMovie();

    return () => {
        isMounted = false;
    };
}, [id]);

    if (loading) {
        console.log("SHOWING LOADING SKELETON");
        return (
            <div>
                <div className="loading-container">

                    {/* Title */}
                    <div className="skeleton-box skeleton-title"/>

                    {/* Stats */}
                    <div className="skeleton-box skeleton-subtitle" />

                    {/* Overview lines */}
                    <div className="skeleton-box skeleton-line" style={{width: "55%",}} />
                    <div className="skeleton-box skeleton-line" style={{width: "52%",}} />
                    <div className="skeleton-box skeleton-line" style={{width: "40%",}} />
                </div>

                {/* TRAILER */}
                <div className="loading-trailer">

                    {/* Title */}
                    <div className="skeleton-box skeleton-title" style={{width: "75%",}}/>
                </div>
            </div>
        );
    }

    if (error) return <div className="error">{error}</div>;
    if (!movie) return <div>Movie not found</div>;

    return (
        <div className="movie-details">

            {/* HERO BACKDROP */}
            <div
                className="hero"
                style={{
                    backgroundImage: movie?.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                        : "linear-gradient(#111, #333)",
                }}
            >
                {/* DARK OVERLAY */}
                <div className="hero-overlay"/>

                {/* CONTENT */}
                <div className="hero-content">
                    {/* BACK BUTTON */}
                    <button className="back-button" onClick={() => navigate(-1)}>
                        ← Back
                    </button>

                    {/* MOVIE INFO */}
                    <h1 style={{ marginBottom: 10, lineHeight: 1.0 }}>
                        {movie.title}
                    </h1>

                    <p style={{ fontSize: 18 }}>
                        ⭐ {movie.vote_average?.toFixed(1)}
                    </p>

                    <p style={{ marginTop: 10 }}>
                        📅 {movie.release_date}
                    </p>

                    <p style={{ marginTop: 10 }}>
                        ⏱️ {movie.runtime 
                            ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min` 
                            : "N/A"}
                    </p>

                    <p style={{ marginTop: 20, lineHeight: 1.4 }}>
                        {movie.overview}
                    </p>
                </div>
            </div>
            {/* TRAILER/TEASER */}
            {videoKey && (
                <div className="section">
                    <h3>🎬 {videoType || "Video"}</h3>

                    {videoKey ? (
                        <iframe
                            className="trailer"
                            src={`https://www.youtube.com/embed/${videoKey}`}
                            title="Movie Trailer"
                            allowFullScreen
                        />
                    ) : (
                        <div className="no-trailer">
                            🎬 No trailer available for this movie
                        </div>
                    )}   
                </div>
            )}
            {/* CAST */}
            {cast.length > 0 && (
                <div className="section">
                    <h3>🎭 Cast</h3>

                    <div className="cast-container">
                        {cast.map((actor) => (
                            <div
                                key={actor.cast_id} className="cast-card">
                                <img
                                    className="cast-image"
                                    src={
                                        actor.profile_path
                                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                            : "https://via.placeholder.com/120x180?text=No+Image"
                                    }
                                    alt={actor.name}
                                />

                                <p className="cast-actor">
                                    <strong>{actor.name}</strong>
                                </p>

                                <p className="cast-character">
                                    {actor.character}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* SIMILAR */}
            {similar.length > 0 && (
                <div className="section">
                    <h3>🎥 Similar Movies</h3>

                    <div className="similar-container">
                        {similar.map((movie) => (
                            <div key={movie.id} className="similar-card">
                                <img
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                    src={
                                        movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                            : "https://via.placeholder.com/140x210?text=No+Image"
                                    }
                                    alt={movie.title}
                                />

                                <p className="similar-title">{movie.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetails;