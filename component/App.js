import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHeart, FaRegHeart, FaSearch, FaStar, FaImdb } from 'react-icons/fa';

const API_KEY = '3dd7f8e6'; // Replace with your OMDB API key

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const searchMovies = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`
      );
      if (response.data.Search) {
        setMovies(response.data.Search);
      } else {
        setMovies([]);
        toast.info('No movies found. Try a different search term.');
      }
    } catch (error) {
      toast.error('Error fetching movies. Please try again.');
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
      );
      setSelectedMovie(response.data);
    } catch (error) {
      toast.error('Error fetching movie details. Please try again.');
      console.error('Error fetching movie details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.imdbID !== movie.imdbID));
      toast.success('Removed from favorites!');
    } else {
      setFavorites([...favorites, movie]);
      toast.success('Added to favorites!');
    }
  };

  const isFavorite = (imdbID) => {
    return favorites.some(fav => fav.imdbID === imdbID);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Movie Search</h1>
          <form onSubmit={searchMovies} className="mt-4 flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for movies..."
              className="flex-grow p-2 rounded-l text-gray-800"
              required
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-r flex items-center"
              disabled={isLoading}
            >
              <FaSearch className="mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
                >
                  &times;
                </button>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          selectedMovie.Poster !== 'N/A'
                            ? selectedMovie.Poster
                            : 'https://via.placeholder.com/300x450?text=No+Poster'
                        }
                        alt={selectedMovie.Title}
                        className="w-full md:w-64 rounded shadow-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold">{selectedMovie.Title}</h2>
                        <button
                          onClick={() => toggleFavorite(selectedMovie)}
                          className="text-2xl text-red-500"
                        >
                          {isFavorite(selectedMovie.imdbID) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center mt-2">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span>{selectedMovie.imdbRating}/10</span>
                        <a
                          href={`https://www.imdb.com/title/${selectedMovie.imdbID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 flex items-center text-blue-600 hover:underline"
                        >
                          <FaImdb className="text-yellow-500 text-xl mr-1" />
                          IMDb
                        </a>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-gray-600">Year</p>
                          <p>{selectedMovie.Year}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Rated</p>
                          <p>{selectedMovie.Rated}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Runtime</p>
                          <p>{selectedMovie.Runtime}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Genre</p>
                          <p>{selectedMovie.Genre}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Director</p>
                          <p>{selectedMovie.Director}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Actors</p>
                          <p>{selectedMovie.Actors}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h3 className="font-semibold">Plot</h3>
                        <p className="mt-2">{selectedMovie.Plot}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {movies.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.imdbID}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={
                        movie.Poster !== 'N/A'
                          ? movie.Poster
                          : 'https://via.placeholder.com/300x450?text=No+Poster'
                      }
                      alt={movie.Title}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(movie)}
                      className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100"
                    >
                      {isFavorite(movie.imdbID) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-red-500" />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{movie.Title}</h3>
                    <p className="text-gray-600 mb-2">{movie.Year}</p>
                    <button
                      onClick={() => fetchMovieDetails(movie.imdbID)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {favorites.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((movie) => (
                <div
                  key={movie.imdbID}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={
                        movie.Poster !== 'N/A'
                          ? movie.Poster
                          : 'https://via.placeholder.com/300x450?text=No+Poster'
                      }
                      alt={movie.Title}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(movie)}
                      className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100"
                    >
                      <FaHeart className="text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{movie.Title}</h3>
                    <p className="text-gray-600 mb-2">{movie.Year}</p>
                    <button
                      onClick={() => fetchMovieDetails(movie.imdbID)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;