import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film, Search, Star, TrendingUp, Clock, Heart, Play, Eye,
  ChevronLeft, ChevronRight, ArrowLeft, Sparkles,
  Flame, User, Crown, Bookmark, Share2, MessageCircle,
  BadgeCheck, Volume2, VolumeX, ThumbsUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ─── Demo Data ───────────────────────────────────────────────────
// Placeholder films to make the feed look alive (will be replaced by Supabase)

const DEMO_CREATORS = [
  { name: 'Sarah Chen', avatar: '', verified: true, followers: '12.4K' },
  { name: 'Marco Di Rossi', avatar: '', verified: true, followers: '8.7K' },
  { name: 'Yuki Tanaka', avatar: '', verified: false, followers: '3.2K' },
  { name: 'Alex Rivera', avatar: '', verified: true, followers: '45.1K' },
  { name: 'Elena Voronova', avatar: '', verified: false, followers: '6.8K' },
  { name: 'David Okafor', avatar: '', verified: true, followers: '21.3K' },
  { name: 'Priya Sharma', avatar: '', verified: false, followers: '1.9K' },
  { name: 'James Wright', avatar: '', verified: true, followers: '33.6K' },
  { name: 'Mia Johansson', avatar: '', verified: false, followers: '5.4K' },
  { name: 'Luca Bianchi', avatar: '', verified: true, followers: '15.7K' },
];

type FeedFilm = {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailGradient: string;
  duration: string;
  creator: typeof DEMO_CREATORS[number];
  rating: number;
  views: string;
  likes: string;
  comments: number;
  timeAgo: string;
  isSeries?: boolean;
  episodeCount?: number;
  isFeatured?: boolean;
};

