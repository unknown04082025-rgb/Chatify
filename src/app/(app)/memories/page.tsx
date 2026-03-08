'use client';
import { useState } from 'react';
import { MOCK_MEMORIES, MOCK_VAULT_ITEMS } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, Plus, Bell, CalendarDays, Image, StickyNote, X } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function MemoriesPage() {
  const today = new Date('2026-03-08');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Memories 🗓️</h1>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bell size={14} style={{ color: 'var(--accent-violet)' }} /> {memories.filter(m => m.reminderType).length} reminders active
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        {/* Calendar */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
          {/* Month Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button id="prev-month" onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: '6px' }}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '16px' }}>
              {MONTHS[month]} {year}
            </span>
            <button id="next-month" onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: '6px' }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {/* Empty cells for first day offset */}
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
                    padding: '6px 4px', borderRadius: '10px', fontSize: '13px',
                    background: isSelected ? 'var(--gradient-primary)' :
                      isToday ? 'rgba(124,58,237,0.15)' :
                      memory ? 'rgba(16,185,129,0.1)' : 'transparent',
                    border: `1px solid ${isSelected ? 'transparent' :
                      isToday ? 'var(--accent-violet)' :
                      memory ? 'rgba(16,185,129,0.2)' : 'transparent'}`,
                    color: isSelected ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    position: 'relative',
                  }}>
                  {day}
                  {memory && !isSelected && (
                    <div style={{
                      position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)',
                      width: '4px', height: '4px', borderRadius: '50%', background: '#10b981',
                    }} />
                  )}
                  {memory?.reminderType && (
                    <div style={{
                      position: 'absolute', top: '2px', right: '2px',
                      width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-violet)',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Memories List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Recent Memories</div>
          {memories.slice(0, 4).map((mem) => (
            <div key={mem.id} id={`memory-card-${mem.id}`}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '14px', padding: '14px',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CalendarDays size={13} style={{ color: 'var(--accent-violet)' }} />
                <span style={{ fontSize: '12px', color: 'var(--accent-violet)', fontWeight: 600 }}>{mem.date}</span>
                {mem.reminderType && (
                  <span style={{
                    marginLeft: 'auto', fontSize: '10px', padding: '2px 8px', borderRadius: '6px',
                    background: 'rgba(124,58,237,0.1)', color: 'var(--accent-violet)', border: '1px solid rgba(124,58,237,0.2)',
                  }}>
                    🔔 {reminderLabels[mem.reminderType]}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>{mem.note}</p>
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
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '24px', padding: '32px', maxWidth: '440px', width: '100%',
            position: 'relative',
          }}>
            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
            }}><X size={18} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <CalendarDays size={20} style={{ color: 'var(--accent-violet)' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Add Memory</h2>
            </div>
            <div style={{
              padding: '8px 12px', background: 'rgba(124,58,237,0.1)', borderRadius: '8px',
              fontSize: '13px', color: 'var(--accent-violet)', fontWeight: 600, marginBottom: '16px',
            }}>📅 {selectedDate}</div>

            <textarea className="input-field" rows={4}
              placeholder="Write a note for this memory..."
              value={note} onChange={e => setNote(e.target.value)}
              id="memory-note"
              style={{ resize: 'none', marginBottom: '16px', lineHeight: 1.6 }} />

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell size={13} /> Set Reminder
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['1month', '6months', '1year'] as const).map((r) => (
                  <button key={r} id={`reminder-${r}`}
                    onClick={() => setReminder(reminder === r ? null : r)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '10px', fontSize: '12px',
                      background: reminder === r ? 'rgba(124,58,237,0.15)' : 'var(--bg-glass)',
                      border: `1px solid ${reminder === r ? 'var(--accent-violet)' : 'var(--border-color)'}`,
                      color: reminder === r ? 'var(--accent-violet)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}>
                    {reminderLabels[r]}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" id="save-memory-btn" onClick={handleAddMemory} style={{ width: '100%' }}>
              <StickyNote size={15} /> Save Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
