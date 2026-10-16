import React, { useState } from 'react';
import { audioSynth } from '../utils/audioSynthesizer';

// 3D Hex Allen Screw / Bolt
export const HexScrew: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`rounded-full bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-900 border border-zinc-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center shrink-0 select-none ${className}`}
  >
    <div
      style={{ width: size * 0.45, height: size * 0.45 }}
      className="bg-zinc-950 rounded-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] flex items-center justify-center"
    >
      <div className="w-[1px] h-full bg-zinc-800 rotate-45" />
    </div>
  </div>
);

// Rackmount Ear with Oval Slot
export const RackmountEar: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <div
    className={`hidden lg:flex flex-col justify-between items-center py-6 px-2 w-8 bg-gradient-to-r ${
      side === 'left' ? 'from-zinc-800 to-zinc-700 border-r' : 'from-zinc-700 to-zinc-800 border-l'
    } border-zinc-900 shadow-inner`}
  >
    <HexScrew size={14} />
    <div className="w-2.5 h-6 rounded-full bg-black/80 border border-zinc-700 shadow-inner flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
    </div>
    <HexScrew size={14} />
  </div>
);

// Analog Needle VU Meter
interface VUMeterProps {
  label: string;
  channel?: string;
  value?: number; // 0 to 100
  isLit?: boolean;
}

