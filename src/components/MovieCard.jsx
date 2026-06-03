function MovieCard({ movie }) {

    const releaseYear = movie.release_date
        ? movie.release_date.split("-")[0]
        : "N/A";

    function getRatingColor(rating) {
        if (!rating || rating === 0) return "gray";
        if (rating >= 7) return "green";
        if (rating >= 5) return "orange";
        return "red";
    }

    return (
    <div
        style={{
            width: 180,
            border: "1px solid #ddd",
            borderRadius: 12,
            marginTop: 20,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
        <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
            style={{ 
                width: "100%",
                height: 270,
                objectFit: "cover",
            }}
        />

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