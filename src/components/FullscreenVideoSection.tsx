import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize, Minimize, Sparkles } from 'lucide-react';

export const FullscreenVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
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

  return (
    <section 
      ref={containerRef}
      id="video-experience-section"
      className="relative w-full h-[65dvh] sm:h-[100dvh] min-h-[460px] sm:min-h-screen bg-black overflow-hidden select-none flex items-center justify-center group"
    >
      {/* 1. HIGH QUALITY FULLSCREEN AUTO-PLAYING LOOPING VIDEO */}
      <video
        ref={videoRef}
        src="/crochet-showcase.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-center pointer-events-auto"
        onClick={togglePlay}
      />

      {/* 2. SUBTLE BLENDING OVERLAYS */}
      <div className="absolute top-0 inset-x-0 h-20 sm:h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 sm:h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* 3. FLOATING BADGE (TOP LEFT) */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-none max-w-[calc(100vw-32px)]">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-lg">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-300" />
          <span className="truncate">Artisan Motion • 4K</span>
        </div>
      </div>

      {/* 4. SLEEK FLOATING VIDEO CONTROLS BAR (BOTTOM RIGHT) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-20 flex items-center gap-1.5 sm:gap-2.5 bg-black/60 backdrop-blur-xl border border-white/20 p-1.5 sm:p-2.5 rounded-full shadow-2xl transition-all duration-300">
        {/* PLAY / PAUSE */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="p-1.5 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />}
        </button>

        {/* SOUND MUTE / UNMUTE */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className="p-1.5 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer flex items-center gap-1.5"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-300" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-300 animate-pulse" />
          )}
          <span className="text-xs font-semibold hidden sm:inline text-white/90">
            {isMuted ? 'Unmute' : 'Audio On'}
          </span>
        </button>

        {/* FULLSCREEN EXPAND */}
        <button
          onClick={toggleFullscreen}
          aria-label="Toggle Fullscreen"
          className="p-1.5 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
          title="Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>
    </section>
  );
};
