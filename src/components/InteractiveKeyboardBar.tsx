import React, { useState, useEffect } from 'react';
import { Keyboard, Sparkles } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

const ROW2 = ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BKSP'];
const ROW3 = ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'];
const ROW4 = ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'];
const ROW5 = ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'];
const ROW6 = ['CTRL', 'ALT', 'SPACEBAR', 'ALT', 'CTRL'];

export const InteractiveKeyboardBar: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [keyPressCount, setKeyPressCount] = useState<number>(42);
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('SPACEBAR');

  const handleKeyPress = (label: string) => {
    setActiveKey(label);
    setLastKeyPressed(label);
    setKeyPressCount((prev) => prev + 1);
    audioSynth.playKeyClick(label.charCodeAt(0) || 5);

    setTimeout(() => {
      setActiveKey((curr) => (curr === label ? null : curr));
    }, 120);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const raw = e.key.toUpperCase();
      let label = raw;
      if (raw === ' ') label = 'SPACEBAR';
      if (raw === 'BACKSPACE') label = 'BKSP';
      if (raw === 'ESCAPE') label = 'ESC';
      if (raw === 'CONTROL') label = 'CTRL';

      handleKeyPress(label);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="keyboard" className="relative z-20 max-w-5xl mx-auto px-4 py-6 font-mono-code">
      <div className="rounded-2xl glass-panel-amber p-5 sm:p-6 shadow-xl border border-amber-500/20">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-outfit font-bold text-sm text-white">
                Mechanical Buckling Spring Keyboard Deck
              </div>
              <div className="text-[11px] text-zinc-400 font-mono-code">
                Type on your real keyboard or click the keys below for authentic clicky sounds
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-code">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>Active Key:</span>
              <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-black/60 border border-amber-500/30">
                {lastKeyPressed}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>Clicks:</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {keyPressCount}
              </span>
            </div>
          </div>
        </div>

        {/* Vintage Beige Mechanical Keyboard Keys */}
        <div className="bg-zinc-950/80 p-3 sm:p-5 rounded-xl border border-white/10 overflow-x-auto shadow-inner">
          <div className="min-w-[560px] space-y-1.5 select-none">
            
            {/* ROW 2: Numbers */}
            <div className="flex gap-1.5 justify-center">
              {ROW2.map((key) => {
                const isActive = activeKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`h-9 font-mono-code text-xs font-bold rounded flex items-center justify-center transition-all cursor-pointer ${
                      key === 'BKSP' ? 'w-14' : 'w-8 sm:w-9'
                    } ${
                      isActive
                        ? 'bg-amber-400 text-zinc-950 translate-y-0.5 shadow-none'
                        : 'bg-[#ded8cc] text-zinc-800 shadow-[0_3px_0_#9a9385] hover:bg-[#eae4d8] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* ROW 3: QWERTY */}
            <div className="flex gap-1.5 justify-center">
              {ROW3.map((key) => {
                const isActive = activeKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`h-9 font-mono-code text-xs font-bold rounded flex items-center justify-center transition-all cursor-pointer ${
                      key === 'TAB' ? 'w-12' : key === '\\' ? 'w-10' : 'w-8 sm:w-9'
                    } ${
                      isActive
                        ? 'bg-amber-400 text-zinc-950 translate-y-0.5 shadow-none'
                        : 'bg-[#ded8cc] text-zinc-800 shadow-[0_3px_0_#9a9385] hover:bg-[#eae4d8] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* ROW 4: ASDF */}
            <div className="flex gap-1.5 justify-center">
              {ROW4.map((key) => {
                const isActive = activeKey === key;
                const isEnter = key === 'ENTER';
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`h-9 font-mono-code text-xs font-bold rounded flex items-center justify-center transition-all cursor-pointer ${
                      key === 'CAPS' ? 'w-14' : isEnter ? 'w-14 bg-[#c8bfae]' : 'w-8 sm:w-9'
                    } ${
                      isActive
                        ? 'bg-amber-400 text-zinc-950 translate-y-0.5 shadow-none'
                        : isEnter
                        ? 'bg-[#cdbfae] text-zinc-900 shadow-[0_3px_0_#897c6c] hover:bg-[#d8cab9] active:translate-y-0.5 active:shadow-none'
                        : 'bg-[#ded8cc] text-zinc-800 shadow-[0_3px_0_#9a9385] hover:bg-[#eae4d8] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* ROW 5: ZXCV */}
            <div className="flex gap-1.5 justify-center">
              {ROW5.map((key, i) => {
                const isActive = activeKey === key;
                return (
                  <button
                    key={key + i}
                    onClick={() => handleKeyPress(key)}
                    className={`h-9 font-mono-code text-xs font-bold rounded flex items-center justify-center transition-all cursor-pointer ${
                      key === 'SHIFT' ? 'w-16' : 'w-8 sm:w-9'
                    } ${
                      isActive
                        ? 'bg-amber-400 text-zinc-950 translate-y-0.5 shadow-none'
                        : 'bg-[#ded8cc] text-zinc-800 shadow-[0_3px_0_#9a9385] hover:bg-[#eae4d8] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* ROW 6: Spacebar */}
            <div className="flex gap-1.5 justify-center pt-0.5">
              {ROW6.map((key, i) => {
                const isActive = activeKey === key;
                return (
                  <button
                    key={key + i}
                    onClick={() => handleKeyPress(key)}
                    className={`h-9 font-mono-code text-xs font-bold rounded flex items-center justify-center transition-all cursor-pointer ${
                      key === 'SPACEBAR' ? 'w-56 sm:w-72' : 'w-12'
                    } ${
                      isActive
                        ? 'bg-amber-400 text-zinc-950 translate-y-0.5 shadow-none'
                        : 'bg-[#ded8cc] text-zinc-800 shadow-[0_3px_0_#9a9385] hover:bg-[#eae4d8] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
