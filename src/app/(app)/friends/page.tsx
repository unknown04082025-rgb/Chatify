'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mock-data';
import { Search, UserPlus, UserCheck, X, Check, Clock, Users, Activity, Shield } from 'lucide-react';

export default function FriendsPage() {
  const { currentUser, friendRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend } = useAppStore();
  const [activeTab, setActiveTab] = useState<'accepted' | 'pending' | 'discover'>('accepted');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  // Derived friend state
  const myRequests = friendRequests.filter(r => r.senderId === currentUser.id || r.receiverId === currentUser.id);
  const acceptedFriendsIds = myRequests
    .filter(r => r.status === 'accepted')
    .map(r => r.senderId === currentUser.id ? r.receiverId : r.senderId);
  const pendingReceived = myRequests.filter(r => r.status === 'pending' && r.receiverId === currentUser.id);
  const pendingSent = myRequests.filter(r => r.status === 'pending' && r.senderId === currentUser.id);

  // Lists
  const acceptedFriends = MOCK_USERS.filter(u => acceptedFriendsIds.includes(u.id));
  const discoverUsers = MOCK_USERS.filter(u => 
    u.id !== currentUser.id && 
    u.type !== 'admin' &&
    !acceptedFriendsIds.includes(u.id) &&
    !pendingReceived.some(r => r.senderId === u.id) &&
    !pendingSent.some(r => r.receiverId === u.id)
  );

  const filteredAccepted = acceptedFriends.filter(u => u.username.includes(searchQuery.toLowerCase()) || u.displayName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDiscover = discoverUsers.filter(u => u.username.includes(searchQuery.toLowerCase()) || u.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '24px', animation: 'fadeInUp 0.5s ease forwards' }}>
      
      {/* Header section with Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '42px', height: '42px', borderRadius: '14px', 
            background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 25px rgba(124,58,237,0.3)'
          }}>
            <Users size={20} color="white" />
          </div>
          <span>Friends & <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Network</span></span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginLeft: '54px' }}>Manage your private connections and discover new people.</p>
        
        {/* Profile Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
          
          <div className="stat-card card-glow" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #7c3aed, transparent)', borderRadius: '16px 16px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={18} color="#7c3aed" />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Accepted Friends</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'white' }}>{acceptedFriends.length}</div>
          </div>

          <div className="stat-card" style={{ position: 'relative', background: 'rgba(12,17,35,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} color="#ec4899" />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Requests Sent</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'white' }}>{pendingSent.length}</div>
          </div>

          <div className="stat-card" style={{ position: 'relative', background: 'rgba(12,17,35,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={18} color="#10b981" />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Requests Received</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'white' }}>{pendingReceived.length}</div>
          </div>

        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', height: '1px', marginBottom: '28px' }} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(12,17,35,0.8)', backdropFilter: 'blur(20px)', padding: '6px', borderRadius: '16px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => setActiveTab('accepted')} style={{
          padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
          background: activeTab === 'accepted' ? 'var(--gradient-primary)' : 'transparent',
          color: activeTab === 'accepted' ? 'white' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: activeTab === 'accepted' ? '0 0 20px rgba(124,58,237,0.3)' : 'none',
        }}>
          <UserCheck size={16} /> Accepted 
          <span style={{ background: activeTab === 'accepted' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', transition: 'all 0.3s' }}>{acceptedFriends.length}</span>
        </button>
        <button onClick={() => setActiveTab('pending')} style={{
          padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
          background: activeTab === 'pending' ? 'rgba(255,255,255,0.05)' : 'transparent',
          color: activeTab === 'pending' ? 'var(--text-primary)' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <Clock size={16} /> Requests 
          {(pendingReceived.length > 0) && (
            <span style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', boxShadow: '0 0 10px rgba(239,68,68,0.4)' }}>{pendingReceived.length}</span>
          )}
        </button>
        <button onClick={() => setActiveTab('discover')} style={{
          padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
          background: activeTab === 'discover' ? 'rgba(255,255,255,0.05)' : 'transparent',
          color: activeTab === 'discover' ? 'var(--text-primary)' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <Search size={16} /> Discover
        </button>
      </div>

      {/* Search Bar for Discover & Accepted */}
      {(activeTab === 'accepted' || activeTab === 'discover') && (
        <div style={{ position: 'relative', marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder={activeTab === 'discover' ? "Search new people..." : "Search friends..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ width: '100%', paddingLeft: '44px', background: 'rgba(12,17,35,0.6)', backdropFilter: 'blur(20px)' }}
          />
        </div>
      )}

      {/* TAB: Accepted Friends */}
      {activeTab === 'accepted' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', animation: 'slideInLeft 0.4s ease' }}>
          {filteredAccepted.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>No friends found.</div>
          ) : (
            filteredAccepted.map(friend => (
              <div key={friend.id} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', position: 'relative', flexShrink: 0, boxShadow: '0 0 15px rgba(124,58,237,0.2)' }}>
                    {friend.avatar}
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', background: friend.status === 'available' ? '#10b981' : '#475569', border: '2px solid rgba(12,17,35,1)' }} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{friend.displayName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      @{friend.username}
                      <span style={{ opacity: 0.5 }}>•</span>
                      <span className={friend.status === 'available' ? 'status-available' : 'status-not-available'} style={{ fontSize: '10px' }}>
                        {friend.status === 'available' ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeFriend(friend.id)} style={{ padding: '8px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove friend" onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}>
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: Pending Requests */}
      {activeTab === 'pending' && (
        <div style={{ animation: 'slideInLeft 0.4s ease' }}>
          {pendingReceived.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }} />
                Pending Received
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                {pendingReceived.map(req => {
                  const sender = MOCK_USERS.find(u => u.id === req.senderId);
                  if (!sender) return null;
                  return (
                    <div key={req.id} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '3px solid var(--accent-violet)', background: 'linear-gradient(90deg, rgba(124,58,237,0.05), transparent)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                          {sender.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '15px' }}>{sender.displayName}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{sender.username} • wants to connect</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => rejectFriendRequest(req.id)} style={{ width: '38px', height: '38px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.15)'} onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.05)'}>
                          <X size={18} />
                        </button>
                        <button onClick={() => acceptFriendRequest(req.id)} style={{ width: '38px', height: '38px', borderRadius: '12px', border: 'none', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 15px rgba(124,58,237,0.3)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                          <Check size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pendingSent.length > 0 && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sent Requests</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {pendingSent.map(req => {
                  const receiver = MOCK_USERS.find(u => u.id === req.receiverId);
                  if (!receiver) return null;
                  return (
                    <div key={req.id} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', filter: 'grayscale(0.5)' }}>
                          {receiver.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{receiver.displayName}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={10} /> Pending approval
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pendingReceived.length === 0 && pendingSent.length === 0 && (
             <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>No pending requests.</div>
          )}
        </div>
      )}

      {/* TAB: Discover */}
      {activeTab === 'discover' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', animation: 'slideInLeft 0.4s ease' }}>
          {filteredDiscover.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>No new users to discover.</div>
          ) : (
            filteredDiscover.map(user => (
              <div key={user.id} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    {user.avatar}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{user.username}</div>
                  </div>
                </div>
                {user.type === 'atithi' && (
                  <div style={{ position: 'absolute', top: '-8px', right: '12px', background: 'rgba(236,72,153,0.15)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.3)', padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Shield size={10} /> Exclusive
                  </div>
                )}
                <button onClick={() => sendFriendRequest(user.id)} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)', color: 'var(--accent-violet)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(124,58,237,0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(124,58,237,0.1)'}>
                  <UserPlus size={16} /> Add 
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
