'use client';
import { useState } from 'react';
import { MOCK_MEMORIES } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function MemoriesPage() {
  const today = new Date('2026-03-08');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-08');
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');
  const [reminder, setReminder] = useState<'1month'|'6months'|'1year'|null>(null);
  const [memories, setMemories] = useState(MOCK_MEMORIES);
  const [activeTab, setActiveTab] = useState('Timeline');

  // getDay() gives 0 for Sunday. Convert to 0 for Monday to match grid
  let firstDay = new Date(year, month, 1).getDay() - 1;
  if (firstDay === -1) firstDay = 6;
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const getDateStr = (day: number) => `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const getMemory = (day: number) => memories.find(m => m.date === getDateStr(day));
  const selectedMemory = memories.find(m => m.date === selectedDate);

  const handleAddMemory = () => {
    if (!selectedDate || !note) return;
    setMemories(prev => [...prev, {
      // eslint-disable-next-line react-hooks/purity
      id: `mem-${Date.now()}`,
      userId: 'user-1',
      date: selectedDate,
      note,
      attachedVaultItems: [],
      reminderType: reminder,
      createdAt: new Date().toISOString(),
    }]);
    setNote('');
    setReminder(null);
    setShowModal(false);
  };

  const padPrevMonthDays = Array.from({ length: firstDay });

  return (
    <div className="flex-1 w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-full flex flex-col items-center justify-start overflow-y-auto">
      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel {
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .active-glow {
            box-shadow: 0 0 15px rgba(36, 99, 235, 0.4);
        }
        .dark .bg-glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .bg-glass-card { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); border: 1px solid rgba(0, 0, 0, 0.05); }
      `}} />
      
      <div className="w-full max-w-4xl pb-24 animate-in fade-in duration-500">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cobalt-accent text-white shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">Memories</h1>
            </div>
            <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">search</span>
                </button>
                <button onClick={() => setShowModal(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 text-primary transition-colors hover:bg-primary hover:text-white">
                    <span className="material-symbols-outlined">add</span>
                </button>
            </div>
        </header>

        {/* Segmented Control */}
        <div className="px-4 pt-6">
            <div className="flex p-1 bg-slate-200/50 dark:bg-white/5 rounded-xl border border-slate-300/50 dark:border-white/5">
                {['Timeline', 'Vault', 'Shared'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-sm rounded-lg transition-all
                            ${activeTab === tab 
                                ? 'font-semibold bg-primary text-white active-glow' 
                                : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`
                        }
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* Glass Calendar Grid */}
        <section className="p-4">
            <div className="bg-glass-card rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 px-2">
                    <button onClick={prevMonth} className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors p-1"><ChevronLeft size={20}/></button>
                    <h2 className="text-lg md:text-xl font-bold tracking-tight">{MONTHS[month]} {year}</h2>
                    <button onClick={nextMonth} className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors p-1"><ChevronRight size={20}/></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
                    {DAYS.map(d => (
                        <span key={d} className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 font-bold">{d}</span>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {padPrevMonthDays.map((_, i) => (
                        <div key={`prev-${i}`} className="h-12 flex items-center justify-center text-slate-400 dark:text-slate-700 text-sm"></div>
                    ))}
                    
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = getDateStr(day);
                        const memory = getMemory(day);
                        const isSelected = dateStr === selectedDate;

                        return (
                            <button 
                                key={day} 
                                onClick={() => setSelectedDate(dateStr)}
                                className={`h-12 flex flex-col items-center justify-center text-sm rounded-xl relative transition-all
                                    ${isSelected 
                                        ? 'font-bold bg-primary text-white active-glow scale-105 z-10' 
                                        : 'font-medium hover:bg-slate-200 dark:hover:bg-white/5'}`
                                }
                            >
                                {day}
                                {memory && !isSelected && (
                                    <div className="w-1 h-1 bg-primary rounded-full absolute bottom-2"></div>
                                )}
                                {memory?.reminderType && !isSelected && (
                                    <div className="flex gap-[2px] absolute bottom-2">
                                        <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>

        {/* Date Detailed View */}
        <section className="px-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Memory Highlights</h3>
                <span className="text-xs text-primary font-semibold">{new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            
            {!selectedMemory ? (
                <div className="bg-glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 border-dashed border-2 min-h-[160px]">
                    <span className="material-symbols-outlined text-4xl text-slate-400">history_edu</span>
                    <p className="text-sm font-medium text-slate-500">No memories recorded on this day.</p>
                    <button onClick={() => setShowModal(true)} className="mt-2 text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        Add Memory
                    </button>
                </div>
            ) : (
                <>
                    {/* Note Card */}
                    <div className="bg-glass-card rounded-2xl p-5 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Thought of the day</p>
                            <span className="material-symbols-outlined text-slate-500 text-sm cursor-pointer hover:text-primary">more_horiz</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-2 border-slate-300 dark:border-slate-700 pl-3">
                          &ldquo;{selectedMemory.note}&rdquo;
                        </p>
                    </div>

                    {/* Image Attachments Mockup (If has attachments) - just showing exactly like Stitch template */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-glass-card">
                            <img className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzt8C_lcquH4HvGlstHwccDq4GmUaL-_OvOvgtot-X5sP8lDAIYD3z9IfR1PLvf3PNV1OefN-OTezQNEG3anEZOOOGPZjmhVIVdtmhMn26xk_6AoF4qT5RzpaUm3T9tGlXblXmcGS9kehhiWC6gMtAF_1Mc2oazMCQxzDZ6rQ8jNKruUxjIWl9Wa7R4MVvkmGRDVIO43oPt3BZYf9TLNt4rtAH6JLx4dl2B9-_HMu7b6NCyMgJtxzBF-cYuQxFQYNgIQrb11XJdzc" alt="Memory Attachment" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent"></div>
                            <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-white/90">lock</span>
                                <span className="text-[10px] font-semibold text-white/90 tracking-wide">Vault Storage</span>
                            </div>
                        </div>
                        <div className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-glass-card">
                            <img className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8zBMC-HxaDlBfiPgfjUPLlNAT5_SZX4P1a9BpkSfTlUEDEgvx09rMMSvY1nxhRPCXxIViu_4BLtSrItftMjFaY3r9r1-0NRG56Sn03ZW74qG5d5gTkZ9fhd02rKUGvwZ7zhG8Zud74zWK_xF6Da9_CwLb0DE8RJB0zDNrNtYyMZ7o6hGwEPJZZr47qFqUjO1rGAvl0YDbHQ1ihCOSvJa1jLDxTDzLPV06f0ioRbX4ZTtpMrUznuMeXrI7BKN3VAxiKjXzEidaaNY" alt="Memory Attachment" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent"></div>
                            <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-white/90">videocam</span>
                                <span className="text-[10px] font-semibold text-white/90 tracking-wide">4K Memory</span>
                            </div>
                        </div>
                    </div>

                    {/* Reminder Indicators */}
                    {selectedMemory.reminderType && (
                        <div className="bg-glass-card rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-500">
                                <span className="material-symbols-outlined">notifications_active</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Project Deadline Reminder</h4>
                                <p className="text-xs font-medium text-slate-500 mt-0.5">Recurring alert • {selectedMemory.reminderType}</p>
                            </div>
                            <button className="text-slate-400 hover:text-primary transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 p-1 rounded"><ChevronRight size={18}/></button>
                        </div>
                    )}
                </>
            )}
        </section>
      </div>

      {/* Add Memory Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#111621] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cobalt-accent shadow-lg shadow-primary/30 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Add Memory</h2>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-xs font-bold text-primary uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-[14px]">event</span> {selectedDate}
            </div>

            <textarea 
              rows={4}
              placeholder="What's on your mind today?"
              value={note} 
              onChange={e => setNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none mb-4 placeholder:text-slate-400"
            />

            <div className="mb-6">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">notifications</span> Set Reminder
              </div>
              <div className="flex gap-2">
                {(['1month', '6months', '1year'] as const).map((r) => (
                  <button key={r} onClick={() => setReminder(reminder === r ? null : r)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      reminder === r 
                        ? 'bg-primary/10 border-primary/30 text-primary shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}>
                    {r === '1month' ? '1m' : r === '6months' ? '6m' : '1y'}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleAddMemory} disabled={!note} className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-cobalt-accent text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">save</span> Save Memory
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
