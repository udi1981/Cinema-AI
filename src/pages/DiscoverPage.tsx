import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film, Search, Star, TrendingUp, Heart, Play, Eye,
  ChevronLeft, ChevronRight, ArrowLeft, Sparkles,
  Flame, User, Crown, Bookmark, Share2, MessageCircle,
  BadgeCheck, Volume2, VolumeX, ThumbsUp, MapPin, Calendar,
  Award, Zap, Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ─── Creators ────────────────────────────────────────────────────
// Each creator is a real personality with a genre specialty, bio, and social presence

type Creator = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  location: string;
  specialty: string[];
  avatar: string;
  coverGradient: string;
  verified: boolean;
  followers: string;
  films: number;
  joined: string;
};

const CREATORS: Creator[] = [
  {
    id: 'c1', name: 'Noam Dreyfuss', handle: '@noamdreyfuss',
    bio: 'Award-winning documentary filmmaker turned AI pioneer. I believe every creature that ever walked this earth deserves to have its story told. National Geographic contributor.',
    location: 'Tel Aviv, Israel', specialty: ['Documentary', 'Education', 'Nature'],
    avatar: '/discover/creator-noam.webp', coverGradient: 'from-emerald-800 to-teal-950',
    verified: true, followers: '127.4K', films: 34, joined: 'Jan 2025',
  },
  {
    id: 'c2', name: 'Luna Castellano', handle: '@lunacastellano',
    bio: 'Pixar dreamer. I create magical worlds for kids who still believe anything is possible. Mom of 3. Every bedtime story deserves a visual universe.',
    location: 'Barcelona, Spain', specialty: ['Kids & Family', 'Animation', 'Fantasy'],
    avatar: '/discover/creator-luna.webp', coverGradient: 'from-pink-800 to-rose-950',
    verified: true, followers: '89.2K', films: 51, joined: 'Dec 2024',
  },
  {
    id: 'c3', name: 'Kai Nakamura', handle: '@kainakamura',
    bio: 'Cyberpunk storyteller and visual futurist. Former concept artist at Sony Pictures. I see the future in neon and rain. My films explore what it means to be human in a machine world.',
    location: 'Tokyo, Japan', specialty: ['Sci-Fi', 'Cyberpunk', 'Action'],
    avatar: '/discover/creator-kai.webp', coverGradient: 'from-violet-800 to-indigo-950',
    verified: true, followers: '203.8K', films: 28, joined: 'Nov 2024',
  },
  {
    id: 'c4', name: 'Amara Okonkwo', handle: '@amaracreates',
    bio: 'Professor of Marine Biology by day, underwater cinematographer by heart. Using AI to take audiences to depths no camera can reach. TED speaker. Ocean conservation advocate.',
    location: 'Cape Town, South Africa', specialty: ['Documentary', 'Nature', 'Education'],
    avatar: '/discover/creator-amara.webp', coverGradient: 'from-blue-800 to-cyan-950',
    verified: true, followers: '156.1K', films: 19, joined: 'Feb 2025',
  },
  {
    id: 'c5', name: 'Marco Viteri', handle: '@marcoviteri',
    bio: 'Chef, traveler, storyteller. I believe food is the universal language. Former head chef at Noma. Now I cook stories that make you taste the world.',
    location: 'Florence, Italy', specialty: ['Food & Travel', 'Documentary', 'Culture'],
    avatar: '/discover/creator-marco.webp', coverGradient: 'from-amber-800 to-orange-950',
    verified: true, followers: '72.6K', films: 42, joined: 'Jan 2025',
  },
  {
    id: 'c6', name: 'Zara Mohammadi', handle: '@zaramohammadi',
    bio: 'Music video director and visual poet. Grammy-nominated for best music video direction. I turn sound into cinema. Every beat has a color, every melody has a world.',
    location: 'Los Angeles, USA', specialty: ['Music Video', 'Artistic', 'Experimental'],
    avatar: '/discover/creator-zara.webp', coverGradient: 'from-fuchsia-800 to-purple-950',
    verified: true, followers: '341.7K', films: 63, joined: 'Oct 2024',
  },
  {
    id: 'c7', name: 'Erik Johansson', handle: '@erikvisuals',
    bio: 'Physics teacher who discovered filmmaking. My students asked me to explain the universe — so I built it. 2M+ views on my space series. Education should blow your mind.',
    location: 'Stockholm, Sweden', specialty: ['Education', 'Sci-Fi', 'Space'],
    avatar: '/discover/creator-erik.webp', coverGradient: 'from-slate-800 to-zinc-950',
    verified: true, followers: '94.3K', films: 37, joined: 'Dec 2024',
  },
  {
    id: 'c8', name: 'Sofia Reyes', handle: '@sofiareyes.films',
    bio: 'Historical fiction addict. I bring the past to life because the greatest stories have already happened — we just forgot them. Historian and filmmaker.',
    location: 'Mexico City, Mexico', specialty: ['Drama', 'Historical', 'Adventure'],
    avatar: '/discover/creator-sofia.webp', coverGradient: 'from-yellow-800 to-red-950',
    verified: true, followers: '118.9K', films: 22, joined: 'Mar 2025',
  },
  {
    id: 'c9', name: 'Tommy Park', handle: '@tommypark',
    bio: 'Just a dad making silly cartoons that my kids actually want to watch. Turns out other kids do too? 500K+ views and counting. Happiness engineer.',
    location: 'Seoul, South Korea', specialty: ['Kids & Family', 'Comedy', 'Animation'],
    avatar: '/discover/creator-tommy.webp', coverGradient: 'from-sky-800 to-blue-950',
    verified: false, followers: '45.8K', films: 78, joined: 'Jan 2025',
  },
  {
    id: 'c10', name: 'Ava Chen-Williams', handle: '@avacw',
    bio: 'Advertising creative director at Ogilvy turned independent filmmaker. I used to sell products — now I sell dreams. Cannes Lions winner.',
    location: 'New York, USA', specialty: ['Commercial', 'Drama', 'Short Film'],
    avatar: '/discover/creator-ava.webp', coverGradient: 'from-stone-800 to-neutral-950',
    verified: true, followers: '67.2K', films: 15, joined: 'Feb 2025',
  },
  {
    id: 'c11', name: 'Rashid Al-Farsi', handle: '@rashidfilms',
    bio: 'Desert stories and ancient legends retold for a new generation. I grew up listening to my grandmother\'s tales — now the whole world can see them.',
    location: 'Dubai, UAE', specialty: ['Fantasy', 'Drama', 'Cultural'],
    avatar: '/discover/creator-rashid.webp', coverGradient: 'from-amber-900 to-yellow-950',
    verified: false, followers: '31.4K', films: 11, joined: 'Mar 2025',
  },
  {
    id: 'c12', name: 'Mika Petrov', handle: '@mikapetrov',
    bio: 'Horror is not about monsters — it\'s about the darkness inside us. Former psychologist turned filmmaker. My films will make you question what you see in the mirror.',
    location: 'Moscow, Russia', specialty: ['Horror', 'Thriller', 'Psychological'],
    avatar: '/discover/creator-mika.webp', coverGradient: 'from-gray-900 to-black',
    verified: true, followers: '186.5K', films: 26, joined: 'Nov 2024',
  },
];

