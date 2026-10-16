import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Tv, 
  ExternalLink,
  Disc3,
  Minimize2
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface MusicPlayerProps {
  onPlayingChange?: (isPlaying: boolean) => void;
  onTrackTitleChange?: (title: string) => void;
}

const PLAYLIST_ID = 'RDpgpCsZroa3g';
const DEFAULT_VIDEO_ID = 'pgpCsZroa3g';

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  onPlayingChange,
  onTrackTitleChange,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(240);
  const [volume, setVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [trackTitle, setTrackTitle] = useState<string>('The Data Mind Cafe · Nostalgic Radio');
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  const ytPlayerRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!document.getElementById('yt-iframe-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        ytPlayerRef.current = new window.YT.Player('yt-hidden-player', {
          height: '100%',
          width: '100%',
          videoId: DEFAULT_VIDEO_ID,
          playerVars: {
            listType: 'playlist',
            list: PLAYLIST_ID,
            autoplay: 0,
            controls: 1,
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(75);
              const data = event.target.getVideoData();
              if (data && data.title) {
                setTrackTitle(data.title);
                onTrackTitleChange?.(data.title);
              }
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                setIsPlaying(true);
                onPlayingChange?.(true);
                const data = event.target.getVideoData();
                if (data && data.title) {
                  setTrackTitle(data.title);
                  onTrackTitleChange?.(data.title);
                }
                const dur = event.target.getDuration();
                if (dur) setDuration(dur);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
                onPlayingChange?.(false);
              }
            },
          },
        });
      } catch (err) {
        console.error('Error initializing YouTube player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
          const curr = ytPlayerRef.current.getCurrentTime();
          const dur = ytPlayerRef.current.getDuration();
          if (curr) setCurrentTime(curr);
          if (dur) setDuration(dur);
        }
      }, 1000);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    audioSynth.playKeyClick(1);
    if (!ytPlayerRef.current) return;

    try {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
        onPlayingChange?.(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        onPlayingChange?.(true);
      }
    } catch (e) {
      console.warn('Playback error', e);
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    audioSynth.playKeyClick(2);
    if (ytPlayerRef.current && ytPlayerRef.current.nextVideo) {
      ytPlayerRef.current.nextVideo();
    }
  };

  const handlePrev = () => {
    audioSynth.playKeyClick(3);
    if (ytPlayerRef.current && ytPlayerRef.current.previousVideo) {
      ytPlayerRef.current.previousVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      ytPlayerRef.current.seekTo(seekTime, true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    if (isMuted) setIsMuted(false);
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      ytPlayerRef.current.setVolume(val);
    }
  };

  const toggleMute = () => {
    audioSynth.playKeyClick(4);
    if (ytPlayerRef.current) {
      if (isMuted) {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(volume);
        setIsMuted(false);
      } else {
        ytPlayerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Floating Video Monitor Popup */}
      {showVideoModal && (
        <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 rounded-2xl glass-panel-amber p-3 shadow-2xl border border-amber-500/30">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-mono-code text-zinc-300">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Tv className="w-3.5 h-3.5" />
              <span>YouTube Video Relay</span>
            </span>
            <button
              onClick={() => setShowVideoModal(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              title="YouTube Broadcast"
              src={`https://www.youtube-nocookie.com/embed/${DEFAULT_VIDEO_ID}?list=${PLAYLIST_ID}&autoplay=0&enablejsapi=1`}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Hidden YouTube Iframe */}
      <div className="hidden" aria-hidden="true">
        <div id="yt-hidden-player" />
      </div>

      {/* Beautiful Fixed Glassmorphism Bottom Music Player */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-6 py-3 glass-panel-amber border-t border-amber-500/20 shadow-2xl backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Track Info & Vinyl Icon */}
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
            <div className="relative shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 overflow-hidden shadow-sm">
              <Disc3 className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>

            <div className="min-w-0 flex-1">
              <span className="font-outfit font-semibold text-xs sm:text-sm text-zinc-100 truncate block">
                {trackTitle}
              </span>
              <div className="flex items-center gap-2 text-[11px] font-mono-code text-zinc-400 mt-0.5">
                <span className="text-amber-400 font-medium">Baud 56k Stream</span>
                <span>·</span>
                <span className="truncate">RDpgpCsZroa3g Playlist</span>
              </div>
            </div>
          </div>

          {/* Center: Playback Controls & Progress Scrubber */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-5/12">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                title="Previous Track"
                className="p-1.5 text-zinc-400 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors active:scale-95 cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause Broadcast' : 'Play Broadcast'}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                title="Next Track"
                className="p-1.5 text-zinc-400 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors active:scale-95 cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber Bar */}
            <div className="w-full flex items-center gap-2.5 text-[11px] font-mono-code text-zinc-400">
              <span className="w-10 text-right tabular-nums text-amber-400 font-medium">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
              <span className="w-10 tabular-nums text-zinc-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume & Monitor Tools */}
          <div className="hidden lg:flex items-center justify-end gap-3 w-1/4">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <button
              onClick={() => setShowVideoModal(!showVideoModal)}
              title="Toggle YouTube Video Monitor"
              className="p-2 text-zinc-400 hover:text-amber-300 hover:bg-white/5 rounded-lg border border-zinc-800 transition-colors cursor-pointer"
            >
              <Tv className="w-4 h-4" />
            </button>

            <a
              href={`https://youtube.com/playlist?list=${PLAYLIST_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Playlist on YouTube"
              className="p-2 text-zinc-400 hover:text-amber-300 hover:bg-white/5 rounded-lg border border-zinc-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </>
  );
};
