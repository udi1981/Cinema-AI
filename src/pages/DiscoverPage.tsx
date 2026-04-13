import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film, Search, Star, TrendingUp, Clock, Heart, Play, Eye,
  ChevronRight, Filter, Grid3X3, List, ArrowLeft, Sparkles,
  Flame, Clapperboard, Ghost, Laugh, Baby, Sword, Rocket,
  BookOpen, Music, Palette, Globe, Crown, User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Genre categories with icons and colors
const GENRES = [
  { id: 'all', label: 'All', icon: <Grid3X3 className="w-4 h-4" />, color: 'from-white/10 to-white/5' },
  { id: 'drama', label: 'Drama', icon: <Clapperboard className="w-4 h-4" />, color: 'from-blue-500/20 to-blue-600/10' },
  { id: 'comedy', label: 'Comedy', icon: <Laugh className="w-4 h-4" />, color: 'from-amber-500/20 to-amber-600/10' },
  { id: 'horror', label: 'Horror', icon: <Ghost className="w-4 h-4" />, color: 'from-purple-500/20 to-purple-600/10' },
  { id: 'scifi', label: 'Sci-Fi', icon: <Rocket className="w-4 h-4" />, color: 'from-cyan-500/20 to-cyan-600/10' },
  { id: 'action', label: 'Action', icon: <Sword className="w-4 h-4" />, color: 'from-red-500/20 to-red-600/10' },
  { id: 'kids', label: 'Kids & Family', icon: <Baby className="w-4 h-4" />, color: 'from-pink-500/20 to-pink-600/10' },
  { id: 'documentary', label: 'Documentary', icon: <BookOpen className="w-4 h-4" />, color: 'from-emerald-500/20 to-emerald-600/10' },
  { id: 'music', label: 'Music Video', icon: <Music className="w-4 h-4" />, color: 'from-violet-500/20 to-violet-600/10' },
  { id: 'animation', label: 'Animation', icon: <Palette className="w-4 h-4" />, color: 'from-orange-500/20 to-orange-600/10' },
  { id: 'education', label: 'Education', icon: <Globe className="w-4 h-4" />, color: 'from-teal-500/20 to-teal-600/10' },
] as const;

type Genre = typeof GENRES[number]['id'];

// Film type for the feed
type FeedFilm = {
  id: string;
  title: string;
  genre: Genre;
  style: string;
  thumbnailUrl?: string;
  sceneCount: number;
  duration: string;
  creatorName: string;
  creatorAvatar?: string;
  rating: number;
  views: number;
  likes: number;
  createdAt: string;
  isSeries: boolean;
  episodeCount?: number;
};

// Placeholder films for UI demonstration — will come from Supabase later
const PLACEHOLDER_FILMS: FeedFilm[] = [
  // Empty — real films will be loaded from DB
];

type SortBy = 'trending' | 'newest' | 'top_rated' | 'most_viewed';

const SORT_OPTIONS: { id: SortBy; label: string; icon: React.ReactNode }[] = [
  { id: 'trending', label: 'Trending', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'newest', label: 'Newest', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'top_rated', label: 'Top Rated', icon: <Star className="w-3.5 h-3.5" /> },
  { id: 'most_viewed', label: 'Most Viewed', icon: <Eye className="w-3.5 h-3.5" /> },
];

