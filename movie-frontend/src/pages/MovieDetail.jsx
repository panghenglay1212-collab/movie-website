import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data);
      } finally {
        setLoading(false);
      }
    };
    loadMovie();
  }, [id]);

  const handleAddFavorite = async () => {
    setError("");
    try {
      await api.post("/favorites", {
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
      });
      setAdded(true);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Please log in to add favorites");
      } else if (err.response?.status === 400) {
        setAdded(true);
      } else {
        setError("Something went wrong");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/60">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const cast = movie.credits?.cast?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Backdrop with glass overlay */}
      <div
        className="h-[50vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-transparent" />
        
        {/* Back button */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* Main content with glass card */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-purple-500/20 p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster with glow effect */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="relative w-56 md:w-64 rounded-2xl shadow-2xl"
                />
              </div>
            </div>

            {/* Movie info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1 text-yellow-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">{movie.release_date}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">{movie.runtime} min</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex gap-2 flex-wrap">
                {movie.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm rounded-full border border-white/10"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-white/70 leading-relaxed max-w-2xl">
                {movie.overview}
              </p>

              {/* Error & Actions */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={handleAddFavorite}
                  disabled={added}
                  className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    added
                      ? "bg-white/10 text-white/40 cursor-default"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5"
                  }`}
                >
                  <span className="relative flex items-center gap-2">
                    {added ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        In Favorites
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add to Favorites
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast section */}
      {cast.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-purple-500/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              Cast
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
              {cast.map((actor) => (
                <div key={actor.id} className="flex-shrink-0 w-32 text-center group">
                  <div className="relative rounded-2xl overflow-hidden mb-2">
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={actor.name}
                      className="w-full rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <p className="text-white/90 text-sm font-medium truncate">
                    {actor.name}
                  </p>
                  <p className="text-white/40 text-xs truncate">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}