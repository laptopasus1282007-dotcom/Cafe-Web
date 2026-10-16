import React, { useState } from 'react';
import { X, Coffee, Check } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

interface CafeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: (itemName: string) => void;
}

const MENU_ITEMS = [
  {
    id: 'm1',
    name: 'Midnight 56k Cold Brew',
    price: '$1.75',
    category: 'Chilled Coffee',
    description: 'Slow-steeped dark roast brewed overnight in the cafe server closet.',
  },
  {
    id: 'm2',
    name: 'Java Virtual Espresso',
    price: '$2.00',
    category: 'Hot Espresso',
    description: 'Double shot rich crema extraction with zero garbage collection pause.',
  },
  {
    id: 'm3',
    name: 'Phosphor Amber Chai',
    price: '$2.25',
    category: 'Spiced Tea',
    description: 'Fresh cardamom, cinnamon, clove, and steamed whole milk.',
  },
  {
    id: 'm4',
    name: 'LAN Party Jolt Cola',
    price: '$1.50',
    category: 'Chilled Soda',
    description: 'Double-caffeine chilled fizzy cola for all-night gaming sessions.',
  },
  {
    id: 'm5',
    name: 'Floppy Disk Butter Toast',
    price: '$1.25',
    category: 'Warm Snack',
    description: 'Square-cut golden toasted bread with salted farm butter.',
  },
  {
    id: 'm6',
    name: 'Spicy Kimchi Cup Ramen',
    price: '$1.80',
    category: 'Late Night Fuel',
    description: 'The definitive 2:00 AM cyber cafe comfort food with piping hot broth.',
  },
];

export const CafeOrderModal: React.FC<CafeOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirmOrder,
}) => {
  const [selectedId, setSelectedId] = useState<string>(MENU_ITEMS[0].id);
  const [orderedSuccess, setOrderedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOrder = (name: string) => {
    audioSynth.playCoffeeClink();
    setOrderedSuccess(name);
    onConfirmOrder(name);
    setTimeout(() => {
      setOrderedSuccess(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel-amber border border-amber-500/30 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-outfit font-bold text-lg text-white">
                The Data Mind Cafe Barista Counter
              </h2>
              <p className="text-xs text-zinc-400 font-mono-code">
                Freshly ground beans · Steamed milk · Zero latency
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioSynth.playKeyClick(1);
              onClose();
            }}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-lg text-white">Order Sent to Barista!</h3>
            <p className="font-mono-code text-xs text-amber-300">
              Your {orderedSuccess} is being prepared at the counter.
            </p>
          </div>
        ) : (
          <>
            {/* Menu Items List */}
            <div className="mt-4 space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {MENU_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    audioSynth.playKeyClick(2);
                    setSelectedId(item.id);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedId === item.id
                      ? 'border-amber-500 bg-amber-500/15 shadow-sm'
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-outfit font-semibold text-sm text-zinc-100">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono-code text-zinc-400 uppercase">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono-code text-sm font-bold text-amber-400">
                      {item.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrder(item.name);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-medium transition-colors cursor-pointer active:scale-95"
                    >
                      Order
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono-code text-zinc-400">
              <span>Orders billed to your terminal session card.</span>
              <button
                onClick={() => {
                  const item = MENU_ITEMS.find((m) => m.id === selectedId);
                  if (item) handleOrder(item.name);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-semibold rounded-xl active:scale-95 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Place Selected Order
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