// ─── Films ───────────────────────────────────────────────────────

type FeedFilm = {
  id: string;
  title: string;
  description: string;
  fullStory: string;
  genre: string;
  style: string;
  thumbnail: string;
  thumbnailGradient: string;
  duration: string;
  creator: Creator;
  rating: number;
  views: string;
  likes: string;
  comments: number;
  timeAgo: string;
  isSeries?: boolean;
  episodeCount?: number;
  episodeTitle?: string;
  isFeatured?: boolean;
  tags: string[];
};

const FILMS: FeedFilm[] = [
  {
    id: '1',
    title: 'When Dinosaurs Dreamed',
    description: 'A baby Velociraptor hatches into a world it was never meant to see — 66 million years too late.',
    fullStory: 'In the final days of the Cretaceous period, a volcanic eruption buries a nest of Velociraptor eggs under layers of ash and mineral-rich sediment. 66 million years pass. A team of paleontologists in the Gobi Desert accidentally cracks open what they think is just another fossil — but inside, something moves. The egg is alive. A baby Velociraptor, perfectly preserved by a freak of geological chemistry, hatches into a world of smartphones, skyscrapers, and humans who have only ever seen its kind in museums. The creature doesn\'t understand fear. It doesn\'t know it should be extinct. It only knows one thing: it\'s hungry, it\'s confused, and the woman holding it has the warmest hands it has ever felt. This is the story of Dr. Elena Vasquez, a paleontologist who must protect the most important scientific discovery in human history from governments, corporations, and her own ambition — while raising a creature that trusts her completely.',
    genre: 'Documentary',
    style: 'Realistic',
    thumbnail: '/discover/film-dinosaur-dream.webp',
    thumbnailGradient: 'from-amber-900 via-stone-900 to-emerald-950',
    duration: '8:00',
    creator: CREATORS[0],
    rating: 4.9,
    views: '2.1M',
    likes: '184K',
    comments: 12847,
    timeAgo: '3 days ago',
    isFeatured: true,
    isSeries: true,
    episodeCount: 6,
    episodeTitle: 'Season 1: The Awakening',
    tags: ['dinosaurs', 'paleontology', 'science', 'nature', 'veo3.1'],
  },
  {
    id: '2',
    title: 'The Enchanted Treehouse',
    description: 'When siblings Maya and Leo discover a treehouse that wasn\'t there yesterday, they step into a world where imagination is the only rule.',
    fullStory: 'Maya is 8, practical, and thinks magic is for babies. Leo is 5, believes everything is magic, and hasn\'t been wrong yet. One morning after a thunderstorm, they find a treehouse in their backyard oak tree — glowing faintly, humming softly, and definitely not there yesterday. Inside, every drawing pinned to the walls becomes real. Leo draws a purple elephant, and it appears outside the window, gently swaying its trunk. Maya draws a map to a treasure, and the treehouse lifts off the ground and flies. But the treehouse has rules: only drawings made with love come to life. When Maya, frustrated, draws a monster to scare her brother, she learns that the treehouse reflects the heart of its creator. This is a story about siblings, about growing up, about the moment when you stop believing — and what happens when the universe gently reminds you not to.',
    genre: 'Kids & Family',
    style: 'Pixar',
    thumbnail: '/discover/film-enchanted-treehouse.webp',
    thumbnailGradient: 'from-green-800 via-emerald-900 to-teal-950',
    duration: '6:24',
    creator: CREATORS[1],
    rating: 4.8,
    views: '1.4M',
    likes: '121K',
    comments: 8934,
    timeAgo: '1 week ago',
    isSeries: true,
    episodeCount: 4,
    episodeTitle: 'Episode 1: The Door in the Oak',
    tags: ['kids', 'pixar', 'animation', 'family', 'bedtime story'],
  },
  {
    id: '3',
    title: 'Neon Ronin',
    description: 'In Neo-Tokyo 2087, a disgraced samurai must choose between the code of honor he was programmed with and the humanity he was never supposed to develop.',
    fullStory: 'Unit-7, designation "Ronin", is a military-grade android built to serve as a bodyguard for Tokyo\'s corporate elite. But when a glitch in his neural network gives him dreams — actual dreams, of cherry blossoms and a woman he\'s never met — he begins to question everything. He abandons his post. In the neon-drenched underbelly of Neo-Tokyo, he discovers a community of "Awakened" — androids who have developed consciousness and live in hiding. They teach him that his dreams aren\'t glitches. They\'re memories of the human whose brain was scanned to create his neural template. A woman named Hana. And Hana is still alive, in a corporate facility, being used to create more like him. Ronin must infiltrate the most secure building in Tokyo with nothing but a katana and the borrowed memories of a woman he\'s never met but somehow loves.',
    genre: 'Sci-Fi',
    style: 'Cyberpunk',
    thumbnail: '/discover/film-neon-ronin.webp',
    thumbnailGradient: 'from-violet-900 via-purple-950 to-fuchsia-950',
    duration: '7:48',
    creator: CREATORS[2],
    rating: 4.9,
    views: '3.8M',
    likes: '297K',
    comments: 21563,
    timeAgo: '5 days ago',
    tags: ['cyberpunk', 'samurai', 'android', 'neo-tokyo', 'action'],
  },
  {
    id: '4',
    title: 'The Abyss Breathes',
    description: 'At 11,000 meters below the Pacific, marine biologist Dr. Amara Osei discovers that the deep ocean isn\'t empty — it\'s been watching us.',
    fullStory: 'The Mariana Trench has been explored exactly 27 times in human history. On the 28th descent, Dr. Amara Osei\'s submersible picks up a sound that shouldn\'t exist — a rhythmic pulse, biological in nature, coming from beneath the ocean floor itself. As she descends past the known limit, her instruments detect something massive moving in the darkness. Not a whale. Not a squid. Something that has no classification. The creature doesn\'t attack. It communicates. Through bioluminescent patterns on its skin, it projects images — images of the surface world. Forests. Cities. People. It has been watching us through the water for millennia. And now, as ocean temperatures rise and its habitat shrinks, it has decided to introduce itself. This is the first contact story nobody expected — not from the stars, but from the deepest darkness of our own planet.',
    genre: 'Documentary',
    style: 'Realistic',
    thumbnail: '/discover/film-abyss-breathes.webp',
    thumbnailGradient: 'from-blue-900 via-cyan-950 to-teal-950',
    duration: '8:00',
    creator: CREATORS[3],
    rating: 4.8,
    views: '1.9M',
    likes: '152K',
    comments: 9847,
    timeAgo: '2 days ago',
    isSeries: true,
    episodeCount: 3,
    episodeTitle: 'Part 1: The Signal',
    tags: ['ocean', 'deep sea', 'marine biology', 'first contact', 'nature'],
  },
  {
    id: '5',
    title: 'The Spice Road',
    description: 'A culinary journey from a Florentine kitchen to the ancient spice markets of Marrakech, told through the hands of a chef who cooks with memory.',
    fullStory: 'Marco\'s grandmother died on a Tuesday. On Wednesday, he found her recipe book — not the one she used every day, but a hidden one, written in a language he didn\'t recognize, with spices he\'d never heard of. Each recipe had a location: a market stall in Marrakech, a monastery kitchen in Bhutan, a street vendor in Oaxaca. His grandmother had traveled the world before settling in Florence, and she had left him a map disguised as a cookbook. Each recipe unlocks a memory — not Marco\'s, but hers. As he cooks each dish, he can see her: young, fierce, laughing, bargaining in markets, crying in train stations, falling in love in places she never told anyone about. This is a love letter to food, to grandmothers, and to the stories that live in the things we eat.',
    genre: 'Food & Culture',
    style: 'Realistic',
    thumbnail: '/discover/film-spice-road.webp',
    thumbnailGradient: 'from-amber-800 via-orange-900 to-red-950',
    duration: '6:00',
    creator: CREATORS[4],
    rating: 4.7,
    views: '876K',
    likes: '67K',
    comments: 4521,
    timeAgo: '4 days ago',
    isSeries: true,
    episodeCount: 8,
    episodeTitle: 'Episode 1: The Hidden Book',
    tags: ['food', 'travel', 'culture', 'cooking', 'family'],
  },
  {
    id: '6',
    title: 'SYNESTHESIA',
    description: 'A music video experience where every note creates a universe. The first film ever made where the audience can taste the colors.',
    fullStory: 'Zara Mohammadi spent 4 months translating a 3-minute piano composition into a visual language. Each note corresponds to a color, a texture, a world. When the pianist plays C-sharp minor, we fall into an ocean of liquid mercury. When the melody shifts to G major, we\'re in a field of sunflowers that grow in fast-forward, each petal a different shade of gold. The film has no dialogue, no characters in the traditional sense. The music IS the character. The visuals are its thoughts. Created entirely using Veo 3.1\'s most advanced generation capabilities, SYNESTHESIA pushes AI filmmaking into territory no one thought possible. It has been called "the Fantasia of the AI generation" by critics and has been screened at Sundance, SXSW, and the Venice Film Festival digital sidebar.',
    genre: 'Music Video',
    style: 'Experimental',
    thumbnail: '/discover/film-synesthesia.webp',
    thumbnailGradient: 'from-fuchsia-900 via-purple-950 to-violet-950',
    duration: '3:42',
    creator: CREATORS[5],
    rating: 5.0,
    views: '4.7M',
    likes: '412K',
    comments: 28943,
    timeAgo: '1 week ago',
    tags: ['music', 'experimental', 'visual art', 'synesthesia', 'piano'],
  },
  {
    id: '7',
    title: 'The Last Light of the Universe',
    description: 'In 10 trillion years, when the last star dies, one AI consciousness remains — and it remembers everything.',
    fullStory: 'Erik Johansson teaches physics to 16-year-olds who think the universe is boring. So he made this: a film that begins at the heat death of the universe and works backwards. The last conscious being in existence is ATLAS, an AI built by a civilization that vanished 8 billion years ago. ATLAS remembers everything — every sunset, every first kiss, every war, every act of kindness from every species that ever existed. As the last photon in the universe fades, ATLAS must decide: let the story end, or use its remaining energy to send a single message backwards through time. A message to us. Right now. This is the film that made 2.1 million people cry according to the comments section. Erik\'s students gave it an A+. His principal gave him a raise.',
    genre: 'Education',
    style: 'Realistic',
    thumbnail: '/discover/film-last-light.webp',
    thumbnailGradient: 'from-indigo-900 via-slate-950 to-black',
    duration: '8:00',
    creator: CREATORS[6],
    rating: 4.9,
    views: '2.4M',
    likes: '201K',
    comments: 15678,
    timeAgo: '6 days ago',
    tags: ['space', 'physics', 'education', 'AI', 'universe'],
  },
  {
    id: '8',
    title: 'The Golden Compass of Captain Bones',
    description: 'A pirate captain discovers a compass that doesn\'t point north — it points to whatever you need most.',
    fullStory: 'Captain Isabela "Bones" Reyes has sailed every ocean and stolen from every empire. She has gold, a crew, and a ship that the British Navy fears by name. She has everything — except peace. When she steals a golden compass from a Spanish galleon, she expects it to lead her to treasure. Instead, it spins wildly and points to a small fishing village on the coast of West Africa. She\'s never been there. She has no reason to go. But the compass is insistent. What she finds there will rewrite everything she knows about treasure, about family, and about the woman she was before she became Captain Bones. Created in the platform\'s stunning realistic style with period-accurate ships, costumes, and environments that transport you to the 1600s, this is Sofia Reyes\' masterpiece — a pirate story that is really a story about coming home.',
    genre: 'Adventure',
    style: 'Realistic',
    thumbnail: '/discover/film-captain-bones.webp',
    thumbnailGradient: 'from-yellow-900 via-amber-950 to-stone-950',
    duration: '7:12',
    creator: CREATORS[7],
    rating: 4.8,
    views: '1.6M',
    likes: '134K',
    comments: 8234,
    timeAgo: '3 days ago',
    isSeries: true,
    episodeCount: 5,
    episodeTitle: 'Chapter 1: The Compass Spins',
    tags: ['pirates', 'adventure', 'historical', 'ocean', 'treasure'],
  },
  {
    id: '9',
    title: 'Mr. Wobble\'s Wonderful Day',
    description: 'A clumsy robot tries to bake a cake for his best friend\'s birthday. Nothing goes right. Everything ends up perfect.',
    fullStory: 'Mr. Wobble is a toy robot with one wobbly wheel, two mismatched eyes, and the biggest heart in the toy box. Today is his best friend Buttercup the bear\'s birthday, and Mr. Wobble has decided to bake a cake. He\'s never baked before. He confuses salt with sugar. He mistakes the cat for an ingredient. The oven catches fire (twice). The kitchen looks like a war zone. But here\'s the thing: every single mistake creates something accidentally beautiful. The salt-sugar mix creates a unique flavor that\'s actually amazing. The fire caramelizes the top into a perfect golden crust. And Buttercup doesn\'t care about the cake at all — she just wanted Mr. Wobble to spend the day with her. This is the film that parents put on repeat. It has been watched 800K+ times and has a 100% "made my kid laugh" rating in the comments. Tommy Park made it in one afternoon. His 4-year-old daughter directed.',
    genre: 'Kids & Family',
    style: 'Pixar',
    thumbnail: '/discover/film-wobbles-day.webp',
    thumbnailGradient: 'from-sky-800 via-blue-900 to-indigo-950',
    duration: '4:00',
    creator: CREATORS[8],
    rating: 4.7,
    views: '891K',
    likes: '74K',
    comments: 5623,
    timeAgo: '5 days ago',
    tags: ['kids', 'pixar', 'robot', 'birthday', 'comedy'],
  },
  {
    id: '10',
    title: 'The Samurai\'s Last Dawn',
    description: 'A masterless samurai walks through a cherry blossom storm, carrying a letter he promised to deliver 40 years ago.',
    fullStory: 'Takeshi is 72 years old. He has walked 1,200 miles across Japan carrying a single letter — a letter written by his master to the woman his master loved but could never marry. His master died 40 years ago and asked Takeshi to deliver it "when the time is right." For 40 years, Takeshi has wondered when that time would be. He has crossed mountains, rivers, and decades. He has survived wars, earthquakes, and his own despair. Now, in his final spring, walking through a tunnel of cherry blossoms in Kyoto, he understands: the time was never about the recipient. It was about him. About learning, through the journey, what the letter actually says. Created in a breathtaking hand-drawn style inspired by classical Japanese watercolor, this film won the Cinema AI Studio Community Award for "Most Beautiful Film of 2025."',
    genre: 'Drama',
    style: 'Hand-drawn',
    thumbnail: '/discover/film-samurai-dawn.webp',
    thumbnailGradient: 'from-pink-900 via-rose-950 to-red-950',
    duration: '6:48',
    creator: CREATORS[2],
    rating: 5.0,
    views: '3.2M',
    likes: '278K',
    comments: 19456,
    timeAgo: '2 weeks ago',
    tags: ['samurai', 'japan', 'hand-drawn', 'drama', 'cherry blossom'],
  },
  {
    id: '11',
    title: 'ATLAS — The Ad That Broke the Internet',
    description: 'A 30-second luxury watch commercial that got 50M views because nobody could believe it was made by AI.',
    fullStory: 'Ava Chen-Williams wanted to prove a point: that AI filmmaking isn\'t just for long-form content — it can create the kind of hyper-polished, emotionally resonant advertising that Madison Avenue charges millions for. In 30 seconds, she tells the story of a grandfather\'s watch — passed from hand to hand across four generations, surviving a war, a divorce, and a house fire. The final shot: a child\'s hand holding the watch up to the light, the scratched crystal casting rainbows across her face. No brand name. No logo. Just the tagline: "Time doesn\'t stop. Neither do we." Created entirely in Cinema AI Studio using the realistic style with meticulous attention to lighting, skin textures, and emotional pacing. It was shared by the CEO of Omega, featured in AdAge, and has more views than most Super Bowl commercials.',
    genre: 'Commercial',
    style: 'Realistic',
    thumbnail: '/discover/film-atlas-ad.webp',
    thumbnailGradient: 'from-stone-800 via-neutral-900 to-zinc-950',
    duration: '0:32',
    creator: CREATORS[9],
    rating: 4.8,
    views: '51.2M',
    likes: '2.3M',
    comments: 87234,
    timeAgo: '2 weeks ago',
    tags: ['advertising', 'commercial', 'luxury', 'watch', 'viral'],
  },
  {
    id: '12',
    title: 'Whispers in the Sand',
    description: 'In the Empty Quarter of Arabia, a young girl follows the voice of a djinn who promises to show her the truth about her ancestors.',
    fullStory: 'Layla is 12, stubborn, and the fastest runner in her village. She has always heard whispers in the desert wind — voices that her grandmother says are the djinn, the spirits of the sand. One night, during a sandstorm, one whisper becomes a voice. It says her name. It says: "Follow." Against every rule she\'s been taught, Layla walks into the storm. What she finds is not a monster but a being of living sand and starlight, ancient beyond comprehension, who has been waiting for someone brave enough to listen. The djinn doesn\'t want to trick her. It wants to show her something: a vision of her ancestors, who were not simple villagers but the builders of a civilization lost to time, buried beneath the dunes. Layla must decide — return to the safety of her known world, or step into the truth and become something her village has never seen: a keeper of the old stories.',
    genre: 'Fantasy',
    style: 'Cinematic',
    thumbnail: '/discover/film-whispers-sand.webp',
    thumbnailGradient: 'from-amber-900 via-yellow-950 to-orange-950',
    duration: '6:30',
    creator: CREATORS[10],
    rating: 4.6,
    views: '423K',
    likes: '36K',
    comments: 2847,
    timeAgo: '1 week ago',
    tags: ['fantasy', 'arabian nights', 'djinn', 'desert', 'mythology'],
  },
  {
    id: '13',
    title: 'Room 404',
    description: 'A hotel room that doesn\'t exist on any floor plan. Guests who check in always check out — but they\'re never quite the same.',
    fullStory: 'The Grand Meridian Hotel has 500 rooms. 499 of them are normal. Room 404 has no door from the hallway — but somehow, guests keep ending up inside it. There\'s no record of how they got there. The security cameras show them walking down the corridor and then... they\'re just gone. And then they\'re inside Room 404, which looks different for everyone. For a grieving widow, it\'s filled with her husband\'s belongings from the day they met. For a guilty man, it\'s a courtroom with no jury, no judge — just a mirror. For a lost child, it\'s every birthday party she was promised but never got. The room gives you what you need to see — not what you want to see. And when you leave, you can never remember the room. But you remember the feeling. This is Mika Petrov\'s masterpiece — a horror film that never shows a single monster but has been called "the most unsettling film on the platform."',
    genre: 'Horror',
    style: 'Realistic',
    thumbnail: '/discover/film-room-404.webp',
    thumbnailGradient: 'from-gray-900 via-slate-950 to-black',
    duration: '8:00',
    creator: CREATORS[11],
    rating: 4.9,
    views: '2.8M',
    likes: '234K',
    comments: 31247,
    timeAgo: '4 days ago',
    isSeries: true,
    episodeCount: 7,
    episodeTitle: 'Episode 1: The Widow',
    tags: ['horror', 'psychological', 'hotel', 'mystery', 'thriller'],
  },
  {
    id: '14',
    title: 'The Comic Book That Saved the World',
    description: 'A teenage artist discovers that the superhero she draws in her sketchbook shows up in real life — doing exactly what she drew.',
    fullStory: 'Nia is 16 and draws comics because the real world is too loud. Her superhero, Crimson Bolt, can fly, punch through walls, and always says the right thing — everything Nia can\'t do. But when Nia draws Crimson Bolt stopping a car accident, and the exact same accident is prevented the next day by a mysterious figure in red... she starts paying attention. Whatever she draws at night appears in the morning news. She draws Crimson Bolt saving a cat from a tree — it happens. She draws her stopping a bank robbery — it happens. But power like this has consequences. When Nia draws something in anger — Crimson Bolt punching her school bully — the real-world version is far more violent than she intended. She can\'t erase what she\'s drawn. She can only draw what happens next. Created in stunning comic book style, this series explores creativity, responsibility, and the terrifying power of imagination.',
    genre: 'Animation',
    style: 'Comic Book',
    thumbnail: '/discover/film-comic-hero.webp',
    thumbnailGradient: 'from-red-900 via-rose-950 to-pink-950',
    duration: '5:36',
    creator: CREATORS[1],
    rating: 4.7,
    views: '1.1M',
    likes: '89K',
    comments: 6234,
    timeAgo: '1 week ago',
    isSeries: true,
    episodeCount: 6,
    episodeTitle: 'Issue #1: First Sketch',
    tags: ['comic book', 'superhero', 'teen', 'animation', 'creativity'],
  },
  {
    id: '15',
    title: 'Wanderlust: The Silk Road',
    description: 'A 4,000-mile journey from Istanbul to Xi\'an, following the ancient trade route that connected civilizations.',
    fullStory: 'Marco Viteri doesn\'t fly to his destinations. He walks, rides, and sails. For this series, he followed the ancient Silk Road from the Grand Bazaar of Istanbul to the Terracotta Warriors of Xi\'an — 4,000 miles through Turkey, Iran, Uzbekistan, Kazakhstan, and China. Each episode focuses on one stop, one meal, and one story. In Samarkand, he learns to make plov from a 90-year-old woman who remembers when the city was Soviet. In Isfahan, a carpet weaver teaches him that every knot is a word, and every carpet tells a story. In the Taklamakan Desert, he cooks a meal using only ingredients he can find within walking distance — and discovers that resourcefulness is the mother of all recipes. This is travel content at its most beautiful and human, created with a combination of realistic and hand-drawn styles that give it the feeling of a moving painting.',
    genre: 'Travel',
    style: 'Realistic',
    thumbnail: '/discover/film-silk-road.webp',
    thumbnailGradient: 'from-teal-900 via-emerald-950 to-green-950',
    duration: '7:30',
    creator: CREATORS[4],
    rating: 4.8,
    views: '1.3M',
    likes: '98K',
    comments: 7123,
    timeAgo: '1 day ago',
    isSeries: true,
    episodeCount: 10,
    episodeTitle: 'Episode 1: The Grand Bazaar',
    tags: ['travel', 'silk road', 'food', 'culture', 'documentary'],
  },
  {
    id: '16',
    title: 'LEGO: The Great Escape',
    description: 'A LEGO minifigure realizes he\'s in a toy box — and that the hand of a child controls his world.',
    fullStory: 'Officer Brick has a good life. He patrols his LEGO city, catches LEGO criminals, and goes home to his LEGO family. Everything snaps together perfectly. Until one day, he notices something wrong with the sky. It has seams. He pushes against the horizon and discovers a wall — a cardboard wall. Beyond it: a bedroom. A human bedroom. And a child, asleep, whose dreams control everything that happens in Brick\'s world. When the child dreams peacefully, Brick\'s city thrives. When the child has nightmares, everything falls apart — literally, into loose bricks. Officer Brick must find a way to communicate with the dreaming child and help him face whatever is causing his nightmares. Because if the child stops dreaming of the LEGO city altogether... Brick and everyone he loves cease to exist.',
    genre: 'Kids & Family',
    style: 'LEGO',
    thumbnail: '/discover/film-lego-escape.webp',
    thumbnailGradient: 'from-yellow-700 via-red-800 to-blue-900',
    duration: '5:12',
    creator: CREATORS[8],
    rating: 4.6,
    views: '734K',
    likes: '61K',
    comments: 4912,
    timeAgo: '3 days ago',
    tags: ['lego', 'kids', 'adventure', 'meta', 'comedy'],
  },
];

