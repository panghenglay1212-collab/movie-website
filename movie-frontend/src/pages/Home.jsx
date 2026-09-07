import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const trendingRes = await api.get("/movies/trending");
        const popularRes = await api.get("/movies/popular");
        setTrending(trendingRes.data.results);
        setPopular(popularRes.data.results);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            JX Movie with Best Movies
          </h1>
          <p className="text-gray-400 mt-2">Discover the best movies</p>
        </header>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <MovieRow title="🔥 Trending This Week" movies={trending} />
            <MovieRow title="⭐ Popular Now" movies={popular} />
          </>
        )}
      </div>
    </div>
  );
}

function MovieRow({ title, movies }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
        {title}
      </h2>
      <div className="relative">
        <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group flex-shrink-0 w-44 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                />
                {/* Glass overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold text-sm line-clamp-2">
                      {movie.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white text-xs">
                        {movie.vote_average?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Title below (visible on desktop) */}
              <p className="text-white/80 text-sm mt-2 truncate text-center group-hover:text-white transition-colors">
                {movie.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}