const DEMO_FILMS: FeedFilm[] = [
  {
    id: '1', title: 'The Last Algorithm', description: 'In a world where AI has surpassed human intelligence, one programmer discovers a hidden message in the code that could change everything.',
    genre: 'Sci-Fi', thumbnailGradient: 'from-cyan-900 via-blue-900 to-indigo-950',
    duration: '4:32', creator: DEMO_CREATORS[3], rating: 4.9, views: '124K', likes: '8.2K', comments: 342, timeAgo: '2 hours ago', isFeatured: true,
  },
  {
    id: '2', title: 'Echoes of Tomorrow', description: 'A time traveler must choose between saving the world and saving the one person who matters most.',
    genre: 'Drama', thumbnailGradient: 'from-amber-900 via-orange-900 to-red-950',
    duration: '6:18', creator: DEMO_CREATORS[0], rating: 4.7, views: '89K', likes: '5.1K', comments: 198, timeAgo: '5 hours ago',
  },
  {
    id: '3', title: 'Neon Streets', description: 'Underground racers compete in a cyberpunk city where the stakes are life and death.',
    genre: 'Action', thumbnailGradient: 'from-pink-900 via-fuchsia-900 to-purple-950',
    duration: '3:45', creator: DEMO_CREATORS[5], rating: 4.5, views: '67K', likes: '4.3K', comments: 156, timeAgo: '8 hours ago',
  },
  {
    id: '4', title: 'The Quiet Garden', description: 'A meditation on life, loss, and the beauty of impermanence told through a single garden across seasons.',
    genre: 'Documentary', thumbnailGradient: 'from-emerald-900 via-green-900 to-teal-950',
    duration: '8:00', creator: DEMO_CREATORS[1], rating: 4.8, views: '45K', likes: '3.8K', comments: 89, timeAgo: '1 day ago',
  },
  {
    id: '5', title: 'Midnight Carnival', description: 'A group of friends visit a mysterious carnival that only appears at midnight. Not everyone will leave.',
    genre: 'Horror', thumbnailGradient: 'from-gray-900 via-slate-900 to-zinc-950',
    duration: '5:22', creator: DEMO_CREATORS[4], rating: 4.3, views: '98K', likes: '6.7K', comments: 421, timeAgo: '12 hours ago',
  },
  {
    id: '6', title: 'Paper Planes', description: 'Two kids from different continents connect through paper planes carried by the wind.',
    genre: 'Kids & Family', thumbnailGradient: 'from-sky-800 via-blue-800 to-indigo-900',
    duration: '4:00', creator: DEMO_CREATORS[6], rating: 4.6, views: '34K', likes: '2.9K', comments: 67, timeAgo: '2 days ago',
  },
  {
    id: '7', title: 'Beats & Dreams', description: 'A street musician journey from the subway platforms to the biggest stage in the world.',
    genre: 'Music Video', thumbnailGradient: 'from-violet-900 via-purple-900 to-fuchsia-950',
    duration: '3:30', creator: DEMO_CREATORS[7], rating: 4.4, views: '156K', likes: '11.2K', comments: 534, timeAgo: '6 hours ago',
  },
  {
    id: '8', title: 'The Perfect Recipe', description: 'When a food critic loses their sense of taste, they must rediscover what makes food truly special.',
    genre: 'Comedy', thumbnailGradient: 'from-yellow-900 via-amber-900 to-orange-950',
    duration: '6:00', creator: DEMO_CREATORS[8], rating: 4.2, views: '28K', likes: '1.8K', comments: 45, timeAgo: '3 days ago',
  },
  {
    id: '9', title: 'Stellar Drift', description: 'Aboard a generation ship heading to a new star system, the crew faces an impossible choice.',
    genre: 'Sci-Fi', thumbnailGradient: 'from-indigo-900 via-blue-950 to-slate-950',
    duration: '7:45', creator: DEMO_CREATORS[9], rating: 4.6, views: '72K', likes: '4.9K', comments: 213, timeAgo: '1 day ago',
    isSeries: true, episodeCount: 4,
  },
  {
    id: '10', title: 'Urban Canvas', description: 'Street artists transform a gray city into a vibrant masterpiece overnight.',
    genre: 'Animation', thumbnailGradient: 'from-rose-900 via-pink-900 to-red-950',
    duration: '4:15', creator: DEMO_CREATORS[2], rating: 4.7, views: '51K', likes: '3.6K', comments: 128, timeAgo: '4 hours ago',
  },
  {
    id: '11', title: 'Deep Waters', description: 'Marine biologists discover something ancient and alive at the bottom of the Mariana Trench.',
    genre: 'Documentary', thumbnailGradient: 'from-teal-900 via-cyan-950 to-blue-950',
    duration: '8:00', creator: DEMO_CREATORS[0], rating: 4.8, views: '93K', likes: '7.1K', comments: 278, timeAgo: '18 hours ago',
  },
  {
    id: '12', title: 'One More Round', description: 'An aging boxer gets one last shot at redemption in the ring.',
    genre: 'Drama', thumbnailGradient: 'from-red-900 via-rose-950 to-stone-950',
    duration: '5:50', creator: DEMO_CREATORS[5], rating: 4.5, views: '41K', likes: '2.7K', comments: 95, timeAgo: '2 days ago',
  },
];

const GENRES = ['All', 'Trending', 'Sci-Fi', 'Drama', 'Action', 'Horror', 'Comedy', 'Documentary', 'Animation', 'Kids & Family', 'Music Video'] as const;

