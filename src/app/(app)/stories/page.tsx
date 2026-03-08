'use client';
import { useState } from 'react';
import { MOCK_STORIES, MOCK_USERS } from '@/lib/mock-data';
import { X, Plus, Eye, Clock, Upload, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatRelativeTime } from '@/lib/crypto';

function StoryViewer({ story, onClose }: { story: (typeof MOCK_STORIES)[0]; onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const user = MOCK_USERS.find(u => u.id === story.userId);
  const expiresIn = Math.max(0, Math.floor((new Date(story.expiresAt).getTime() - Date.now()) / 3600000));

  return (
    <div className="snap-overlay" onClick={onClose}>
      {/* Story Image */}
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: '400px',
        height: '90vh', maxHeight: '700px',
        borderRadius: '20px', overflow: 'hidden',
        position: 'relative',
        background: '#000',
      }}>
        <img src={story.mediaUrl} alt="Story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px' }}>
          <div style={{ height: '3px', borderRadius: '3px', background: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'white', borderRadius: '3px',
              animation: 'none',
            }} />
          </div>
        </div>

        {/* Header */}
        <div style={{
          position: 'absolute', top: '24px', left: '16px', right: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'var(--gradient-purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              boxShadow: '0 0 0 2px white',
            }}>{user?.avatar}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                {user?.username}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                <Clock size={9} style={{ display: 'inline', marginRight: '3px' }} />
                Expires in {expiresIn}h
              </div>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Caption */}
        {story.caption && (
          <div style={{
            position: 'absolute', bottom: '80px', left: '16px', right: '16px',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            borderRadius: '12px', padding: '10px 14px',
            fontSize: '14px', color: 'white',
          }}>
            {story.caption}
          </div>
        )}

        {/* Viewer Info */}
        <div style={{
          position: 'absolute', bottom: '16px', left: '16px', right: '16px',
        }}>
          <button onClick={() => setShowViewers(!showViewers)}
            style={{
              width: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
              padding: '10px 16px', cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
            }}>
            <Eye size={14} />
            {story.viewers.length} viewers
            {showViewers && (
              <div style={{ marginLeft: '8px', display: 'flex', gap: '-4px' }}>
                {story.viewers.map((vid) => {
                  const v = MOCK_USERS.find(u => u.id === vid);
                  return v ? (
                    <span key={vid} style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'var(--gradient-primary)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', border: '1px solid rgba(255,255,255,0.2)',
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
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Stories</h1>
        <button id="add-story-btn" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 18px', background: 'var(--gradient-primary)',
          border: 'none', borderRadius: '12px', color: 'white',
          fontWeight: 600, fontSize: '13px', cursor: 'pointer',
        }}>
          <Plus size={16} /> Add Story
        </button>
      </div>

      {/* Your Story */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: '16px', padding: '20px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--bg-glass)', border: '2px dashed var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative',
        }}>
          <div style={{ fontSize: '28px' }}>{currentUser?.avatar}</div>
          <div style={{
            position: 'absolute', bottom: '-2px', right: '-2px',
            width: '20px', height: '20px', borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-primary)',
          }}>
            <Plus size={10} color="white" />
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>Your Story</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            <Upload size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Tap to add a photo or video from your device
          </div>
        </div>
      </div>

      {/* Friends' Stories */}
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
        Friends' Stories
      </h2>

      {/* Story rings row */}
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
        {storyUsers.map((uid) => {
          const user = MOCK_USERS.find(u => u.id === uid);
          const userStories = visibleStories.filter(s => s.userId === uid);
          const story = userStories[0];
          if (!user) return null;
          return (
            <button key={uid} id={`story-ring-${uid}`}
              onClick={() => setViewingStory(story)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', minWidth: '64px' }}>
              <div className="story-ring">
                <div className="story-ring-inner">
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                  }}>{user.avatar}</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.username}
              </span>
            </button>
          );
        })}
      </div>

      {/* Story Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {visibleStories.map((story) => {
          const user = MOCK_USERS.find(u => u.id === story.userId);
          const expiresIn = Math.max(0, Math.floor((new Date(story.expiresAt).getTime() - Date.now()) / 3600000));
          return (
            <button key={story.id} id={`story-card-${story.id}`}
              onClick={() => setViewingStory(story)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                borderRadius: '16px', overflow: 'hidden',
                position: 'relative', aspectRatio: '9/16',
              }}>
              <img src={story.mediaUrl} alt="Story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8))',
              }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--gradient-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{user?.avatar}</div>
                  <span style={{ fontSize: '12px', color: 'white', fontWeight: 600 }}>{user?.username}</span>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>
                  <Clock size={9} style={{ display: 'inline', marginRight: '3px' }} /> {expiresIn}h left
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                  <Eye size={10} /> {story.viewers.length}
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
