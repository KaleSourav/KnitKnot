import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize, Minimize, Sparkles, Scan, Eye } from 'lucide-react';

export const FullscreenVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'fit' | 'fill'>('fit'); // 'fit' = Full Picture View (uncropped), 'fill' = Edge to Edge
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Guarantee autoplay even under strict browser media policies
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay prevented by browser:', err);
            setIsPlaying(false);
          });
      }

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video) return;

    // Support iOS Safari native video fullscreen
    const v = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (v.webkitEnterFullscreen && window.innerWidth < 768) {
      v.webkitEnterFullscreen();
      return;
    }

    if (!document.fullscreenElement) {
      if (container?.requestFullscreen) {
        container.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section 
      id="video-experience-section"
      className="w-full bg-[#07060a] text-white py-12 sm:py-20 px-3 sm:px-6 lg:px-8 select-none relative overflow-hidden font-['DM_Sans',sans-serif]"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* SECTION HEADER: INTRODUCE THE SHOWCASE */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#edd2f7] text-[10.5px] sm:text-xs font-bold tracking-widest uppercase mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>Artisan Motion • 4K Ultra HD</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
            Crochet Artistry in Full Motion
          </h2>
          <p className="text-xs sm:text-base text-stone-300 font-medium mt-2 leading-relaxed max-w-lg mx-auto">
            Experience our master artisans at work. Every stitch, heirloom amigurumi companion, and everlasting bouquet handmade with love.
          </p>
        </div>

        {/* FULL PICTURE VIDEO PLAYER CONTAINER */}
        <div 
          ref={containerRef}
          className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] border border-white/15 bg-black group/player flex items-center justify-center"
          onMouseEnter={() => setShowControls(true)}
          onClick={togglePlay}
        >
          {/* THE 16:9 VIDEO IN FULL PICTURE VIEW (ZERO CROPPING) */}
          <video
            ref={videoRef}
            src="/crochet-showcase.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`w-full h-full ${
              viewMode === 'fit' ? 'object-contain' : 'object-cover'
            } object-center transition-all duration-300 cursor-pointer`}
          />

          {/* CENTER PLAY/PAUSE OVERLAY ICON (SHOWS MOMENTARILY OR WHEN PAUSED) */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-20 animate-in fade-in duration-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-[#4a044e] flex items-center justify-center shadow-2xl pl-1 transform scale-110">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
              </div>
            </div>
          )}

          {/* TOP FLOATING BADGES OVER VIDEO */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex items-center gap-2 pointer-events-none">
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[9.5px] sm:text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Full Picture View</span>
            </span>
          </div>

          {/* BOTTOM CONTROLS & TIMELINE BAR */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-0 inset-x-0 z-30 p-3 sm:p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 sm:opacity-100'
            }`}
          >
            {/* PROGRESS BAR TIMELINE */}
            <div 
              onClick={handleSeek}
              className="w-full h-1.5 sm:h-2 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer mb-3 relative overflow-hidden group/seek"
            >
              <div 
                className="h-full bg-gradient-to-r from-[#edd2f7] to-pink-400 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* CONTROLS ROW */}
            <div className="flex items-center justify-between gap-3">
              {/* LEFT: PLAY / SOUND CONTROLS */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* PLAY / PAUSE */}
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all cursor-pointer shadow-sm"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white" />
                  )}
                </button>

                {/* SOUND MUTE / UNMUTE */}
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-300" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-pink-300 animate-pulse" />
                  )}
                  <span className="text-xs font-bold text-white/95 hidden sm:inline">
                    {isMuted ? 'Unmute' : 'Sound On'}
                  </span>
                </button>
              </div>

              {/* RIGHT: VIEW MODE (FIT / FILL) & FULLSCREEN */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* FIT / FILL TOGGLE BUTTON */}
                <button
                  onClick={() => setViewMode(viewMode === 'fit' ? 'fill' : 'fit')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title={viewMode === 'fit' ? 'Switch to Fill View' : 'Switch to Full Picture View'}
                >
                  <Eye className="w-3.5 h-3.5 text-[#edd2f7]" />
                  <span>{viewMode === 'fit' ? 'Full Picture' : 'Fill Screen'}</span>
                </button>

                {/* FULLSCREEN BUTTON */}
                <button
                  onClick={toggleFullscreen}
                  aria-label="Toggle Fullscreen"
                  className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all cursor-pointer shadow-sm"
                  title="Expand to Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  ) : (
                    <Maximize className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA BAR UNDER VIDEO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 px-2 text-stone-400 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#edd2f7]" />
            <span className="text-stone-300 font-semibold">100% Handcrafted Artisan Knitted Drops</span>
          </div>
          <span className="text-stone-400 text-[11px] sm:text-xs">
            Tap video or expand button for cinematic view
          </span>
        </div>

      </div>
    </section>
  );
};
