import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setError("");
    setLoading(true);
    setSearched(true);

    try {
      const res = await api.get("/movies/search", { params: { query } });
      setResults(res.data.results || []);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient flex items-center gap-3">
            <span className="text-5xl">🔍</span>
            Search Movies
          </h1>
          <p className="text-white/40 mt-1">
            Discover your next favorite film
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl shadow-purple-500/20 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search for a movie title..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setSearched(false);
                    setError("");
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="relative px-8 py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </>
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 animate-fadeIn">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {searched && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-white/60">Searching for movies...</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-16 text-center shadow-2xl shadow-purple-500/20">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                <p className="text-white/50">
                  We couldn't find any movies matching "{query}"
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setSearched(false);
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                  className="mt-4 text-white/60 hover:text-white transition-colors duration-300"
                >
                  Try a different search
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                    Results ({results.filter(m => m.poster_path).length})
                  </h2>
                  <span className="text-white/40 text-sm">
                    Showing {results.filter(m => m.poster_path).length} of {results.length} results
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {results
                    .filter((m) => m.poster_path)
                    .map((movie, index) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="group animate-fadeIn"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-purple-500/10 group-hover:shadow-purple-500/30 transition-all duration-300">
                          {/* Glow effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                          
                          <img
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title}
                            className="relative w-full aspect-[2/3] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                          />
                          
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
                              <p className="text-white font-semibold text-sm line-clamp-2">
                                {movie.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-yellow-400 text-xs">⭐</span>
                                <span className="text-white/80 text-xs">
                                  {movie.vote_average?.toFixed(1) || "N/A"}
                                </span>
                                {movie.release_date && (
                                  <>
                                    <span className="text-white/30 text-xs">•</span>
                                    <span className="text-white/50 text-xs">
                                      {new Date(movie.release_date).getFullYear()}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm mt-2 truncate text-center group-hover:text-white transition-colors">
                          {movie.title}
                        </p>
                      </Link>
                    ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Initial state - no search yet */}
        {!searched && !loading && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-16 text-center shadow-2xl shadow-purple-500/20">
            <div className="text-7xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">Find Your Movie</h3>
            <p className="text-white/50 max-w-md mx-auto">
              Enter a movie title above to search through our extensive collection
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["Inception", "Interstellar", "The Dark Knight", "Avatar"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    setTimeout(() => {
                      handleSearch(new Event("submit"));
                    }, 100);
                  }}
                  className="px-4 py-2 text-sm text-white/60 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}