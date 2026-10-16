import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageSquareQuote, Sparkles } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

interface Quote {
  id: number;
  text: string;
  source: string;
  year: string;
  category: string;
}

const NOSTALGIC_QUOTES: Quote[] = [
  {
    id: 1,
    text: "The 56k modem screeching into the 3 AM silence while the entire house slept, praying no one picked up the telephone line.",
    source: "Late Night Dial-up",
    year: "1998",
    category: "Dial-up Era",
  },
  {
    id: 2,
    text: "Booth #7 shouting 'Bomb has been planted!' in Counter-Strike 1.3 while the espresso machine hissed warm steam into the rainy street air.",
    source: "LAN Clan Memory",
    year: "2001",
    category: "LAN Culture",
  },
  {
    id: 3,
    text: "Waiting 48 minutes for a single 128kbps MP3 on LimeWire at 3.8 KB/s, staring at the progress bar like it was sacred scripture.",
    source: "Napster Nights",
    year: "2000",
    category: "MP3 Era",
  },
  {
    id: 4,
    text: "The rhythmic spring-buckling clatter of twenty mechanical keyboards glowing beneath neon signs reflecting on wet rain streets.",
    source: "Midnight Cafe",
    year: "1999",
    category: "Atmosphere",
  },
  {
    id: 5,
    text: "Writing 'brb, mom needs the phone line' on MSN Messenger, then sending a final screen-shaking BUZZ before disconnecting.",
    source: "Messenger Archive",
    year: "2003",
    category: "Instant Message",
  },
  {
    id: 6,
    text: "Burning a fresh 700MB CD-R with handwriting in blue Sharpie, terrified of a buffer underrun ruining the disc spindle.",
    source: "Optical Relic",
    year: "2002",
    category: "Physical Media",
  },
  {
    id: 7,
    text: "The deep electromagnetic 'BOOOIIINGG-BZZZT' of degaussing a curved 19-inch CRT monitor to wash away the rainbow magnetic stains.",
    source: "Hardware Ritual",
    year: "1997",
    category: "CRT Lore",
  },
];

export const QuoteCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const duration = 6000;

  useEffect(() => {
    if (isPaused) return;

    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % NOSTALGIC_QUOTES.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    audioSynth.playKeyClick(1);
    setCurrentIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    audioSynth.playKeyClick(2);
    setCurrentIndex((prev) => (prev - 1 + NOSTALGIC_QUOTES.length) % NOSTALGIC_QUOTES.length);
    setProgress(0);
  };

  const currentQuote = NOSTALGIC_QUOTES[currentIndex];

  return (
    <section
      id="memories"
      className="relative z-20 max-w-4xl mx-auto px-4 py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-2xl glass-panel-amber p-6 sm:p-8 shadow-xl border border-amber-500/20">
        
        {/* Subtle decorative quote glyph */}
        <div className="absolute -top-3 -right-3 text-amber-500/10 pointer-events-none select-none">
          <MessageSquareQuote className="w-32 h-32" />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between gap-4 mb-4 text-xs font-mono-code text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold">{currentQuote.category}</span>
            <span>·</span>
            <span>{currentQuote.year}</span>
            <span>·</span>
            <span className="text-zinc-500">Memory #{currentQuote.id.toString().padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              title="Previous Memory"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-zinc-500 tabular-nums px-1">
              {currentIndex + 1} / {NOSTALGIC_QUOTES.length}
            </span>
            <button
              onClick={handleNext}
              title="Next Memory"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quote body */}
        <div className="min-h-[85px] flex flex-col justify-center">
          <blockquote className="text-base sm:text-lg md:text-xl text-zinc-100 font-normal leading-relaxed font-outfit">
            “{currentQuote.text}”
          </blockquote>
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-400/90 font-mono-code">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{currentQuote.source}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 w-full bg-zinc-800/60 h-1 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    </section>
  );
};