export const AnalogVUMeter: React.FC<VUMeterProps> = ({
  label,
  channel = 'CH-A',
  value = 45,
  isLit = true,
}) => {
  // Angle: -45 deg to +45 deg
  const needleAngle = -45 + (Math.min(100, Math.max(0, value)) / 100) * 90;

  return (
    <div className="flex flex-col items-center">
      {/* Outer Inset Bezel */}
      <div className="relative w-36 h-24 rounded-t-full rounded-b-md bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 p-1.5 shadow-[0_4px_8px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-zinc-700">
        
        {/* Amber Backlit Dial Face */}
        <div
          className={`relative w-full h-full rounded-t-full rounded-b-xs overflow-hidden transition-all duration-300 border border-black/40 ${
            isLit
              ? 'bg-gradient-to-b from-[#fde047]/80 via-[#f59e0b]/70 to-[#b45309]/90 shadow-[inset_0_0_15px_rgba(245,158,11,0.6)]'
              : 'bg-zinc-800 opacity-60'
          }`}
        >
          {/* Glass reflection gradient highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />

          {/* Scale Arch and Ticks */}
          <svg className="w-full h-full" viewBox="0 0 140 90">
            {/* Red Danger Zone Arch */}
            <path
              d="M 95,45 A 50,50 0 0,1 125,75"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.5"
            />
            {/* Black Normal Scale Arch */}
            <path
              d="M 15,75 A 50,50 0 0,1 95,45"
              fill="none"
              stroke="#18181b"
              strokeWidth="2.5"
            />

            {/* Scale Numerals */}
            <text x="18" y="72" fontSize="7" fontFamily="Space Mono" fill="#18181b" fontWeight="bold">-20</text>
            <text x="36" y="56" fontSize="7" fontFamily="Space Mono" fill="#18181b" fontWeight="bold">-10</text>
            <text x="58" y="47" fontSize="7" fontFamily="Space Mono" fill="#18181b" fontWeight="bold">-5</text>
            <text x="80" y="45" fontSize="7" fontFamily="Space Mono" fill="#18181b" fontWeight="bold">0</text>
            <text x="100" y="52" fontSize="7" fontFamily="Space Mono" fill="#b91c1c" fontWeight="bold">+2</text>
            <text x="115" y="68" fontSize="7" fontFamily="Space Mono" fill="#b91c1c" fontWeight="bold">+3</text>

            {/* VU Label */}
            <text x="70" y="68" fontSize="11" fontFamily="Space Mono" textAnchor="middle" fill="#09090b" fontWeight="900" letterSpacing="1">
              VU
            </text>
          </svg>

          {/* Pivot Mechanical Needle */}
          <div
            className="absolute bottom-[-6px] left-1/2 w-[2px] h-20 bg-zinc-950 origin-bottom transform -translate-x-1/2 transition-transform duration-100 ease-out"
            style={{
              transform: `translateX(-50%) rotate(${needleAngle}deg)`,
              boxShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            <div className="w-full h-5 bg-red-600 rounded-t" />
          </div>

          {/* Pivot Center Cap */}
          <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-950 border border-zinc-600 shadow-md" />
        </div>
      </div>

      {/* Engraved Subtitle Label */}
      <div className="mt-1 flex items-center gap-2 text-[10px] font-mono-code text-zinc-400 font-bold tracking-wider text-engraved uppercase">
        <span>{channel}</span>
        <span>·</span>
        <span>{label}</span>
      </div>
    </div>
  );
};

// Heavy Industrial Toggle Switch
interface IndustrialToggleProps {
  label: string;
  sublabel?: string;
  isOn: boolean;
  onToggle: () => void;
  ledColor?: 'amber' | 'emerald' | 'ruby' | 'cyan';
}

export const IndustrialToggleSwitch: React.FC<IndustrialToggleProps> = ({
  label,
  sublabel,
  isOn,
  onToggle,
  ledColor = 'amber',
}) => {
  const handleClick = () => {
    audioSynth.playHeavyToggle();
    onToggle();
  };

  const getLedClass = () => {
    if (!isOn) return 'led-jewel-off';
    switch (ledColor) {
      case 'emerald': return 'led-jewel-emerald';
      case 'ruby': return 'led-jewel-ruby';
      case 'cyan': return 'led-jewel-cyan';
      case 'amber':
      default: return 'led-jewel-amber';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* LED Jewel Status Light */}
      <div className={`w-3.5 h-3.5 rounded-full mb-2 transition-all duration-200 border border-black/80 ${getLedClass()}`} />

      {/* Switch Inset Frame */}
      <button
        type="button"
        onClick={handleClick}
        className="relative w-11 h-20 rounded-xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-1.5 border border-zinc-700/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_2px_4px_rgba(0,0,0,0.5)] flex flex-col justify-between items-center group active:scale-98 cursor-pointer"
      >
        {/* Switch mounting plate hex nuts */}
        <div className="w-6 h-2 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-700 rounded-xs shadow-sm" />

        {/* Bat-handle Metal Lever */}
        <div
          className={`relative w-4 h-10 rounded-full toggle-bat-lever transition-all duration-150 transform ${
            isOn ? '-translate-y-2 rotate-[-8deg]' : 'translate-y-2 rotate-[8deg] opacity-75'
          }`}
        >
          <div className="absolute top-1 left-1 right-1 h-2 rounded-full bg-white/60" />
        </div>

        <div className="text-[9px] font-mono-code text-zinc-500 font-bold uppercase">
          {isOn ? 'ON' : 'OFF'}
        </div>
      </button>

      {/* Stamped Label */}
      <div className="mt-2 text-center select-none">
        <div className="text-[11px] font-mono-code font-bold text-zinc-200 text-engraved uppercase tracking-wider">
          {label}
        </div>
        {sublabel && (
          <div className="text-[9px] font-mono-code text-zinc-500 uppercase tracking-widest">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

// Knurled Rotary Potentiometer Knob
interface RotaryKnobProps {
  label: string;
  value: number; // 0 to 100
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
}

export const RotaryKnob: React.FC<RotaryKnobProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
}) => {
  // Rotation from -135deg to +135deg
  const rotation = -135 + ((value - min) / (max - min)) * 270;

  const handleStep = () => {
    audioSynth.playRotaryClick();
    const next = value >= max ? min : value + 10;
    onChange?.(next);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Outer Dial Dial Indicators */}
      <div className="relative w-18 h-18 flex items-center justify-center">
        {/* Radial tick marks */}
        <div className="absolute inset-0 rounded-full border border-dashed border-zinc-600/50 pointer-events-none" />

        {/* Physical Knurled Dial */}
        <button
          type="button"
          onClick={handleStep}
          className="relative w-14 h-14 rounded-full knurled-dial flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          {/* Inner Machined Face */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-600 border border-zinc-500 shadow-inner relative flex items-center justify-center">
            {/* Pointer notch indicator */}
            <div
              className="absolute top-1 w-1 h-3.5 bg-amber-400 rounded-full shadow-[0_0_4px_#f59e0b] origin-bottom"
              style={{
                transform: `rotate(${rotation}deg) translateY(-8px)`,
                transformOrigin: '50% 18px',
              }}
            />
            {/* Center machined screw */}
            <div className="w-3 h-3 rounded-full bg-zinc-950 border border-zinc-700" />
          </div>
        </button>
      </div>

      {/* Label and Value */}
      <div className="mt-1 text-center font-mono-code select-none">
        <div className="text-[10px] font-bold text-zinc-300 text-engraved uppercase tracking-wider">
          {label}
        </div>
        <div className="text-[9px] text-amber-400 font-bold tabular-nums">
          {Math.round(value)}%
        </div>
      </div>
    </div>
  );
};

// Knurled Rotary Knob Slider with Granular Visual Distortion Control
interface KnurledRotarySliderProps {
  label: string;
  sublabel?: string;
  value: number; // e.g. 10 to 150
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  onFireDegauss?: () => void;
}

export const KnurledRotarySlider: React.FC<KnurledRotarySliderProps> = ({
  label,
  sublabel,
  value,
  min = 10,
  max = 150,
  onChange,
  onFireDegauss,
}) => {
  // Angular rotation: -135deg to +135deg
  const rotation = -135 + ((value - min) / (max - min)) * 270;
  // Calculate simulated magnetic flux in kilovolts
  const fluxKV = (0.8 + (value / 100) * 2.6).toFixed(1);

  const handleStepClick = () => {
    audioSynth.playRotaryClick();
    const stepSize = 15;
    const nextVal = value + stepSize > max ? min : value + stepSize;
    onChange(nextVal);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value, 10);
    if (Math.abs(newVal - value) >= 5) {
      audioSynth.playRotaryClick();
    }
    onChange(newVal);
  };

  return (
    <div className="p-3 sm:p-4 rounded-xl inset-bay flex flex-col items-center justify-between border border-zinc-700/80 shadow-2xl relative select-none">
      {/* Top Header Label */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px] font-mono-code">
        <span className="font-bold text-zinc-100 text-engraved uppercase tracking-wider">
          {label}
        </span>
        <span className="text-amber-400 font-bold px-1.5 py-0.5 rounded bg-black/80 border border-amber-900/40 tabular-nums">
          {Math.round(value)}% · {fluxKV} kV
        </span>
      </div>

      {/* Center Knurled Rotary Knob Unit */}
      <div className="my-3 flex flex-col items-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Calibrated Tick Marks Arc */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#3f3f46"
              strokeWidth="2"
              strokeDasharray="4 6"
            />
            {/* Red Surge Zone */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="18 100"
              strokeDashoffset="-40"
            />
          </svg>

          {/* Heavy Machined Knurled Dial */}
          <button
            type="button"
            onClick={handleStepClick}
            title="Click to step rotary dial or use slider below"
            className="relative w-15 h-15 rounded-full knurled-dial flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            {/* Inner Metallic Potentiometer Cap */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-700 to-zinc-900 border border-zinc-500 shadow-inner relative flex items-center justify-center">
              {/* Amber Pointer Notch */}
              <div
                className="absolute top-1.5 w-1.5 h-4 bg-amber-400 rounded-full shadow-[0_0_6px_#f59e0b] origin-bottom transition-transform duration-75"
                style={{
                  transform: `rotate(${rotation}deg) translateY(-8px)`,
                  transformOrigin: '50% 19px',
                }}
              />
              {/* Center machined screw socket */}
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              </div>
            </div>
          </button>
        </div>

        {sublabel && (
          <div className="text-[9px] font-mono-code text-zinc-400 uppercase tracking-widest mt-1 text-center">
            {sublabel}
          </div>
        )}
      </div>

      {/* Granular Precision Slider */}
      <div className="w-full space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[9px] font-mono-code text-zinc-500 font-bold">
          <span>MIN (10%)</span>
          <span className="text-amber-500">100% NOMINAL</span>
          <span className="text-red-400">SURGE (150%)</span>
        </div>

        <div className="p-1 rounded-sm bg-black border border-zinc-800 shadow-inner">
          <input
            type="range"
            min={min}
            max={max}
            step="1"
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 bg-zinc-800 rounded-xs appearance-none cursor-pointer accent-amber-400 focus:outline-none"
          />
        </div>

        {/* Quick Presets & Test Coil Fire Button */}
        <div className="flex items-center justify-between gap-1 pt-1.5">
          <div className="flex items-center gap-1">
            {[25, 75, 100, 150].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  audioSynth.playRotaryClick();
                  onChange(preset);
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold transition-colors ${
                  value === preset
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                    : 'bg-black/50 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>

          {onFireDegauss && (
            <button
              type="button"
              onClick={onFireDegauss}
              className="btn-skeuo-amber px-2 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase tracking-wider shrink-0"
            >
              Test Coil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

