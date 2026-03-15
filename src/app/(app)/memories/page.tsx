'use client';
import { useState } from 'react';
import { MOCK_MEMORIES, MOCK_VAULT_ITEMS } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, Plus, Bell, CalendarDays, Image, StickyNote, X, Sparkles } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function MemoriesPage() {
  const today = new Date('2026-03-08');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');
  const [reminder, setReminder] = useState<'1month'|'6months'|'1year'|null>(null);
  const [memories, setMemories] = useState(MOCK_MEMORIES);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const getDateStr = (day: number) => `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const getMemory = (day: number) => memories.find(m => m.date === getDateStr(day));

  const handleAddMemory = () => {
    if (!selectedDate || !note) return;
    setMemories(prev => [...prev, {
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

  const reminderLabels = { '1month': '1 Month', '6months': '6 Months', '1year': '1 Year' };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px',
        animation: 'fadeInUp 0.5s ease forwards',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6d28d9, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(109,40,217,0.3)',
          }}>
            <CalendarDays size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>Memories</h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <Bell size={11} style={{ color: 'var(--accent-violet)' }} /> {memories.filter(m => m.reminderType).length} reminders active
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', animation: 'fadeInUp 0.6s ease forwards' }}>
        {/* Calendar */}
        <div style={{
          background: 'rgba(12,17,35,0.8)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '24px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          {/* Month Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
            <button id="prev-month" onClick={prevMonth} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex',
              padding: '8px', transition: 'all 0.2s',
            }}>
              <ChevronLeft size={18} />
            </button>
            <span style={{
              fontWeight: 700, fontSize: '17px', fontFamily: 'Space Grotesk',
              background: 'var(--gradient-purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {MONTHS[month]} {year}
            </span>
            <button id="next-month" onClick={nextMonth} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex',
              padding: '8px', transition: 'all 0.2s',
            }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {DAYS.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)',
                fontWeight: 600, padding: '6px 0', letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = getDateStr(day);
              const memory = getMemory(day);
              const isToday = dateStr === '2026-03-08';
              const isSelected = dateStr === selectedDate;

              return (
                <button key={day} id={`cal-day-${day}`}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    if (!memory) setShowModal(true);
                  }}
                  style={{
                    padding: '8px 4px', borderRadius: '10px', fontSize: '13px',
                    background: isSelected ? 'var(--gradient-primary)' :
                      isToday ? 'rgba(124,58,237,0.1)' :
                      memory ? 'rgba(16,185,129,0.06)' : 'transparent',
                    border: `1px solid ${isSelected ? 'transparent' :
                      isToday ? 'rgba(124,58,237,0.3)' :
                      memory ? 'rgba(16,185,129,0.15)' : 'transparent'}`,
                    color: isSelected ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    position: 'relative', fontWeight: isToday || isSelected ? 600 : 400,
                    boxShadow: isSelected ? '0 0 15px rgba(124,58,237,0.3)' : 'none',
                  }}>
                  {day}
                  {memory && !isSelected && (
                    <div style={{
                      position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)',
                      width: '4px', height: '4px', borderRadius: '50%', background: '#10b981',
                      boxShadow: '0 0 4px #10b981',
                    }} />
                  )}
                  {memory?.reminderType && (
                    <div style={{
                      position: 'absolute', top: '2px', right: '2px',
                      width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-violet)',
                      boxShadow: '0 0 4px rgba(124,58,237,0.5)',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Memories List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            fontSize: '14px', fontWeight: 600, marginBottom: '4px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Sparkles size={14} style={{ color: 'var(--accent-violet)' }} />
            Memory Highlights
          </div>
          {memories.slice(0, 4).map((mem) => (
            <div key={mem.id} id={`memory-card-${mem.id}`}
              style={{
                background: 'rgba(12,17,35,0.8)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px', padding: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '8px',
                  background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CalendarDays size={12} style={{ color: 'var(--accent-violet)' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--accent-violet)', fontWeight: 600 }}>{mem.date}</span>
                {mem.reminderType && (
                  <span style={{
                    marginLeft: 'auto', fontSize: '10px', padding: '2px 8px', borderRadius: '6px',
                    background: 'rgba(124,58,237,0.08)', color: 'var(--accent-violet)',
                    border: '1px solid rgba(124,58,237,0.15)',
                  }}>
                    🔔 {reminderLabels[mem.reminderType]}
                  </span>
                )}
              </div>
              <p style={{
                fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px',
                fontStyle: 'italic', borderLeft: '2px solid rgba(124,58,237,0.3)', paddingLeft: '12px',
              }}>
                &ldquo;{mem.note}&rdquo;
              </p>
              {mem.attachedVaultItems.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <Image size={11} /> {mem.attachedVaultItems.length} vault item(s) attached
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Memory Modal */}
      {showModal && selectedDate && (
        <div className="snap-overlay" style={{ zIndex: 9000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: 'rgba(12,17,35,0.95)', backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '24px', padding: '36px', maxWidth: '440px', width: '100%',
            position: 'relative',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
            animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', width: '32px', height: '32px',
              cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><X size={16} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--gradient-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(124,58,237,0.3)',
              }}>
                <CalendarDays size={16} color="white" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Add Memory</h2>
            </div>
            <div style={{
              padding: '8px 14px', background: 'rgba(124,58,237,0.08)', borderRadius: '10px',
              fontSize: '13px', color: 'var(--accent-violet)', fontWeight: 600, marginBottom: '18px',
              border: '1px solid rgba(124,58,237,0.12)',
            }}>📅 {selectedDate}</div>

            <textarea className="input-field" rows={4}
              placeholder="Write a note for this memory..."
              value={note} onChange={e => setNote(e.target.value)}
              id="memory-note"
              style={{ resize: 'none', marginBottom: '18px', lineHeight: 1.6 }} />

            <div style={{ marginBottom: '18px' }}>
              <div style={{
                fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                <Bell size={12} /> Set Reminder
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['1month', '6months', '1year'] as const).map((r) => (
                  <button key={r} id={`reminder-${r}`}
                    onClick={() => setReminder(reminder === r ? null : r)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500,
                      background: reminder === r ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${reminder === r ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      color: reminder === r ? 'var(--accent-violet)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {reminderLabels[r]}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" id="save-memory-btn" onClick={handleAddMemory} style={{ width: '100%', height: '48px', borderRadius: '14px', fontSize: '15px' }}>
              <StickyNote size={15} /> Save Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
