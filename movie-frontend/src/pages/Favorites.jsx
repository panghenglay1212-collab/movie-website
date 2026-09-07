import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await api.get("/favorites");
        setFavorites(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Please log in to see your favorites");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const removeFavorite = async (movieId) => {
    setRemovingId(movieId);
    try {
      await api.delete(`/favorites/${movieId}`);
      setFavorites(favorites.filter((f) => f.movie_id !== movieId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/60">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 max-w-md w-full text-center shadow-2xl shadow-purple-500/20">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-white/70 mb-6">{error}</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-3">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-2xl">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                My Favorites
              </h1>
              <p className="text-white/50 mt-1">
                {favorites.length} {favorites.length === 1 ? "movie" : "movies"} saved
              </p>
            </div>
            {favorites.length > 0 && (
              <Link
                to="/"
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm bg-white/5 px-4 py-2 rounded-xl hover:bg-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m0 0l7-7m-7 7l7 7" />
                </svg>
                Browse more movies
              </Link>
            )}
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-16 text-center shadow-2xl shadow-purple-500/20">
            <div className="text-7xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-white mb-2">No favorites yet</h3>
            <p className="text-white/50 mb-6">
              Start building your collection by adding movies you love!
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="group relative animate-fadeIn"
                style={{
                  animationDelay: `${favorites.indexOf(fav) * 50}ms`,
                }}
              >
                <Link to={`/movie/${fav.movie_id}`} className="block">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-purple-500/10 group-hover:shadow-purple-500/30 transition-all duration-300">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    
                    {/* Poster */}
                    <img
                      src={
                        fav.poster_path
                          ? `https://image.tmdb.org/t/p/w300${fav.poster_path}`
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={fav.title}
                      className="relative w-full aspect-[2/3] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
                        <p className="text-white font-semibold text-sm line-clamp-2">
                          {fav.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Remove button */}
                <button
                  onClick={() => removeFavorite(fav.movie_id)}
                  disabled={removingId === fav.movie_id}
                  className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {removingId === fav.movie_id ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
                
                {/* Title (visible on desktop) */}
                <p className="text-white/80 text-sm mt-2 truncate text-center group-hover:text-white transition-colors">
                  {fav.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}