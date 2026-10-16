import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Pause, Play, Trash2, Cpu, Activity, ShieldCheck, RefreshCw } from 'lucide-react';
import { HexScrew } from './SkeuoElements';
import { audioSynth } from '../utils/audioSynthesizer';

interface LogEntry {
  id: string;
  timestamp: string;
  category: 'SYS' | 'MODEM' | 'BOILER' | 'CRT' | 'AUDIO';
  level: 'OK' | 'INFO' | 'WARN';
  message: string;
}

const TELEMETRY_POOL: Array<{ category: LogEntry['category']; level: LogEntry['level']; template: () => string }> = [
  {
    category: 'SYS',
    level: 'OK',
    template: () => `CPU: PII-350MHz @ 41.${Math.floor(Math.random() * 8 + 2)}°C | BUS: 100MHz | IRQ 07 ACK`,
  },
  {
    category: 'SYS',
    level: 'INFO',
    template: () => `MEM: 65,536 KB SDRAM | CONVENTIONAL: 640 KB | EXTENDED: 64,896 KB OK`,
  },
  {
    category: 'MODEM',
    level: 'OK',
    template: () => `COM1 V.90: CARRIER ${50000 + Math.floor(Math.random() * 3333)} BPS | SNR: ${(36 + Math.random() * 4).toFixed(1)} dB | FEC ERR: 0`,
  },
  {
    category: 'BOILER',
    level: 'OK',
    template: () => `BOILER PID: ${(9.15 + Math.random() * 0.12).toFixed(2)} BAR | TEMP: ${(93.2 + Math.random() * 0.5).toFixed(1)}°C | FLOW: 1.84 mL/s`,
  },
  {
    category: 'CRT',
    level: 'OK',
    template: () => `TRINITRON ANODE: ${(24.6 + Math.random() * 0.4).toFixed(1)} kV | H-SYNC: 68.6 kHz | DEGAUSS COIL: READY`,
  },
  {
    category: 'AUDIO',
    level: 'INFO',
    template: () => `VU METER: L ${( -1.5 + Math.random() * 2).toFixed(1)} dBm | R ${( -1.2 + Math.random() * 2).toFixed(1)} dBm | THD: 0.04%`,
  },
  {
    category: 'SYS',
    level: 'INFO',
    template: () => `DMA CH3 TRANSFERRED ${32 + Math.floor(Math.random() * 64)} KB BUFFER | ZERO RETRIES`,
  },
  {
    category: 'BOILER',
    level: 'INFO',
    template: () => `GROUPHEAD SOLENOID: 3-WAY VALVE CYCLING | EXTRACTION RATIO: 1:2.02 LOCKED`,
  },
  {
    category: 'MODEM',
    level: 'OK',
    template: () => `PPP LCP: ECHO-REPLY RECEIVED (28ms) | REMOTE: 198.51.100.24 | MTU 1500`,
  },
  {
    category: 'CRT',
    level: 'INFO',
    template: () => `PHOSPHOR AMBER/GREEN EMISSION: 85Hz REFRESH STABLE | APERTURE GRILLE ALIGNED`,
  },
];

