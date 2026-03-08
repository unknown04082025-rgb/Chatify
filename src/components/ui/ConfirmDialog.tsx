'use client';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: '20px', width: '90%', maxWidth: '360px',
        padding: '24px', position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        animation: 'slide-up 0.2s ease-out'
      }}>
        <button onClick={onCancel} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            {cancelText}
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            background: 'var(--gradient-primary)', border: 'none',
            color: 'white', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
            transition: 'all 0.2s'
          }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
