import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getMovieVideos, getMovieCredits, getSimilarMovies } from "../services/tmdb";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoKey, setVideoKey] = useState(null);
    const [videoType, setVideoType] = useState(null);
    const [cast, setCast] = useState([]);
    const [similar, setSimilar] = useState([]);

    useEffect(() => {
        async function fetchMovie() {
            try {
                setLoading(true);

                const movieData = await getMovieDetails(id);
                setMovie(movieData);

                const videoData = await getMovieVideos(id);
            
                // Filter only Youtube videos
                const videos = videoData.results.filter(v => v.site === "YouTube");

                // priority: Trailer → Teaser
                const trailer =
                    videos.find((v) => v.type === "Trailer") ||
                    videos.find((v) => v.type === "Teaser");

                if (trailer) {
                    setVideoKey(trailer.key);
                    setVideoType(trailer.type);
                } else {
                    setVideoKey(null);
                    setVideoType(null);
                }

                const creditsData = await getMovieCredits(id);
                // Only top actors
                setCast(creditsData.cast.slice(0, 8));

                const similarData = await getSimilarMovies(id);
                // Only top 10 searches
                setSimilar((similarData.results || []).slice(0, 10));

            } catch (error) {
                console.error("MovieDetails error:", error);

                setMovie(null);
                setVideoKey(null);
                setCast([]);
            } finally {
                setLoading(false);
            }
        }

        fetchMovie();
    }, [id]);

    if (loading) return <p>Loading movie...</p>;

    return (
        <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>

            {/* HERO BACKDROP */}
            <div
                style={{
                    position: "relative",
                    height: "450px",
                    backgroundImage: movie.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                        : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 30,
                }}
            >
                {/* DARK OVERLAY */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.3))",
                    }}
                />

                {/* CONTENT */}
                <div
                    style={{
                    position: "relative",
                    color: "white",
                    padding: 30,
                    maxWidth: "60%",
                    }}
                >
                    {/* BACK BUTTON */}
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            marginBottom: 20,
                            fontSize: 18,
                            padding: "6px 12px",
                            cursor: "pointer",
                        }}
                    >
                        ← Back
                    </button>

                    <h1 style={{ marginBottom: 10, lineHeight: 1.1 }}>
                        {movie.title}
                    </h1>

                    <p style={{ fontSize: 18 }}>
                        ⭐ {movie.vote_average?.toFixed(1)}
                    </p>

                    <p style={{ marginTop: 10 }}>
                        📅 {movie.release_date}
                    </p>

                    <p style={{ marginTop: 20, lineHeight: 1.4 }}>
                        {movie.overview}
                    </p>
                </div>
            </div>
            {/* TRAILER/TEASER */}
            {videoKey && (
                <div style={{ marginTop: 30 }}>
                    <h3>🎬 {videoType || "Video"}</h3>

                    {videoKey ? (
                        <iframe
                            width="100%"
                            height="400"
                            src={`https://www.youtube.com/embed/${videoKey}`}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div
                            style={{
                                padding: 20,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 10,
                                textAlign: "center",
                                marginTop: 10
                            }}
                        >
                            🎬 No trailer available for this movie
                        </div>
                    )}   
                </div>
            )}
            {/* CAST */}
            {cast.length > 0 && (
                <div style={{ marginTop: 40 }}>
                    <h3>🎭 Cast</h3>

                    <div
                        style={{
                            display: "flex",
                            gap: 15,
                            overflowX: "auto",
                            paddingBottom: 10
                        }}
                    >
                        {cast.map((actor) => (
                            <div
                                key={actor.cast_id}
                                style={{
                                    minWidth: 120,
                                    textAlign: "center"
                                }}
                            >
                                <img
                                    src={
                                        actor.profile_path
                                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                            : "https://via.placeholder.com/120x180?text=No+Image"
                                    }
                                    alt={actor.name}
                                    style={{
                                        width: 120,
                                        height: 180,
                                        objectFit: "cover",
                                        borderRadius: 10
                                    }}
                                />

                                <p style={{ fontSize: 12, marginTop: 5 }}>
                                    <strong>{actor.name}</strong>
                                </p>

                                <p style={{ fontSize: 11, color: "gray" }}>
                                    {actor.character}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* SIMILAR */}
            {similar.length > 0 && (
                <div style={{ marginTop: 50 }}>
                    <h3>🎥 Similar Movies</h3>

                    <div
                        style={{
                            display: "flex",
                            gap: 15,
                            overflowX: "auto",
                            paddingBottom: 10,
                            overflowY: "visible",
                        }}
                    >
                        {similar.map((movie) => (
                            <div
                                key={movie.id}
                                style={{
                                    minWidth: 140,
                                    cursor: "pointer",
                                    textAlign: "center",
                                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.08)";
                                    e.currentTarget.style.zIndex = "10";
                                }}

                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.zIndex = "1";
                                }}
                            >
                                <img
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                    src={
                                        movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                            : "https://via.placeholder.com/140x210?text=No+Image"
                                    }
                                    alt={movie.title}
                                    style={{
                                        width: 140,
                                        height: 210,
                                        objectFit: "cover",
                                        borderRadius: 10,
                                    }}
                                />

                                <p
                                    style={{
                                        fontSize: 12,
                                        marginTop: 5,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}
                                >
                                    {movie.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetails;