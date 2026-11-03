import React, { useRef, useState, useEffect } from 'react';

export interface ReelItem {
  id: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  handle: string;
  productName: string;
  productPrice?: string;
  productUrl?: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: 'reel-1',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793695623/Video-39764.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793695623/Video-39764.jpg',
    caption: 'unboxing our bestselling sunflower bouquet',
    handle: '@knotsnco.',
    productName: 'Sunflower Bouquet',
    productPrice: '₹1,299',
    productUrl: '#bestsellers',
  },
  {
    id: 'reel-2',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793695675/Video-54767.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793695675/Video-54767.jpg',
    caption: 'styling cute handmade daisy hair clips',
    handle: '@knotsnco.',
    productName: 'Daisy Hair Clips',
    productPrice: '₹349',
    productUrl: '#bestsellers',
  },
  {
    id: 'reel-3',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793695836/Video-42975.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793695836/Video-42975.jpg',
    caption: 'meet the squishiest cuddly bunny plushie',
    handle: '@knotsnco.',
    productName: 'Cozy Bunny Plushie',
    productPrice: '₹1,499',
    productUrl: '#bestsellers',
  },
  {
    id: 'reel-4',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793695892/Video-20019.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793695892/Video-20019.jpg',
    caption: 'forever blooming pastel tulip stems for your vase',
    handle: '@knotsnco.',
    productName: 'Tulip Stems Set',
    productPrice: '₹899',
    productUrl: '#bestsellers',
  },
  {
    id: 'reel-5',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793696005/Video-50450.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793696005/Video-50450.jpg',
    caption: 'packing an order with our sunflower granny tote',
    handle: '@knotsnco.',
    productName: 'Sunflower Tote Bag',
    productPrice: '₹1,699',
    productUrl: '#bestsellers',
  },
  {
    id: 'reel-6',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793696064/Video-71689.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793696064/Video-71689.jpg',
    caption: 'tiny crochet sunflower keychains for your keys',
    handle: '@knotsnco.',
    productName: 'Sunflower Keychain',
    productPrice: '₹299',
    productUrl: '#bestsellers',
  },
  {
    id: 'reel-7',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793696157/Video-54217.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793696157/Video-54217.jpg',
    caption: 'cute mini daisy flower pot desk companion',
    handle: '@knotsnco.',
    productName: 'Daisy Flower Pot',
    productPrice: '₹799',
    productUrl: '#bestsellers',
  },
  {
    id: 'reel-8',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793696239/Video-14511.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793696239/Video-14511.jpg',
    caption: 'fairytale mushroom cottage trinket house',
    handle: '@knotsnco.',
    productName: 'Mushroom Cottage',
    productPrice: '₹949',
    productUrl: '#bestsellers',
  },
  {
    id: 'reel-9',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793696297/Video-82506.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793696297/Video-82506.jpg',
    caption: 'soft pastel crochet bow clips for daily styling',
    handle: '@knotsnco.',
    productName: 'Pastel Bow Clips',
    productPrice: '₹249',
    productUrl: '#bestsellers',
  },
  {
    id: 'reel-10',
    videoUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/q_auto,f_auto/v1793696367/Video-60099.mp4',
    posterUrl: 'https://res.cloudinary.com/dnxaxhqr/video/upload/so_0,f_auto,q_auto/v1793696367/Video-60099.jpg',
    caption: 'wrapping our festive special crochet gift box',
    handle: '@knotsnco.',
    productName: 'Festive Gift Box',
    productPrice: '₹1,899',
    productUrl: '#bestsellers',
  },
];

