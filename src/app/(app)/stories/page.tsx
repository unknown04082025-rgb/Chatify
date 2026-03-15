'use client';
import { useState } from 'react';
import { MOCK_STORIES, MOCK_USERS } from '@/lib/mock-data';
import { X, Plus, Eye, Clock, Upload, ChevronRight, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatRelativeTime } from '@/lib/crypto';

function StoryViewer({ story, onClose }: { story: (typeof MOCK_STORIES)[0]; onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const user = MOCK_USERS.find(u => u.id === story.userId);
  const expiresIn = Math.max(0, Math.floor((new Date(story.expiresAt).getTime() - Date.now()) / 3600000));

  return (
    <div className="snap-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      {/* Story Image */}
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: '420px',
        height: '90vh', maxHeight: '740px',
        borderRadius: '24px', overflow: 'hidden',
        position: 'relative',
        background: '#0a0a0a',
        boxShadow: '0 25px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
        animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <img src={story.mediaUrl} alt="Story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* Top Gradient Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
        }} />

        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', gap: '4px' }}>
          <div style={{ flex: 1, height: '3px', borderRadius: '3px', background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'white', borderRadius: '3px',
              animation: 'none',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)',
            }} />
          </div>
        </div>

        {/* Header */}
        <div style={{
          position: 'absolute', top: '32px', left: '16px', right: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              border: '2px solid rgba(255,255,255,0.8)',
              boxShadow: '0 0 15px rgba(0,0,0,0.5)',
            }}>{user?.avatar}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                {user?.username}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} />
                {expiresIn}h
              </div>
            </div>
          </div>
          <button onClick={onClose}
            style={{ 
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', 
              width: '36px', height: '36px', cursor: 'pointer', color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}>
            <X size={18} />
          </button>
        </div>

        {/* Bottom Gradient Overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
        }} />

        {/* Caption */}
        {story.caption && (
          <div style={{
            position: 'absolute', bottom: '84px', left: '20px', right: '20px',
            background: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '14px 18px',
            fontSize: '15px', color: 'white', lineHeight: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            {story.caption}
          </div>
        )}

        {/* Viewer Info */}
        <div style={{
          position: 'absolute', bottom: '20px', left: '20px', right: '20px',
        }}>
          <button onClick={() => setShowViewers(!showViewers)}
            style={{
              width: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px',
              padding: '12px 20px', cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: showViewers ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
              marginBottom: showViewers ? '8px' : '0',
            }}>
            <Eye size={16} style={{ color: 'var(--accent-violet)' }} />
            <span style={{ fontWeight: 600 }}>{story.viewers.length} viewers</span>
            {showViewers && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '-6px' }}>
                {story.viewers.map((vid) => {
                  const v = MOCK_USERS.find(u => u.id === vid);
                  return v ? (
                    <span key={vid} style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: 'var(--gradient-primary)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', border: '2px solid rgba(20,20,20,0.9)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}>{v.avatar}</span>
                  ) : null;
                })}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoriesPage() {
  const { currentUser, friendRequests } = useAppStore();
  const [viewingStory, setViewingStory] = useState<(typeof MOCK_STORIES)[0] | null>(null);

  const acceptedFriendsIds = currentUser ? friendRequests
    .filter(r => r.status === 'accepted' && (r.senderId === currentUser.id || r.receiverId === currentUser.id))
    .map(r => r.senderId === currentUser.id ? r.receiverId : r.senderId) : [];

  const visibleStories = MOCK_STORIES.filter(s => s.userId === currentUser?.id || acceptedFriendsIds.includes(s.userId));
  const storyUsers = [...new Set(visibleStories.map(s => s.userId))];

  return (
    <div style={{ padding: '24px', maxWidth: '840px', margin: '0 auto', animation: 'fadeInUp 0.5s ease forwards' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '42px', height: '42px', borderRadius: '14px', 
            background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 25px rgba(124,58,237,0.3)'
          }}>
            <BookOpen size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>Stories</h1>
        </div>
        <button id="add-story-btn" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 20px', background: 'var(--gradient-primary)',
          border: 'none', borderRadius: '14px', color: 'white',
          fontWeight: 600, fontSize: '14px', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
          transition: 'transform 0.2s',
        }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
          <Plus size={18} /> Add Story
        </button>
      </div>

      {/* Your Story */}
      <div className="glass-card" style={{
        padding: '24px', marginBottom: '32px',
        display: 'flex', alignItems: 'center', gap: '20px',
        borderLeft: '4px solid var(--accent-violet)',
      }}>
        <div style={{
          width: '68px', height: '68px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }} onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent-violet)'; e.currentTarget.style.background='rgba(124,58,237,0.05)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}>
          <div style={{ fontSize: '32px' }}>{currentUser?.avatar}</div>
          <div style={{
            position: 'absolute', bottom: '-2px', right: '-2px',
            width: '24px', height: '24px', borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(12,17,35,0.9)',
            boxShadow: '0 0 10px rgba(124,58,237,0.4)',
          }}>
            <Plus size={12} color="white" strokeWidth={3} />
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>Your Story</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} style={{ color: 'var(--accent-violet)' }} />
            Tap to add a photo or video from your device
          </div>
        </div>
      </div>

      {/* Friends' Stories */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Sparkles size={16} style={{ color: 'var(--accent-violet)' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Recent Updates
        </h2>
      </div>

      {/* Story rings row */}
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', WebkitOverflowScrolling: 'touch' }}>
        {storyUsers.map((uid) => {
          const user = MOCK_USERS.find(u => u.id === uid);
          const userStories = visibleStories.filter(s => s.userId === uid);
          const story = userStories[0];
          if (!user) return null;
          return (
            <button key={uid} id={`story-ring-${uid}`}
              onClick={() => setViewingStory(story)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', minWidth: '72px', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
              <div style={{
                padding: '3px', borderRadius: '50%',
                background: 'linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6)',
                boxShadow: '0 0 15px rgba(236,72,153,0.3)',
              }}>
                <div style={{
                  border: '3px solid rgba(12,17,35,1)',
                  borderRadius: '50%', padding: '2px',
                  background: 'rgba(255,255,255,0.05)',
                }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px',
                  }}>{user.avatar}</div>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'center', maxWidth: '72px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.username}
              </span>
            </button>
          );
        })}
      </div>

      {/* Story Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {visibleStories.map((story) => {
          const user = MOCK_USERS.find(u => u.id === story.userId);
          const expiresIn = Math.max(0, Math.floor((new Date(story.expiresAt).getTime() - Date.now()) / 3600000));
          return (
            <button key={story.id} id={`story-card-${story.id}`}
              onClick={() => setViewingStory(story)}
              style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', textAlign: 'left',
                borderRadius: '20px', overflow: 'hidden',
                position: 'relative', aspectRatio: '9/16',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(124,58,237,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(0,0,0,0.3)'; }}>
              <img src={story.mediaUrl} alt="Story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.9))',
              }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gradient-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>{user?.avatar}</div>
                  <span style={{ fontSize: '14px', color: 'white', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{user?.username}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                    <Clock size={10} /> {expiresIn}h left
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                    <Eye size={12} /> {story.viewers.length}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {viewingStory && <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />}
    </div>
  );
}
