const FAVORITES_KEY = "favorites";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

export function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}