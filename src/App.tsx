import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Sparkles, 
  Layers,
  Radio,
  BellRing,
  Terminal,
  Heart
} from 'lucide-react';
import { TopBar } from './components/TopBar';
import { CentralTerminal } from './components/CentralTerminal';
import { QuoteCarousel } from './components/QuoteCarousel';
import { MemoryStubs } from './components/MemoryStubs';
import { InteractiveKeyboardBar } from './components/InteractiveKeyboardBar';
import { MusicPlayer } from './components/MusicPlayer';
import { CafeOrderModal } from './components/CafeOrderModal';
import { audioSynth } from './utils/audioSynthesizer';
import cozyBackdropImg from './assets/images/cozy_lofi_cafe_1792139470458.jpg';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDegaussing, setIsDegaussing] = useState<boolean>(false);
  const [isNudging, setIsNudging] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [orderToast, setOrderToast] = useState<string | null>(null);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [currentTrackTitle, setCurrentTrackTitle] = useState<string>('Lofi Cyber Cafe Radio #01');
  const [sessionSeconds, setSessionSeconds] = useState<number>(3720);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audioSynth.setMuted(!newState);
  };

  const triggerDegauss = () => {
    setIsDegaussing(true);
    setTimeout(() => {
      setIsDegaussing(false);
    }, 900);
  };

  const triggerNudge = () => {
    setIsNudging(true);
    setTimeout(() => {
      setIsNudging(false);
    }, 550);
  };

  const handleOrderDrink = (drinkName: string) => {
    setOrderToast(`Order Received: 1x ${drinkName} dispatched to Booth #04!`);
    setTimeout(() => {
      setOrderToast(null);
    }, 4000);
  };

  return (
    <div
      className={`min-h-screen relative bg-zinc-950 text-zinc-100 flex flex-col font-outfit selection:bg-amber-500/30 selection:text-amber-200 pb-36 ${
        isNudging ? 'screen-shake-active' : ''
      }`}
    >
      {/* Immersive Cozy Lo-Fi Cyber Cafe Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={cozyBackdropImg}
          alt="Cozy Lo-Fi Cyber Cafe at Night"
          className="w-full h-full object-cover object-center opacity-30 filter saturate-120 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/70 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700/10 via-transparent to-black/90" />
      </div>

      {/* Subtle CRT Scanlines (Toggleable) */}
      {scanlinesEnabled && (
        <div className="crt-scanlines fixed inset-0 z-30 pointer-events-none opacity-35" />
      )}

      {/* Clean & Classic Top Bar */}
      <TopBar
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        onTriggerDegauss={triggerDegauss}
        onTriggerNudge={triggerNudge}
      />

      {/* Floating Order Toast Notification */}
      {orderToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm rounded-xl glass-panel-amber border border-amber-500/40 p-4 shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Coffee className="w-4 h-4" />
          </div>
          <p className="text-xs font-mono-code text-zinc-200">{orderToast}</p>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        
        {/* Hero Section: Memorable Title & Nostalgic Kicker */}
        <section className="relative max-w-5xl mx-auto px-4 pt-12 pb-6 text-center">
          
          {/* Authentic Metadata Strip */}
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-amber-400/90 tracking-widest uppercase mb-4">
            <span>Booth #04 Terminal</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>Rate: $1.50/hr</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="tabular-nums">Session: {formatSessionTime(sessionSeconds)}</span>
          </div>

          {/* Large Memorable Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase text-amber-glow text-wrap:balance">
            The Data Mind Cafe
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 font-normal leading-relaxed text-wrap:balance">
            A nostalgic late-night sanctuary where dark roast coffee meets 56k dial-up whispers,
            warm CRT phosphor glow, and the click of buckling springs in the rain.
          </p>

          {/* Quick Ambient Badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-mono-code text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>56,000 BPS V.90 Connected</span>
            </span>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Espresso Boiler 93°C</span>
            </span>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Winamp 2.91 Audio Stream</span>
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                audioSynth.playCoffeeClink();
                setIsOrderModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-semibold text-xs tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Coffee className="w-4 h-4" />
              <span>Order Cafe Beverage</span>
            </button>

            <button
              onClick={() => {
                triggerDegauss();
                audioSynth.playDegauss();
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-mono-code transition-colors active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Degauss Screen</span>
            </button>

            <button
              onClick={() => {
                audioSynth.playKeyClick(1);
                setScanlinesEnabled(!scanlinesEnabled);
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-mono-code transition-colors active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>{scanlinesEnabled ? 'Scanlines: On' : 'Scanlines: Off'}</span>
            </button>
          </div>
        </section>

        {/* Central Retro Computer Window with Terminal, Winamp, Modem & Menu */}
        <CentralTerminal
          isDegaussing={isDegaussing}
          onTriggerDegauss={triggerDegauss}
          onTriggerNudge={triggerNudge}
          onOrderDrink={handleOrderDrink}
          currentTrackTitle={currentTrackTitle}
          isPlayingMusic={isPlayingMusic}
        />

        {/* Rotating Nostalgic Quote Card */}
        <QuoteCarousel />

        {/* Tactile Mechanical Buckling Spring Keyboard Deck */}
        <InteractiveKeyboardBar />

        {/* Authentic Details: Session Card, Floppy Vault, Guest Logs */}
        <MemoryStubs />

      </main>

      {/* Cafe Barista Order Modal */}
      <CafeOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onConfirmOrder={handleOrderDrink}
      />

      {/* Fixed Bottom Glassmorphism Music Player connected to YouTube Playlist */}
      <MusicPlayer
        onPlayingChange={setIsPlayingMusic}
        onTrackTitleChange={setCurrentTrackTitle}
      />

    </div>
  );
}