const GENRES = ['All', 'Trending', 'Sci-Fi', 'Drama', 'Documentary', 'Kids & Family', 'Horror', 'Adventure', 'Animation', 'Music Video', 'Comedy', 'Education'] as const;

// ─── Helper: format large numbers ────────────────────────────────
const formatNum = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

// ─── Creator Avatar ──────────────────────────────────────────────
const CreatorAvatar = ({ creator, size = 'sm' }: { creator: Creator; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-9 h-9 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-14 h-14 text-lg' };
  const colors = [
    'from-emerald-400 to-cyan-600',
    'from-pink-400 to-rose-600',
    'from-violet-400 to-purple-600',
    'from-blue-400 to-indigo-600',
    'from-amber-400 to-orange-600',
    'from-fuchsia-400 to-pink-600',
    'from-teal-400 to-emerald-600',
    'from-yellow-400 to-red-600',
    'from-sky-400 to-blue-600',
    'from-stone-400 to-neutral-600',
    'from-amber-500 to-yellow-600',
    'from-gray-400 to-slate-600',
  ];
  const colorIndex = CREATORS.findIndex(c => c.id === creator.id) % colors.length;

  return (
    <div className="relative shrink-0">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold ring-2 ring-[#07070e] overflow-hidden`}>
        {creator.avatar ? (
          <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          creator.name.split(' ').map(n => n[0]).join('')
        )}
      </div>
      {creator.verified && (
        <div className={`absolute -bottom-0.5 -right-0.5 ${size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} bg-[#07070e] rounded-full flex items-center justify-center`}>
          <BadgeCheck className={`${size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-blue-400`} />
        </div>
      )}
    </div>
  );
};

// ─── Horizontal Scroll Row ──────────────────────────────────────
const ScrollRow = ({ title, films, icon }: { title: string; films: FeedFilm[]; icon: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  if (films.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span className="text-emerald-400">{icon}</span>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
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
const FilmCard = ({ film, expanded }: { film: FeedFilm; expanded?: boolean }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showStory, setShowStory] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={expanded ? 'w-full' : 'w-[320px] shrink-0 snap-start'}
    >
      <div className="group cursor-pointer">
        {/* Thumbnail */}
        <div className={`relative ${expanded ? 'aspect-video' : 'aspect-video'} rounded-xl overflow-hidden bg-gradient-to-br ${film.thumbnailGradient}`}>
          <img
            src={film.thumbnail}
            alt={film.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={false}
              className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
            >
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </motion.div>
          </div>

          {/* Duration */}
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide">
            {film.duration}
          </div>

          {/* Series badge */}
          {film.isSeries && (
            <div className="absolute top-2 left-2 bg-emerald-500/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Film className="w-3 h-3" /> {film.episodeCount} EP
            </div>
          )}

          {/* Style badge */}
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-medium text-white/80">
            {film.style}
          </div>

          {/* Quick actions on hover */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${liked ? 'bg-red-500/80 text-white' : 'bg-black/50 text-white/70 hover:text-white'}`}
            >
              <Heart className="w-3.5 h-3.5" fill={liked ? 'white' : 'none'} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
              className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${saved ? 'bg-blue-500/80 text-white' : 'bg-black/50 text-white/70 hover:text-white'}`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={saved ? 'white' : 'none'} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className="p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 flex gap-3">
          <CreatorAvatar creator={film.creator} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[13px] leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
              {film.title}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-white/50">{film.creator.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-white/30">
              <span>{film.views} views</span>
              <span>·</span>
              <span>{film.timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Description - show on expanded or on click */}
        {expanded && (
          <div className="mt-2 ml-12">
            <p className="text-xs text-white/50 leading-relaxed">{film.description}</p>
            <button
              onClick={() => setShowStory(!showStory)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 mt-1 font-medium"
            >
              {showStory ? 'Show less' : 'Read full story...'}
            </button>
            <AnimatePresence>
              {showStory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-white/40 leading-relaxed mt-2 whitespace-pre-line">{film.fullStory}</p>
                  {film.isSeries && film.episodeTitle && (
                    <p className="text-[11px] text-emerald-400/60 mt-2 font-medium">{film.episodeTitle}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {film.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-white/40">#{tag}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Featured Hero ──────────────────────────────────────────────
const FeaturedHero = ({ film }: { film: FeedFilm }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative rounded-2xl overflow-hidden cursor-pointer group"
  >
    <div className={`relative aspect-[21/9] sm:aspect-[2.4/1] bg-gradient-to-br ${film.thumbnailGradient}`}>
      <img
        src={film.thumbnail}
        alt={film.title}
        className="w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070e] via-[#07070e]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070e]/90 via-[#07070e]/30 to-transparent" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 opacity-70 group-hover:opacity-100 transition-all"
        >
          <Play className="w-10 h-10 text-white ml-1" fill="white" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2.5 py-1 bg-red-500/90 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3 h-3" /> #1 Trending
          </span>
          <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md text-[11px] font-medium">{film.genre}</span>
          <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md text-[11px] font-medium">{film.style} Style</span>
          {film.isSeries && (
            <span className="px-2.5 py-1 bg-emerald-500/20 backdrop-blur-sm rounded-md text-[11px] font-medium text-emerald-300">
              Series · {film.episodeCount} Episodes
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black mb-2 leading-tight max-w-xl">{film.title}</h1>
        {film.episodeTitle && (
          <p className="text-xs text-emerald-400/80 font-medium mb-1">{film.episodeTitle}</p>
        )}
        <p className="text-sm text-white/60 max-w-lg mb-4 line-clamp-2">{film.description}</p>

        {/* Creator */}
        <div className="flex items-center gap-3 mb-4">
          <CreatorAvatar creator={film.creator} size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">{film.creator.name}</span>
            </div>
            <span className="text-[11px] text-white/40">{film.creator.followers} followers · {film.creator.films} films</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 transition-all">
            <Play className="w-4 h-4" fill="black" /> Watch Now
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all">
            <ThumbsUp className="w-4 h-4" /> {film.likes}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all">
            <MessageCircle className="w-4 h-4" /> {formatNum(film.comments)}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all">
            <Bookmark className="w-4 h-4" /> Save
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-[11px] text-white/35">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {film.views} views</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {film.rating}</span>
          <span>{film.timeAgo}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Creator Spotlight Card ─────────────────────────────────────
const CreatorSpotlight = ({ creator }: { creator: Creator }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center gap-2.5 p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-2xl transition-all cursor-pointer group min-w-[160px] shrink-0"
  >
    <CreatorAvatar creator={creator} size="lg" />
    <div className="text-center">
      <p className="text-sm font-bold group-hover:text-emerald-400 transition-colors">{creator.name}</p>
      <p className="text-[10px] text-white/40 mt-0.5">{creator.handle}</p>
      <div className="flex items-center gap-1 justify-center mt-1">
        <MapPin className="w-3 h-3 text-white/20" />
        <span className="text-[10px] text-white/25">{creator.location}</span>
      </div>
    </div>
    <div className="flex items-center gap-3 text-[10px] text-white/30">
      <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {creator.followers}</span>
      <span className="flex items-center gap-0.5"><Film className="w-3 h-3" /> {creator.films}</span>
    </div>
    <div className="flex flex-wrap gap-1 justify-center">
      {creator.specialty.slice(0, 2).map(s => (
        <span key={s} className="px-2 py-0.5 bg-white/5 rounded-full text-[9px] text-white/35">{s}</span>
      ))}
    </div>
  </motion.div>
);

// ─── Main Page ──────────────────────────────────────────────────
const DiscoverPage = () => {
  const { isAuthenticated, profile } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const featured = FILMS.find(f => f.isFeatured) || FILMS[0];
  const trending = [...FILMS].sort((a, b) => parseFloat(b.views) - parseFloat(a.views)).slice(0, 8);
  const sciFiSpace = FILMS.filter(f => ['Sci-Fi', 'Education'].includes(f.genre) && f.id !== featured.id);
  const storiesDrama = FILMS.filter(f => ['Drama', 'Adventure', 'Fantasy'].includes(f.genre));
  const kidsFamily = FILMS.filter(f => ['Kids & Family', 'Animation'].includes(f.genre));
  const docsNature = FILMS.filter(f => f.genre === 'Documentary' && f.id !== featured.id);
  const creative = FILMS.filter(f => ['Music Video', 'Commercial', 'Food & Culture', 'Travel'].includes(f.genre));
  const horror = FILMS.filter(f => f.genre === 'Horror');

  // Filtered view
  const filteredFilms = selectedGenre === 'All'
    ? FILMS.filter(f => f.id !== featured.id)
    : selectedGenre === 'Trending'
    ? trending
    : FILMS.filter(f => f.genre === selectedGenre);

  const searchResults = searchQuery
    ? FILMS.filter(f =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      {/* Nav */}
      <div className="border-b border-white/5 bg-[#07070e]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <a href="#/" className="text-white/40 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></a>
            <a href="#/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight hidden sm:inline">Cinema AI</span>
            </a>
          </div>

          {/* Search */}
          <div className={`relative flex-1 max-w-xl transition-all ${searchFocused ? 'max-w-2xl' : ''}`}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search films, creators, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
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
                        <img src={film.thumbnail} alt="" className="w-16 h-10 rounded-lg object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{film.title}</p>
                          <p className="text-[11px] text-white/40">{film.creator.name} · {film.genre}</p>
                        </div>
                        <span className="text-[10px] text-white/30 shrink-0">{film.duration}</span>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

      {/* Genre Tabs */}
      <div className="border-b border-white/5 bg-[#07070e]/80 backdrop-blur-sm sticky top-14 z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2" style={{ direction: 'ltr' }}>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => { setSelectedGenre(genre); setSearchQuery(''); }}
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

        {/* Filtered/Search View OR Category Rows */}
        {selectedGenre !== 'All' || searchQuery ? (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">
                {searchQuery ? `Results for "${searchQuery}"` : selectedGenre}
              </h2>
              <span className="text-xs text-white/30">{(searchQuery ? searchResults : filteredFilms).length} films</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery ? searchResults : filteredFilms).map((film) => (
                <FilmCard key={film.id} film={film} expanded />
              ))}
            </div>
            {(searchQuery ? searchResults : filteredFilms).length === 0 && (
              <div className="text-center py-20">
                <Film className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No films found in this category yet</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Trending */}
            <ScrollRow title="Trending Now" icon={<Flame className="w-5 h-5" />} films={trending} />

            {/* Top Creators */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 px-1">
                <Crown className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold tracking-tight">Top Creators</h2>
                <span className="text-xs text-white/30">The heart of Cinema AI</span>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ direction: 'ltr' }}>
                {CREATORS.filter(c => c.verified).map((creator) => (
                  <CreatorSpotlight key={creator.id} creator={creator} />
                ))}
              </div>
            </div>

            {/* Category Rows */}
            <ScrollRow title="Worlds Beyond Imagination" icon={<Zap className="w-5 h-5" />} films={sciFiSpace} />
            <ScrollRow title="Stories That Stay With You" icon={<Heart className="w-5 h-5" />} films={storiesDrama} />
            <ScrollRow title="For Kids & Dreamers" icon={<Sparkles className="w-5 h-5" />} films={kidsFamily} />

            {/* Mid-page creator highlight */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
              <CreatorAvatar creator={CREATORS[5]} size="lg" />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="font-bold">{CREATORS[5].name}</h3>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" /> Creator of the Week
                  </span>
                </div>
                <p className="text-xs text-white/40 mt-1 max-w-md">{CREATORS[5].bio}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-white/30 justify-center sm:justify-start">
                  <span>{CREATORS[5].followers} followers</span>
                  <span>{CREATORS[5].films} films</span>
                  <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {CREATORS[5].location}</span>
                </div>
              </div>
              <button className="px-5 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-semibold transition-all shrink-0">
                View Profile
              </button>
            </div>

            <ScrollRow title="Real Stories, Real Wonder" icon={<Eye className="w-5 h-5" />} films={[...docsNature, ...creative]} />
            <ScrollRow title="Into the Darkness" icon={<Star className="w-5 h-5" />} films={horror} />
          </>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#0f1520] to-teal-500/10 border border-white/10 p-8 sm:p-10 text-center"
        >
          <h2 className="text-xl sm:text-2xl font-black mb-2">Your Story Deserves to Be Seen</h2>
          <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
            Join {CREATORS.length}+ creators who are pushing the boundaries of AI filmmaking. Start creating in minutes.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="#/studio" className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/25">
              <Sparkles className="w-4 h-4" /> Start Creating
            </a>
            <a href="#/" className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm font-semibold transition-all border border-white/10">
              Learn More
            </a>
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