// ─── Horizontal Scroll Row ──────────────────────────────────────
const ScrollRow = ({ title, films, icon }: { title: string; films: FeedFilm[]; icon: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  if (films.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">{icon}</span>
          <h2 className="text-lg font-bold">{title}</h2>
          <span className="text-xs text-white/30 font-medium">{films.length} films</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory" style={{ direction: 'ltr' }}>
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </div>
  );
};

// ─── Film Card ──────────────────────────────────────────────────
const FilmCard = ({ film }: { film: FeedFilm }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-[300px] shrink-0 snap-start group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className={`relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${film.thumbnailGradient}`}>
        {/* Fake cinematic frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Film className="w-12 h-12 text-white/10" />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={false}
            className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
          >
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </motion.div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide">
          {film.duration}
        </div>

        {/* Series badge */}
        {film.isSeries && (
          <div className="absolute top-2 left-2 bg-emerald-500/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Film className="w-3 h-3" /> {film.episodeCount} Episodes
          </div>
        )}

        {/* Genre badge */}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-medium text-white/80">
          {film.genre}
        </div>

        {/* Quick actions on hover */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${liked ? 'bg-red-500/80 text-white' : 'bg-black/40 text-white/70 hover:text-white'}`}
          >
            <Heart className="w-3.5 h-3.5" fill={liked ? 'white' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${saved ? 'bg-emerald-500/80 text-white' : 'bg-black/40 text-white/70 hover:text-white'}`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? 'white' : 'none'} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 flex gap-3">
        {/* Creator avatar */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
            {film.creator.name.charAt(0)}
          </div>
          {film.creator.verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#07070e] rounded-full flex items-center justify-center">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" fill="#07070e" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
            {film.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-white/50 hover:text-white/70 transition-colors">{film.creator.name}</span>
            {film.creator.verified && <BadgeCheck className="w-3 h-3 text-emerald-400/60" />}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-white/35">
            <span>{film.views} views</span>
            <span>-</span>
            <span>{film.timeAgo}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Featured Hero Film ─────────────────────────────────────────
const FeaturedHero = ({ film }: { film: FeedFilm }) => {
  const [muted, setMuted] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Background */}
      <div className={`relative aspect-[21/9] bg-gradient-to-br ${film.thumbnailGradient}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070e] via-[#07070e]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070e]/80 via-transparent to-transparent" />

        {/* Play button center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 opacity-80 group-hover:opacity-100 transition-all"
          >
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </motion.div>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-emerald-500/90 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3 h-3" /> Featured
            </span>
            <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md text-[11px] font-medium">
              {film.genre}
            </span>
            {film.isSeries && (
              <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md text-[11px] font-medium">
                Series - {film.episodeCount} Episodes
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black mb-2 leading-tight max-w-lg">
            {film.title}
          </h1>
          <p className="text-sm text-white/60 max-w-md mb-4 line-clamp-2">
            {film.description}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                {film.creator.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">{film.creator.name}</span>
                  {film.creator.verified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-[10px] text-white/40">{film.creator.followers} followers</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 transition-all">
              <Play className="w-4 h-4" fill="black" /> Watch Now
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all border border-white/10">
              <ThumbsUp className="w-4 h-4" /> {film.likes}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all border border-white/10">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all border border-white/10">
              <Bookmark className="w-4 h-4" /> Save
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {film.views} views</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {film.rating}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {film.comments} comments</span>
            <span>{film.timeAgo}</span>
          </div>
        </div>

        {/* Mute button */}
        <button
          onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
          className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white/60 hover:text-white transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────
const DiscoverPage = () => {
  const { isAuthenticated, profile } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const featured = DEMO_FILMS.find(f => f.isFeatured) || DEMO_FILMS[0];
  const trending = DEMO_FILMS.filter(f => !f.isFeatured).sort(() => Math.random() - 0.5).slice(0, 8);
  const sciFiFilms = DEMO_FILMS.filter(f => f.genre === 'Sci-Fi');
  const dramaFilms = DEMO_FILMS.filter(f => f.genre === 'Drama');
  const actionHorror = DEMO_FILMS.filter(f => f.genre === 'Action' || f.genre === 'Horror');
  const creative = DEMO_FILMS.filter(f => ['Animation', 'Music Video', 'Documentary'].includes(f.genre));

  // Search / genre filter
  const allFilms = selectedGenre === 'All'
    ? DEMO_FILMS.filter(f => !f.isFeatured)
    : selectedGenre === 'Trending'
    ? trending
    : DEMO_FILMS.filter(f => f.genre === selectedGenre);

  const searchResults = searchQuery
    ? DEMO_FILMS.filter(f =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      {/* Top Nav */}
      <div className="border-b border-white/5 bg-[#07070e]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#/" className="text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <a href="#/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight hidden sm:inline">Cinema AI</span>
            </a>
          </div>

          {/* Center — Search */}
          <div className={`relative flex-1 max-w-xl transition-all ${searchFocused ? 'max-w-2xl' : ''}`}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search films, creators, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
            />
            {/* Search results dropdown */}
            <AnimatePresence>
              {searchQuery && searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-2 inset-x-0 bg-[#12122a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-sm text-white/40 text-center">No results for "{searchQuery}"</div>
                  ) : (
                    searchResults.slice(0, 5).map((film) => (
                      <button key={film.id} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left">
                        <div className={`w-16 h-10 rounded-lg bg-gradient-to-br ${film.thumbnailGradient} shrink-0 flex items-center justify-center`}>
                          <Play className="w-4 h-4 text-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{film.title}</p>
                          <p className="text-[11px] text-white/40">{film.creator.name} - {film.genre}</p>
                        </div>
                        <span className="text-[10px] text-white/30">{film.duration}</span>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a href="#/studio" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full text-xs font-bold transition-all">
              <Sparkles className="w-3.5 h-3.5" /> Create
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
              <a href="#/auth" className="text-xs text-white/60 hover:text-white transition-colors font-medium">Sign In</a>
            )}
          </div>
        </div>
      </div>

      {/* Genre Tabs — sticky under nav */}
      <div className="border-b border-white/5 bg-[#07070e]/80 backdrop-blur-sm sticky top-14 z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2" style={{ direction: 'ltr' }}>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  selectedGenre === genre
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-10">

        {/* Featured Hero */}
        {selectedGenre === 'All' && !searchQuery && (
          <FeaturedHero film={featured} />
        )}

        {/* Genre-filtered view OR Category rows */}
        {selectedGenre !== 'All' || searchQuery ? (
          /* Filtered Grid */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {searchQuery ? `Results for "${searchQuery}"` : selectedGenre}
              </h2>
              <span className="text-xs text-white/30">{searchQuery ? searchResults.length : allFilms.length} films</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {(searchQuery ? searchResults : allFilms).map((film) => (
                <FilmCard key={film.id} film={film} />
              ))}
            </div>
            {(searchQuery ? searchResults : allFilms).length === 0 && (
              <div className="text-center py-16">
                <Film className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No films found</p>
              </div>
            )}
          </div>
        ) : (
          /* Netflix-style rows */
          <>
            <ScrollRow
              title="Trending Now"
              icon={<Flame className="w-5 h-5" />}
              films={trending}
            />

            <ScrollRow
              title="Sci-Fi & Beyond"
              icon={<Sparkles className="w-5 h-5" />}
              films={sciFiFilms}
            />

            <ScrollRow
              title="Powerful Stories"
              icon={<Heart className="w-5 h-5" />}
              films={dramaFilms}
            />

            {/* Top Creators Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Crown className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold">Top Creators</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {DEMO_CREATORS.filter(c => c.verified).slice(0, 5).map((creator, i) => (
                  <motion.div
                    key={creator.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-2 p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl transition-all cursor-pointer group"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
                        {creator.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#07070e] rounded-full flex items-center justify-center">
                        <BadgeCheck className="w-4 h-4 text-emerald-400" fill="#07070e" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold truncate max-w-full">{creator.name}</p>
                      <p className="text-[10px] text-white/35">{creator.followers} followers</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <ScrollRow
              title="Action & Thrills"
              icon={<TrendingUp className="w-5 h-5" />}
              films={actionHorror}
            />

            <ScrollRow
              title="Creative & Artistic"
              icon={<Star className="w-5 h-5" />}
              films={creative}
            />
          </>
        )}

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#0f1520] to-teal-500/10 border border-white/10 p-8 sm:p-10 text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Ready to Create Your Own Film?</h2>
            <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
              Join thousands of creators using AI to bring their stories to life. Start creating in minutes.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href="#/studio" className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/25">
                <Sparkles className="w-4 h-4" /> Start Creating
              </a>
              <a href="#/" className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm font-semibold transition-all border border-white/10">
                Learn More
              </a>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between text-xs text-white/25 pb-8 pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-4">
            <a href="#/" className="hover:text-white/50 transition-colors">Home</a>
            <a href="#/studio" className="hover:text-white/50 transition-colors">Studio</a>
            <a href="#/terms" className="hover:text-white/50 transition-colors">Terms</a>
            <a href="#/privacy" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#/help" className="hover:text-white/50 transition-colors">Help</a>
          </div>
          <span>&copy; 2025 Cinema AI Studio</span>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
