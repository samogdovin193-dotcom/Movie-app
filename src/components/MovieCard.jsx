function MovieCard({ movie }) {
  return (
    <div
      style={{
        width: 150,
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 10,
      }}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        style={{ width: "100%" }}
      />

      <p style={{ fontSize: 12 }}>
        {movie.title}
      </p>
    </div>
  );
}

export default MovieCard;