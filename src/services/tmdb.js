const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


// 🎬 trending movies
export async function getTrendingMovies() {
  const res = await fetch(
    `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`
  );
  return res.json();
}

// 🔍 search movies
export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/movie?query=${query}&page=${page}&api_key=${API_KEY}`
  );

  return res.json();
}

// 🎬 movie details
export async function getMovieDetails(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
  );
  return res.json();
}

// 🎬 movie videos
export async function getMovieVideos(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`
  );
  return res.json();
}

// 🎭 search cast
export async function getMovieCredits(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
  );
  return res.json();
}

// 🔍 search similar movies
export async function getSimilarMovies(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`
  );
  return res.json();
}

// 🔍 search movies by genre
export async function getMoviesByGenre(genreId) {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
  );

  return res.json();
}

// 🎬 discover movies (genre + sort)
export async function discoverMovies({ genreId, sortBy, page = 1, query }) {
  const params = new URLSearchParams();

  params.append("api_key", API_KEY);
  params.append("page", page);

  // SORT
  params.append("sort_by", sortBy);

  // GENRE
  if (genreId && genreId !== "all") {
    params.append("with_genres", genreId);
  }

  // SEARCH (keyword-based)
  if (query) {
    params.append("with_keywords", query);
  }

  const res = await fetch(
    `${BASE_URL}/discover/movie?${params.toString()}`
  );

  return res.json();
}