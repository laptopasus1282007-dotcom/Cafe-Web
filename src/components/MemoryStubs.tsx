import React, { useState } from 'react';
import { 
  Disc, 
  Receipt, 
  Send, 
  FileText, 
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

interface FloppyDisk {
  id: string;
  label: string;
  subtitle: string;
  capacity: string;
  files: string[];
}

const FLOPPY_DISKS: FloppyDisk[] = [
  {
    id: 'disk-1',
    label: 'WINAMP_SKINS_99',
    subtitle: 'Classic Visualizers & Decks',
    capacity: '1.44 MB HD',
    files: ['Pioneer_Deck_Pro.wsz', 'Matrix_Green.wsz', 'Brushed_Metal_v2.wsz', 'readme.txt'],
  },
  {
    id: 'disk-2',
    label: 'CS_LAN_AUTOEXEC',
    subtitle: 'Counter-Strike 1.3 LAN Binds',
    capacity: '1.44 MB HD',
    files: ['autoexec.cfg', 'rate_25000.cfg', 'cl_updaterate_101.cfg', 'buy_m4_ak47.cfg'],
  },
  {
    id: 'disk-3',
    label: 'LOFI_MP3_VAULT',
    subtitle: '128kbps Late Night Mixes',
    capacity: '1.44 MB Multi-Span',
    files: ['midnight_rain_lofi.mp3.part1', 'cafe_ambience_56k.mp3.part1', 'tracklist.doc'],
  },
  {
    id: 'disk-4',
    label: 'MIRC_CHAT_LOGS',
    subtitle: '#datacafe on EFnet Archive',
    capacity: '1.44 MB HD',
    files: ['chatlog_19991012.log', 'ops_bot_script.tcl', 'channel_rules.txt'],
  },
];

interface GuestLog {
  id: number;
  handle: string;
  booth: string;
  time: string;
  note: string;
}

const INITIAL_LOGS: GuestLog[] = [
  {
    id: 1,
    handle: 'xX_CyberGhost_Xx',
    booth: 'Booth 03',
    time: '02:14 AM',
    note: 'Still here finishing this HTML website in Notepad with table layouts and animated GIF flames. Coffee is amazing.',
  },
  {
    id: 2,
    handle: 'NeonBarista',
    booth: 'Front Register',
    time: '01:45 AM',
    note: 'Fresh pot of dark roast is ready. Someone please turn down the volume in Booth #8!',
  },
  {
    id: 3,
    handle: 'FragMaster_99',
    booth: 'Booth 07',
    time: '01:10 AM',
    note: 'GG everyone on cs_assault. Headshot with the Scout from the vents was legendary.',
  },
  {
    id: 4,
    handle: 'mIRC_Wanderer',
    booth: 'Booth 01',
    time: '12:30 AM',
    note: 'Listening to the rain outside and downloading Linux ISOs on 56k overnight. Pure cozy peace.',
  },
];

export const MemoryStubs: React.FC = () => {
  const [selectedDisk, setSelectedDisk] = useState<FloppyDisk>(FLOPPY_DISKS[0]);
  const [guestLogs, setGuestLogs] = useState<GuestLog[]>(INITIAL_LOGS);
  const [newHandle, setNewHandle] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleSelectDisk = (disk: FloppyDisk) => {
    audioSynth.playFloppySeek();
    setSelectedDisk(disk);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    audioSynth.playKeyClick(5);

    const log: GuestLog = {
      id: Date.now(),
      handle: newHandle.trim() || 'Anonymous_Surfer',
      booth: `Booth 0${Math.floor(Math.random() * 8) + 1}`,
      time: 'Just now',
      note: newNote.trim(),
    };

    setGuestLogs([log, ...guestLogs]);
    setNewNote('');
    setNewHandle('');
  };

  return (
    <section id="archive" className="relative z-20 max-w-6xl mx-auto px-4 py-8 space-y-8 font-outfit">
      
      {/* 2-Column: Cyber Cafe Session Pass + 3.5" Floppy Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cyber Cafe Session Ticket Pass */}
        <div className="lg:col-span-5 rounded-2xl glass-panel-amber p-6 shadow-xl border border-amber-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm tracking-wide uppercase text-white">
                Cyber Cafe Session Ticket
              </span>
            </div>
            <span className="font-mono-code text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              #894-98 · PAID
            </span>
          </div>

          <div className="mt-4 space-y-2.5 font-mono-code text-xs text-zinc-300">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Terminal:</span>
              <span className="text-amber-300 font-bold">Booth #04 (Dell 17" CRT)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Rate:</span>
              <span>$1.50 / hour</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Connection:</span>
              <span className="text-emerald-400 font-bold">56,000 BPS V.90 OK</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-400">Allocated Time:</span>
              <span className="text-amber-400">120 Minutes Remaining</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Installed Apps:</span>
              <span>Netscape 4.75 · Winamp 2.91 · mIRC</span>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono-code text-zinc-400 leading-relaxed">
            “Notice: Please save your downloads to a 3.5" floppy diskette before your session ends. Unlimited coffee refills available at counter.”
          </div>
        </div>

        {/* Right: 3.5" Floppy Disk Drive Reader */}
        <div className="lg:col-span-7 rounded-2xl glass-panel p-6 shadow-xl border border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Disc className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm tracking-wide uppercase text-white">
                Drive A:\ 3.5" Floppy Vault
              </span>
            </div>
            <span className="text-xs font-mono-code text-zinc-400">Click disk to insert</span>
          </div>

          {/* Floppy Disks Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FLOPPY_DISKS.map((disk) => {
              const isSelected = selectedDisk.id === disk.id;
              return (
                <button
                  key={disk.id}
                  onClick={() => handleSelectDisk(disk)}
                  className={`p-3 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between h-28 relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 shadow-md shadow-amber-500/10'
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}
                >
                  {/* Metal sliding shutter */}
                  <div className="w-10 h-3 bg-zinc-300 rounded-sm mb-2 border border-zinc-400 flex items-center justify-end px-1 shadow-sm">
                    <div className="w-2 h-1 bg-zinc-800 rounded-xs" />
                  </div>

                  <div>
                    <div className="font-mono-code text-[11px] font-bold text-zinc-100 truncate">
                      {disk.label}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {disk.subtitle}
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 w-2 h-2 border border-zinc-500 rounded-xs bg-black" />
                </button>
              );
            })}
          </div>

          {/* Directory Drawer */}
          <div className="mt-4 p-4 rounded-xl bg-black/60 border border-white/10 font-mono-code">
            <div className="flex items-center justify-between text-xs text-amber-400 pb-2 border-b border-white/10">
              <span className="font-bold">A:\{selectedDisk.label}&gt; DIR /W</span>
              <span className="text-zinc-500 text-[11px]">{selectedDisk.capacity}</span>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedDisk.files.map((file, i) => (
                <div
                  key={i}
                  onClick={() => audioSynth.playKeyClick(i)}
                  className="flex items-center gap-2 text-zinc-300 hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-white/5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Guestbook & Midnight Chat Wall */}
      <div className="rounded-2xl glass-panel p-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm tracking-wide uppercase text-white">
              Midnight Cafe Terminal Guest Logs
            </span>
          </div>
          <span className="text-xs font-mono-code text-zinc-400">
            {guestLogs.length} Entries Recorded
          </span>
        </div>

        {/* Guest Logs Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {guestLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-zinc-300 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 mb-2 border-b border-white/5 font-mono-code">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">{log.handle}</span>
                  <span>·</span>
                  <span>{log.booth}</span>
                </div>
                <span>{log.time}</span>
              </div>
              <p className="leading-relaxed font-outfit text-sm text-zinc-200">
                “{log.note}”
              </p>
            </div>
          ))}
        </div>

        {/* Add Entry Form */}
        <form onSubmit={handleAddLog} className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            placeholder="Nickname (e.g. Cyber_Neo)"
            className="sm:w-1/3 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono-code text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Leave a late night thought or 90s cyber memory..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono-code text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-amber-500/20 shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Note</span>
          </button>
        </form>
      </div>

    </section>
  );
};