export const ReelsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Playing state per reel (all start playing by default)
  const [playingStates, setPlayingStates] = useState<{ [key: string]: boolean }>(() =>
    REELS_DATA.reduce((acc, reel) => ({ ...acc, [reel.id]: true }), {})
  );

  // Active unmuted reel (null means all are muted)
  const [unmutedReelId, setUnmutedReelId] = useState<string | null>(null);

  // Auto-play all videos on mount
  useEffect(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Browsers may block if user hasn't interacted, muted ensures smooth autoplay
          });
        }
      }
    });
  }, []);

  const togglePlay = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlayingStates((prev) => ({ ...prev, [id]: true }));
    } else {
      video.pause();
      setPlayingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    if (unmutedReelId === id) {
      // Mute this reel
      video.muted = true;
      setUnmutedReelId(null);
    } else {
      // Mute all others first
      Object.entries(videoRefs.current).forEach(([k, v]) => {
        if (v) v.muted = k !== id;
      });
      video.muted = false;
      setUnmutedReelId(id);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-[#FAF4ED] py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching Reference 1 (media_1793693473509_aa9fe40d.jpg) */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          {/* Left Title: "from our community ♡" */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#641623] tracking-tight lowercase">
              from our community
            </h2>
            {/* Outline Heart SVG matching reference ♡ */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#641623] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>

          {/* Right Link: Instagram Icon + @knotsnco. */}
          <a
            href="https://www.instagram.com/knotsnco._/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 sm:gap-2.5 text-[#641623] font-semibold text-sm sm:text-base md:text-lg hover:opacity-80 transition-all duration-200 py-1 px-2.5 rounded-full hover:bg-[#641623]/5"
            aria-label="Visit knotsnco on Instagram"
          >
            {/* Instagram Camera Icon SVG */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-full h-full text-[#641623] transition-transform duration-200 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <span className="tracking-tight group-hover:underline decoration-1 underline-offset-4">
              @knotsnco.
            </span>
          </a>
        </div>

        {/* Carousel Container with Side Controls */}
        <div className="relative group/carousel">
          {/* Previous Arrow Button */}
          <button
            onClick={scrollLeft}
            type="button"
            aria-label="Previous reels"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(100,22,35,0.12)] border border-[#641623]/15 text-[#641623] flex items-center justify-center hover:bg-[#641623] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next Arrow Button */}
          <button
            onClick={scrollRight}
            type="button"
            aria-label="Next reels"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(100,22,35,0.12)] border border-[#641623]/15 text-[#641623] flex items-center justify-center hover:bg-[#641623] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Horizontal Scrolling Reels Row */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 no-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {REELS_DATA.map((reel) => {
              const isPlaying = playingStates[reel.id] ?? true;
              const isUnmuted = unmutedReelId === reel.id;

              return (
                <div
                  key={reel.id}
                  className="flex-shrink-0 w-[240px] sm:w-[270px] md:w-[290px] h-[426px] sm:h-[480px] md:h-[515px] relative rounded-[22px] overflow-hidden bg-[#2D2424]/5 border-2 border-[#FAF2E8]/90 shadow-[0_8px_24px_rgba(100,22,35,0.08)] hover:shadow-[0_16px_36px_rgba(100,22,35,0.16)] transition-all duration-300 snap-start group/card cursor-pointer"
                  onClick={(e) => togglePlay(reel.id, e)}
                >
                  {/* HTML5 Autoplay Looping Video */}
                  <video
                    ref={(el) => {
                      videoRefs.current[reel.id] = el;
                    }}
                    src={reel.videoUrl}
                    poster={reel.posterUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />

                  {/* Bottom Subtle Vignette for Controls */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

                  {/* Bottom Action Controls Bar */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5 z-10 flex items-center justify-between">
                    {/* Play/Pause Button (Bottom Left) */}
                    <button
                      onClick={(e) => togglePlay(reel.id, e)}
                      type="button"
                      aria-label={isPlaying ? 'Pause reel' : 'Play reel'}
                      className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 flex items-center justify-center transition-all duration-200 border border-white/20 hover:scale-110 active:scale-95"
                    >
                      {isPlaying ? (
                        // Pause Icon
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        // Play Icon
                        <svg
                          className="w-3.5 h-3.5 ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 3l14 9-14 9V3z" />
                        </svg>
                      )}
                    </button>

                    {/* Sound Toggle Button (Bottom Right) */}
                    <button
                      onClick={(e) => toggleSound(reel.id, e)}
                      type="button"
                      aria-label={isUnmuted ? 'Mute audio' : 'Unmute audio'}
                      className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 border border-white/20 hover:scale-110 active:scale-95 ${
                        isUnmuted
                          ? 'bg-[#F7BE44] text-[#641623]'
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      {isUnmuted ? (
                        // Sound ON (Volume High)
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                      ) : (
                        // Sound MUTED (Volume X)
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