const DiscoverPage = () => {
  const { isAuthenticated, profile } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState<Genre>('all');
  const [sortBy, setSortBy] = useState<SortBy>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort films
  const filteredFilms = PLACEHOLDER_FILMS
    .filter(f => selectedGenre === 'all' || f.genre === selectedGenre)
    .filter(f => !searchQuery || f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.creatorName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-[#0a0e17]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <a href="#/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight">Cinema AI</span>
            </a>
            <span className="text-white/20">|</span>
            <span className="text-sm font-semibold text-white/80">Discover</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#/studio" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-semibold transition-all">
              <Sparkles className="w-3.5 h-3.5" /> Create Film
            </a>
            {isAuthenticated ? (
              <a href="#/profile" className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-emerald-400" />
                )}
              </a>
            ) : (
              <a href="#/auth" className="text-sm text-white/60 hover:text-white transition-colors">Sign In</a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500/10 via-[#0f1520] to-teal-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl font-bold">Discover AI Films</h1>
          </div>
          <p className="text-white/50 text-sm max-w-lg mx-auto mb-5">
            Explore films created by the Cinema AI community. Watch, rate, and get inspired.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search films, creators, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </motion.div>

        {/* Genre Pills */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ direction: 'ltr' }}>
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                selectedGenre === genre.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {genre.icon}
              {genre.label}
            </button>
          ))}
        </motion.div>

        {/* Sort & View Controls */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortBy === opt.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Films Grid / Empty State */}
        {filteredFilms.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-white/10" />
            </div>
            <h2 className="text-xl font-bold mb-2">No films yet</h2>
            <p className="text-white/40 text-sm max-w-sm mx-auto mb-6">
              Be the first to create and publish a film! The community feed will come alive as creators share their work.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a href="#/studio" className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-semibold transition-all">
                <Sparkles className="w-4 h-4" /> Create Your First Film
              </a>
            </div>

            {/* Coming Soon Features */}
            <div className="mt-12 max-w-2xl mx-auto">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Coming Soon</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Play className="w-5 h-5" />, title: 'Watch & Stream', desc: 'Watch films created by the community' },
                  { icon: <Star className="w-5 h-5" />, title: 'Rate & Review', desc: 'Rate films and leave reviews' },
                  { icon: <Heart className="w-5 h-5" />, title: 'Follow Creators', desc: 'Follow your favorite creators' },
                  { icon: <Crown className="w-5 h-5" />, title: 'Earn Revenue', desc: 'Monetize your content' },
                  { icon: <TrendingUp className="w-5 h-5" />, title: 'Trending Charts', desc: 'Discover trending films' },
                  { icon: <Clapperboard className="w-5 h-5" />, title: 'Series Support', desc: 'Create multi-episode series' },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="p-4 bg-[#0f1520] border border-white/5 rounded-xl text-left"
                  >
                    <div className="text-emerald-400/50 mb-2">{feature.icon}</div>
                    <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                    <p className="text-[11px] text-white/30">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
          }>
            {filteredFilms.map((film, i) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className={`bg-[#0f1520] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group ${
                  viewMode === 'list' ? 'flex items-center gap-4 p-3' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className={`relative bg-white/5 ${viewMode === 'list' ? 'w-32 h-20 shrink-0 rounded-xl' : 'aspect-video'}`}>
                  {film.thumbnailUrl ? (
                    <img src={film.thumbnailUrl} alt={film.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-8 h-8 text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-medium">
                    {film.duration}
                  </div>
                  {film.isSeries && (
                    <div className="absolute top-2 left-2 bg-emerald-500/80 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                      Series • {film.episodeCount} ep
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'p-4'}>
                  <h3 className="font-semibold text-sm truncate">{film.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-white/10 overflow-hidden shrink-0">
                      {film.creatorAvatar ? (
                        <img src={film.creatorAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3 h-3 text-white/40 m-1" />
                      )}
                    </div>
                    <span className="text-xs text-white/50 truncate">{film.creatorName}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-white/40">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {film.rating.toFixed(1)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {film.views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {film.likes}</span>
                    <span className="capitalize">{film.genre}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap gap-4 text-xs text-white/30 pb-8 pt-4">
          <a href="#/" className="hover:text-white/60 transition-colors">Home</a>
          <a href="#/studio" className="hover:text-white/60 transition-colors">Studio</a>
          <a href="#/terms" className="hover:text-white/60 transition-colors">Terms</a>
          <a href="#/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
          <a href="#/help" className="hover:text-white/60 transition-colors">Help</a>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
