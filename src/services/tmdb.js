const API_KEY = "15eb721d358e52047eb28a39d94ab655";
const BASE_URL = "https://api.themoviedb.org/3";

export async function getTrendingMovies() {
  const res = await fetch(
    `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`
  );
  return res.json();
}