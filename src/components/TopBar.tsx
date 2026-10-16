import React from 'react';
import { Volume2, VolumeX, Coffee, Sparkles, BellRing, Terminal } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

interface TopBarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenOrderModal: () => void;
  onTriggerDegauss: () => void;
  onTriggerNudge: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenOrderModal,
  onTriggerDegauss,
  onTriggerNudge,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-outfit font-bold text-lg text-white tracking-tight">
                The Data Mind Cafe
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono-code text-amber-400/90 font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                Est. 1998
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono-code -mt-0.5">
              56k Baud · Midnight Coffee · Nostalgia
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <a
            href="#station"
            onClick={() => audioSynth.playKeyClick(1)}
            className="hover:text-amber-400 transition-colors"
          >
            Station #04
          </a>
          <a
            href="#memories"
            onClick={() => audioSynth.playKeyClick(2)}
            className="hover:text-amber-400 transition-colors"
          >
            Nostalgic Lore
          </a>
          <a
            href="#keyboard"
            onClick={() => audioSynth.playKeyClick(3)}
            className="hover:text-amber-400 transition-colors"
          >
            Keyboard Deck
          </a>
          <a
            href="#archive"
            onClick={() => audioSynth.playKeyClick(4)}
            className="hover:text-amber-400 transition-colors"
          >
            Floppy Archive
          </a>
        </nav>

        {/* Zone 3: Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Degauss Button */}
          <button
            onClick={() => {
              onTriggerDegauss();
              audioSynth.playDegauss();
            }}
            title="Degauss CRT Monitor"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Degauss</span>
          </button>

          {/* Quick Nudge BUZZ Button */}
          <button
            onClick={() => {
              onTriggerNudge();
              audioSynth.playMessengerBuzz();
            }}
            title="Send Messenger BUZZ Nudge"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all active:scale-95"
          >
            <BellRing className="w-3.5 h-3.5 text-cyan-400" />
            <span>BUZZ!</span>
          </button>

          {/* Audio FX Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mechanical Audio FX: ON' : 'Mechanical Audio FX: MUTED'}
            className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* Cafe Menu Button */}
          <button
            onClick={() => {
              audioSynth.playCoffeeClink();
              onOpenOrderModal();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Coffee className="w-4 h-4" />
            <span>Cafe Menu</span>
          </button>
        </div>

      </div>
    </header>
  );
};