export const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      timestamp: '02:00:14.102',
      category: 'SYS',
      level: 'OK',
      message: 'SYSTEM BOOT: DATA MIND CAFE TELEMETRY ENGINE v4.2 INITIALIZED',
    },
    {
      id: 'init-2',
      timestamp: '02:00:14.340',
      category: 'CRT',
      level: 'OK',
      message: 'CATHODE RAY DEFLECTION YOKE ENERGIZED: 1024x768 @ 85Hz STABLE',
    },
    {
      id: 'init-3',
      timestamp: '02:00:15.012',
      category: 'BOILER',
      level: 'OK',
      message: 'ESPRESSO GROUPHEAD DUAL PID CONTROLLER: 9.20 BAR PRESSURE LOCKED',
    },
    {
      id: 'init-4',
      timestamp: '02:00:15.890',
      category: 'MODEM',
      level: 'OK',
      message: 'USRobotics COURIER V.90 DUAL STANDARD: HANDSHAKE NEGOTIATED 53333 BPS',
    },
  ]);

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [filter, setFilter] = useState<'ALL' | 'SYS' | 'BOILER' | 'MODEM'>('ALL');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Real-time log streamer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
      
      const randomItem = TELEMETRY_POOL[Math.floor(Math.random() * TELEMETRY_POOL.length)];
      
      const newEntry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: timeStr,
        category: randomItem.category,
        level: randomItem.level,
        message: randomItem.template(),
      };

      setLogs((prev) => {
        const next = [...prev, newEntry];
        // Keep last 100 entries to prevent memory leak
        return next.length > 100 ? next.slice(-100) : next;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Autoscroll
  useEffect(() => {
    if (autoScroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleManualProbe = () => {
    audioSynth.playKeyClick(7);
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const probeEntry: LogEntry = {
      id: `probe-${Date.now()}`,
      timestamp: timeStr,
      category: 'SYS',
      level: 'INFO',
      message: `PROBE COMMAND EXECUTED: ALL TELEMETRY CHANNELS RESPONDING (LATENCY: 0.8ms)`,
    };
    setLogs((prev) => [...prev, probeEntry]);
  };

  const handleClear = () => {
    audioSynth.playRelayClick();
    setLogs([]);
  };

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter((l) => l.category === filter);

  return (
    <div className="relative rounded-xl chassis-brushed-dark p-4 shadow-2xl border-2 border-zinc-800 font-mono-code">
      {/* Corner Hex Screws */}
      <HexScrew size={14} className="absolute left-2.5 top-2.5" />
      <HexScrew size={14} className="absolute right-2.5 top-2.5" />
      <HexScrew size={14} className="absolute left-2.5 bottom-2.5" />
      <HexScrew size={14} className="absolute right-2.5 bottom-2.5" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800 px-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full led-jewel-emerald animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-zinc-100 text-engraved uppercase tracking-wider">
                HARDWARE TELEMETRY & SYSTEM LOGS
              </span>
              <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-black/80 border border-emerald-900/60">
                LIVE 10Hz
              </span>
            </div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-widest">
              DEVICE: /DEV/TTY0 · REAL-TIME KERNEL RING BUFFER
            </div>
          </div>
        </div>

        {/* Filter and Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Channel Filters */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-zinc-800 text-[10px]">
            {(['ALL', 'SYS', 'BOILER', 'MODEM'] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  audioSynth.playKeyClick(1);
                  setFilter(f);
                }}
                className={`px-2 py-0.5 rounded uppercase font-bold transition-colors ${
                  filter === f
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Pause / Resume */}
          <button
            onClick={() => {
              audioSynth.playHeavyToggle();
              setIsPaused(!isPaused);
            }}
            title={isPaused ? 'Resume Streaming' : 'Pause Streaming'}
            className="btn-skeuo-push p-1.5 rounded text-zinc-300 hover:text-white"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Manual Probe */}
          <button
            onClick={handleManualProbe}
            title="Inject Diagnostic Probe"
            className="btn-skeuo-push px-2 py-1 rounded text-[10px] text-amber-300 font-bold flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">PROBE</span>
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            title="Clear Buffer"
            className="btn-skeuo-push p-1.5 rounded text-zinc-400 hover:text-red-400"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Terminal Window: Green on Black with Scanlines */}
      <div className="relative rounded-lg overflow-hidden border-2 border-zinc-800 bg-black shadow-[inset_0_2px_10px_rgba(0,0,0,0.95)]">
        {/* Subtle CRT Scanlines */}
        <div className="crt-scanlines absolute inset-0 z-20 pointer-events-none opacity-40" />

        {/* Terminal Text Area */}
        <div
          ref={logsContainerRef}
          className="relative z-10 h-48 sm:h-56 p-3 sm:p-4 overflow-y-auto font-terminal text-base sm:text-lg text-emerald-400 leading-snug space-y-1 select-text scroll-smooth"
          style={{
            textShadow: '0 0 6px rgba(52, 211, 153, 0.6), 0 0 12px rgba(52, 211, 153, 0.3)',
          }}
        >
          {filteredLogs.length === 0 ? (
            <div className="text-zinc-600 font-mono-code text-xs py-8 text-center">
              LOG BUFFER CLEARED. AWAITING TELEMETRY BURST...
            </div>
          ) : (
            filteredLogs.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2 hover:bg-emerald-950/20 px-1 rounded transition-colors">
                <span className="text-zinc-600 select-none text-xs sm:text-sm font-mono-code shrink-0 pt-0.5">
                  [{entry.timestamp}]
                </span>
                <span
                  className={`text-xs font-mono-code font-bold px-1 rounded shrink-0 ${
                    entry.category === 'SYS'
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                      : entry.category === 'BOILER'
                      ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                      : entry.category === 'MODEM'
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                      : 'text-purple-400 bg-purple-950/40 border border-purple-800/40'
                  }`}
                >
                  {entry.category}
                </span>
                <span className="flex-1 break-all tracking-wide">
                  {entry.message}
                </span>
              </div>
            ))
          )}

          {/* Blinking Phosphor Block Cursor */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-emerald-500 font-mono-code text-xs sm:text-sm select-none">&gt;&gt;</span>
            <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-2.5 px-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono-code">
        <div className="flex items-center gap-3">
          <span>BUFFER: {filteredLogs.length} ENTRIES</span>
          <span>·</span>
          <span>STATUS: {isPaused ? 'HALTED' : 'STREAMING'}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="accent-emerald-500 rounded-xs"
            />
            <span>AUTO-SCROLL</span>
          </label>
        </div>
      </div>

    </div>
  );
};
