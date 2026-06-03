const API_KEY = "15eb721d358e52047eb28a39d94ab655";
const BASE_URL = "https://api.themoviedb.org/3";


// 🎬 trending movies
export async function getTrendingMovies() {
  const res = await fetch(
    `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`
  );
  return res.json();
}

// 🔍 search movies
export async function searchMovies(query) {
  const res = await fetch(
    `${BASE_URL}/search/movie?query=${query}&api_key=${API_KEY}`
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

// 🔍 searcg similar movies
export async function getSimilarMovies(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`
  );
  return res.json();
}