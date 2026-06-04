import { createContext, useContext, useState, useEffect } from "react";
import { getFavorites, saveFavorites } from "../services/favorites";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(getFavorites());

    const addFavorite = (movie) => {
        const updatedFavorites = [...favorites, movie];
        saveFavorites(updatedFavorites);
        setFavorites(updatedFavorites);
    };

    const removeFavorite = (movieId) => {
        const updatedFavorites = favorites.filter(m => m.id !== movieId);
        saveFavorites(updatedFavorites);
        setFavorites(updatedFavorites);
    };

    const isFavorite = (movieId) => {
        return favorites.some(m => m.id === movieId);
    };

    const toggleFavorite = (movie) => {
        if (isFavorite(movie.id)) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addFavorite,
            removeFavorite,
            isFavorite,
            toggleFavorite
        }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);