'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mock-data';
import { Search, UserPlus, UserCheck, X, Check, Clock } from 'lucide-react';

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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Friends</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your connections</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-glass)', padding: '6px', borderRadius: '16px', width: 'fit-content' }}>
        <button onClick={() => setActiveTab('accepted')} style={{
          padding: '8px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600,
          background: activeTab === 'accepted' ? 'var(--gradient-primary)' : 'transparent',
          color: activeTab === 'accepted' ? 'white' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <UserCheck size={16} /> My Friends <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{acceptedFriends.length}</span>
        </button>
        <button onClick={() => setActiveTab('pending')} style={{
          padding: '8px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600,
          background: activeTab === 'pending' ? 'var(--bg-secondary)' : 'transparent',
          color: activeTab === 'pending' ? 'var(--text-primary)' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <Clock size={16} /> Requests 
          {(pendingReceived.length > 0) && (
            <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{pendingReceived.length}</span>
          )}
        </button>
        <button onClick={() => setActiveTab('discover')} style={{
          padding: '8px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600,
          background: activeTab === 'discover' ? 'var(--bg-secondary)' : 'transparent',
          color: activeTab === 'discover' ? 'var(--text-primary)' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <Search size={16} /> Discover
        </button>
      </div>

      {/* Search Bar for Discover & Accepted */}
      {(activeTab === 'accepted' || activeTab === 'discover') && (
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder={activeTab === 'discover' ? "Search new people..." : "Search friends..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '16px 16px 16px 44px', borderRadius: '16px',
              background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
              color: 'var(--text-primary)', fontSize: '15px'
            }}
          />
        </div>
      )}

      {/* TAB: Accepted Friends */}
      {activeTab === 'accepted' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredAccepted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No friends found.</div>
          ) : (
            filteredAccepted.map(friend => (
              <div key={friend.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', position: 'relative' }}>
                    {friend.avatar}
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', background: friend.status === 'available' ? '#10b981' : '#475569', border: '2px solid var(--bg-card)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{friend.displayName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>@{friend.username}</div>
                  </div>
                </div>
                <button onClick={() => removeFriend(friend.id)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: '#ef4444', fontWeight: 600, cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: Pending Requests */}
      {activeTab === 'pending' && (
        <div>
          {pendingReceived.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Received Requests</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {pendingReceived.map(req => {
                  const sender = MOCK_USERS.find(u => u.id === req.senderId);
                  if (!sender) return null;
                  return (
                    <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--accent-violet)', boxShadow: '0 4px 20px rgba(124,58,237,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                          {sender.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '16px' }}>{sender.displayName}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>wants to connect</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => rejectFriendRequest(req.id)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <X size={20} />
                        </button>
                        <button onClick={() => acceptFriendRequest(req.id)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                          <Check size={20} />
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
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Sent Requests</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {pendingSent.map(req => {
                  const receiver = MOCK_USERS.find(u => u.id === req.receiverId);
                  if (!receiver) return null;
                  return (
                    <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', opacity: 0.7 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                          {receiver.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '15px' }}>{receiver.displayName}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Pending approval</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pendingReceived.length === 0 && pendingSent.length === 0 && (
             <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No pending requests.</div>
          )}
        </div>
      )}

      {/* TAB: Discover */}
      {activeTab === 'discover' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredDiscover.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No new users to discover.</div>
          ) : (
            filteredDiscover.map(user => (
              <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    {user.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{user.displayName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>@{user.username}</div>
                  </div>
                </div>
                <button onClick={() => sendFriendRequest(user.id)} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserPlus size={16} /> Add Friend
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
