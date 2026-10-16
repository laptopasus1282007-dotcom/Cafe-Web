import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Radio, 
  PhoneCall, 
  Coffee, 
  Power, 
  Sparkles, 
  BellRing, 
  Sliders,
  Volume2,
  CheckCircle2,
  Play
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';
import cozyCafeImg from '../assets/images/cozy_lofi_cafe_1792139470458.jpg';

type ScreenMode = 'terminal' | 'winamp' | 'dialup' | 'cafe_menu';
type PhosphorColor = 'amber' | 'green' | 'cyan' | 'white';

interface CentralTerminalProps {
  isDegaussing: boolean;
  onTriggerDegauss: () => void;
  onTriggerNudge: () => void;
  onOrderDrink: (drinkName: string) => void;
  currentTrackTitle?: string;
  isPlayingMusic?: boolean;
}

export const CentralTerminal: React.FC<CentralTerminalProps> = ({
  isDegaussing,
  onTriggerDegauss,
  onTriggerNudge,
  onOrderDrink,
  currentTrackTitle = 'Lofi Cyber Cafe Radio #01',
  isPlayingMusic = false,
}) => {
  const [screenMode, setScreenMode] = useState<ScreenMode>('terminal');
  const [phosphor, setPhosphor] = useState<PhosphorColor>('amber');
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);
  const [degaussIntensity, setDegaussIntensity] = useState<number>(100);

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ text: string; isUser?: boolean }>>([
    { text: 'THE DATA MIND CAFE OS v3.11 [REV 1998]' },
    { text: 'CONNECTED: 56,000 BPS · COM1 V.90 PROTOCOL OK' },
    { text: 'Welcome to Station #04. Click quick commands below or type freely.' },
    { text: '' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Dial-up state
  const [dialupLogs, setDialupLogs] = useState<string[]>([
    'Standby: 56k Modem initialized on COM1 (ATZ OK)',
  ]);
  const [isDialing, setIsDialing] = useState(false);
  const [dialupSpeed, setDialupSpeed] = useState('56,000 BPS');

  // Winamp audio visualizer state
  const [eqLevels, setEqLevels] = useState<number[]>([45, 65, 85, 55, 90, 75, 60, 80, 95, 50]);

  // Terminal autoscroll
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // EQ animation
  useEffect(() => {
    if (!isPlayingMusic && screenMode !== 'winamp') return;
    const interval = setInterval(() => {
      setEqLevels(Array.from({ length: 10 }, () => Math.floor(Math.random() * 80) + 15));
    }, 110);
    return () => clearInterval(interval);
  }, [isPlayingMusic, screenMode]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    audioSynth.playKeyClick(trimmed.length);
    const newHistory = [...terminalHistory, { text: `C:\\CAFE> ${cmd}`, isUser: true }];

    switch (trimmed) {
      case 'help':
        newHistory.push(
          { text: 'AVAILABLE COMMANDS:' },
          { text: '  menu      - Open the cafe beverage and snacks menu' },
          { text: '  dialup    - Test the 56k dial-up acoustic handshake' },
          { text: '  winamp    - Switch to retro audio visualizer deck' },
          { text: '  coffee    - Quick order a cup of Midnight Roast' },
          { text: '  degauss   - Fire CRT electromagnetic degauss coil' },
          { text: '  nudge     - Send MSN/Yahoo Messenger screen BUZZ' },
          { text: '  clear     - Clear terminal screen' }
        );
        break;
      case 'menu':
        setScreenMode('cafe_menu');
        newHistory.push({ text: 'Displaying CAFE COUNTER MENU...' });
        break;
      case 'dialup':
      case 'dial':
        setScreenMode('dialup');
        startDialupSequence();
        newHistory.push({ text: 'Starting V.90 dial-up handshake test...' });
        break;
      case 'winamp':
        setScreenMode('winamp');
        newHistory.push({ text: 'Routing display to Winamp 2.91 visualizer...' });
        break;
      case 'coffee':
        audioSynth.playCoffeeClink();
        onOrderDrink('Midnight 56k Cold Brew');
        newHistory.push({ text: 'ORDER SENT: Midnight 56k Cold Brew brewing at counter.' });
        break;
      case 'degauss':
        onTriggerDegauss();
        audioSynth.playDegauss();
        newHistory.push({ text: `DEGAUSS FIRED: ${degaussIntensity}% magnetic flux pulse discharged.` });
        break;
      case 'nudge':
      case 'buzz':
        onTriggerNudge();
        audioSynth.playMessengerBuzz();
        newHistory.push({ text: 'BUZZ! You sent a screen nudge across the cafe.' });
        break;
      case 'clear':
      case 'cls':
        setTerminalHistory([]);
        setInputVal('');
        return;
      default:
        newHistory.push({ text: `Unknown command "${cmd}". Type "help" or click buttons below.` });
        break;
    }

    setTerminalHistory(newHistory);
    setInputVal('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const startDialupSequence = () => {
    if (isDialing) return;
    setIsDialing(true);
    setDialupLogs(['[ATDT 555-0198] Opening audio line...']);
    setDialupSpeed('DIALING');

    audioSynth.playDialupSample((step) => {
      setDialupLogs((prev) => [...prev, step]);
      if (step.includes('56000')) {
        setDialupSpeed('56,000 BPS');
        setIsDialing(false);
      } else if (step.includes('Negotiating')) {
        setDialupSpeed('V.90 SYNC');
      }
    });
  };

  const getPhosphorClass = () => {
    switch (phosphor) {
      case 'green':
        return 'text-emerald-400 text-green-glow';
      case 'cyan':
        return 'text-cyan-300 text-cyan-glow';
      case 'white':
        return 'text-zinc-100';
      case 'amber':
      default:
        return 'text-amber-400 text-amber-glow';
    }
  };

  return (
    <section id="station" className="relative z-20 max-w-6xl mx-auto px-4 py-8">
      {/* Retro Classic Computer Window Container */}
      <div className="rounded-2xl glass-panel-amber border border-amber-500/20 shadow-2xl overflow-hidden transition-all">
        
        {/* Classic Window Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-zinc-950/90 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
            </div>
            <span className="font-mono-code text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide">
              The Data Mind Cafe · Station #04 · 1024×768 @ 85Hz
            </span>
          </div>

          {/* Clean Segmented Tab Navigation */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-medium">
            <button
              onClick={() => {
                audioSynth.playKeyClick(1);
                setScreenMode('terminal');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                screenMode === 'terminal'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </button>
            <button
              onClick={() => {
                audioSynth.playKeyClick(2);
                setScreenMode('winamp');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                screenMode === 'winamp'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Winamp</span>
            </button>
            <button
              onClick={() => {
                audioSynth.playKeyClick(3);
                setScreenMode('dialup');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                screenMode === 'dialup'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>56k Modem</span>
            </button>
            <button
              onClick={() => {
                audioSynth.playKeyClick(4);
                setScreenMode('cafe_menu');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                screenMode === 'cafe_menu'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Cafe Menu</span>
            </button>
          </div>
        </div>

        {/* Main Split: Left Artwork & Right Interactive CRT Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          
          {/* Left Column: Cozy Cafe Visual + Easy Controls */}
          <div className="lg:col-span-5 bg-zinc-950/60 p-5 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            <div>
              {/* Cozy Still Life Photo */}
              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg group">
                <img
                  src={cozyCafeImg}
                  alt="Cozy Lo-Fi Cyber Cafe"
                  className="w-full h-auto aspect-[16/10] object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono-code text-zinc-300">
                  <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                    Station #04 · Booth Cozy
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 backdrop-blur-md px-2 py-0.5 rounded border border-amber-500/30">
                    56,000 bps V.90
                  </span>
                </div>
              </div>

              {/* Hardware & CRT Control Buttons */}
              <div className="mt-5 space-y-3">
                <div className="text-xs font-mono-code text-zinc-400 font-medium uppercase tracking-wider">
                  CRT Display Controls
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onTriggerDegauss();
                      audioSynth.playDegauss();
                    }}
                    title="Discharge CRT Degauss Coil"
                    className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Degauss</span>
                  </button>

                  <button
                    onClick={() => {
                      onTriggerNudge();
                      audioSynth.playMessengerBuzz();
                    }}
                    title="Send Messenger BUZZ Nudge"
                    className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-sm"
                  >
                    <BellRing className="w-4 h-4 text-cyan-400" />
                    <span>Nudge!</span>
                  </button>

                  <button
                    onClick={() => {
                      audioSynth.playRelayClick();
                      setIsPowerOn(!isPowerOn);
                    }}
                    title="Toggle Monitor Power"
                    className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-sm ${
                      isPowerOn
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                        : 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{isPowerOn ? 'CRT On' : 'CRT Off'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Granular Degauss Intensity Slider */}
            <div className="mt-5 p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Degauss Distortion</span>
                </span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {degaussIntensity}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={degaussIntensity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setDegaussIntensity(val);
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] font-mono-code text-zinc-500">
                <span>Subtle (10%)</span>
                <span>Normal (100%)</span>
                <span>Surge (150%)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Glowing CRT Display Screen */}
          <div className="lg:col-span-7 bg-zinc-950 p-5 sm:p-6 flex flex-col">
            <div
              className={`relative flex-1 min-h-[440px] rounded-xl overflow-hidden bg-black border-4 border-zinc-800 transition-all ${
                isDegaussing ? 'degauss-active' : ''
              }`}
              style={{
                boxShadow: isPowerOn
                  ? phosphor === 'amber'
                    ? 'inset 0 0 50px rgba(0,0,0,0.9), inset 0 0 15px rgba(245, 158, 11, 0.3)'
                    : phosphor === 'green'
                    ? 'inset 0 0 50px rgba(0,0,0,0.9), inset 0 0 15px rgba(34, 197, 94, 0.3)'
                    : 'inset 0 0 50px rgba(0,0,0,0.9), inset 0 0 15px rgba(6, 182, 212, 0.3)'
                  : 'none',
              }}
            >
              {/* Scanlines overlay */}
              <div className="crt-scanlines absolute inset-0 z-30 pointer-events-none" />

              {!isPowerOn ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 font-mono-code text-sm">
                  <Power className="w-10 h-10 mb-2 opacity-40" />
                  <span>MONITOR POWER OFF · CLICK 'CRT ON'</span>
                </div>
              ) : (
                <div className={`relative z-20 h-full p-4 md:p-6 font-terminal text-lg md:text-xl flex flex-col justify-between ${getPhosphorClass()}`}>
                  
                  {/* TAB 1: TERMINAL PROMPT */}
                  {screenMode === 'terminal' && (
                    <div className="h-full flex flex-col justify-between">
                      <div className="overflow-y-auto max-h-[290px] space-y-1.5 pr-2">
                        {terminalHistory.map((item, idx) => (
                          <div
                            key={idx}
                            className={`leading-tight ${item.isUser ? 'text-white font-bold' : ''}`}
                          >
                            {item.text}
                          </div>
                        ))}
                        <div ref={terminalEndRef} />
                      </div>

                      {/* Quick Command Suggestion Buttons for Easy 1-Click Access */}
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-xs font-mono-code text-zinc-400">
                          <span className="text-[11px] text-zinc-500">Quick:</span>
                          {['help', 'menu', 'dialup', 'winamp', 'coffee', 'degauss', 'nudge', 'clear'].map((cmd) => (
                            <button
                              key={cmd}
                              type="button"
                              onClick={() => executeCommand(cmd)}
                              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors text-[11px]"
                            >
                              {cmd}
                            </button>
                          ))}
                        </div>

                        {/* Freeform Command Form */}
                        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                          <span className="shrink-0 select-none font-bold">C:\CAFE&gt;</span>
                          <input
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            placeholder="Type command here..."
                            className="flex-1 bg-transparent border-none outline-none text-lg md:text-xl font-terminal tracking-wide focus:ring-0 placeholder:text-zinc-600 text-amber-300"
                            autoComplete="off"
                            spellCheck="false"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1 text-xs font-mono-code bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded hover:bg-amber-500/30 transition-colors"
                          >
                            Send
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: WINAMP 2.91 AUDIO DECK */}
                  {screenMode === 'winamp' && (
                    <div className="h-full flex flex-col justify-between font-mono-code">
                      <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 flex items-center justify-between text-xs text-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="font-bold">WINAMP v2.91 DECK</span>
                        </div>
                        <span className="text-[11px] text-zinc-400">128 kbps · Stereo · 44.1 kHz</span>
                      </div>

                      <div className="my-auto py-4">
                        <div className="text-center text-sm mb-3 font-mono-code text-zinc-200 truncate">
                          TRACK: {currentTrackTitle}
                        </div>
                        <div className="flex items-end justify-center gap-2 sm:gap-3 h-28 px-4 bg-black/60 rounded-xl border border-zinc-800 p-4">
                          {eqLevels.map((lvl, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                              <div
                                className="w-full rounded-t transition-all duration-100"
                                style={{
                                  height: `${isPlayingMusic ? lvl : 15}%`,
                                  backgroundColor:
                                    phosphor === 'amber'
                                      ? '#f59e0b'
                                      : phosphor === 'green'
                                      ? '#22c55e'
                                      : phosphor === 'cyan'
                                      ? '#06b6d4'
                                      : '#f4f4f5',
                                }}
                              />
                              <span className="text-[9px] text-zinc-500 mt-1">
                                {['60', '170', '310', '600', '1k', '3k', '6k', '12k', '14k', '16k'][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                        <span className="text-amber-400 font-bold">
                          {isPlayingMusic ? 'BROADCAST ACTIVE' : 'PAUSED / READY'}
                        </span>
                        <span className="text-zinc-400 italic">“It really whips the llama's ass”</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: 56K DIAL-UP HANDSHAKE */}
                  {screenMode === 'dialup' && (
                    <div className="h-full flex flex-col justify-between font-mono-code">
                      <div>
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
                          <span className="text-sm font-bold">USRobotics 56K Faxmodem V.90</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-amber-300 font-bold">
                            {dialupSpeed}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs sm:text-sm font-terminal overflow-y-auto max-h-[220px]">
                          {dialupLogs.map((log, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="opacity-50">&gt;&gt;</span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <button
                          onClick={startDialupSequence}
                          disabled={isDialing}
                          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isDialing ? 'Dialing & Handshaking...' : 'Play 56k Dial-Up Sound'}
                        </button>
                        <span className="text-xs opacity-75 font-terminal">
                          Frequency: 2100Hz / V.90
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: CAFE MENU */}
                  {screenMode === 'cafe_menu' && (
                    <div className="h-full flex flex-col justify-between font-terminal text-lg">
                      <div>
                        <div className="text-center font-bold text-xl pb-2 border-b border-white/10 mb-3 tracking-widest">
                          ★ THE DATA MIND CAFE MENU ★
                        </div>
                        <div className="space-y-2">
                          {[
                            { name: 'Midnight 56k Cold Brew', price: '$1.75', desc: 'Slow steeped dark roast with hazelnut' },
                            { name: 'Java Virtual Espresso', price: '$2.00', desc: 'Double extraction, zero latency' },
                            { name: 'Phosphor Amber Chai', price: '$2.25', desc: 'Cardamom & cinnamon spiced whole milk' },
                            { name: 'LAN Party Jolt Cola', price: '$1.50', desc: 'High-caffeine chilled fizzy soda' },
                            { name: 'Buttered Toast Diskette', price: '$1.25', desc: 'Thick sourdough with salted farm butter' },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                audioSynth.playCoffeeClink();
                                onOrderDrink(item.name);
                              }}
                              className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                              <div>
                                <div className="font-bold tracking-wide group-hover:underline">
                                  {idx + 1}. {item.name}
                                </div>
                                <div className="text-xs font-mono-code opacity-75">{item.desc}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold font-mono-code">{item.price}</span>
                                <button className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-code">
                                  Order
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs font-mono-code text-center pt-2 border-t border-white/10 opacity-70">
                        Click any drink to place a warm order at the barista counter.
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
