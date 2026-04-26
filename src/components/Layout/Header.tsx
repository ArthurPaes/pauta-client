import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon, { type IconName } from '../Icon';
import { useNotifications, type NotifItem } from '../../hooks/useNotifications';

export interface HeaderUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface HeaderProps {
  readonly user: HeaderUser;
  readonly pageTitle: string;
  readonly onLogout: () => void;
}

const NOTIF_ICON: Record<NotifItem['type'], IconName> = {
  info: 'info',
  warning: 'alert',
  success: 'checkCirc',
};

const NOTIF_COLOR: Record<NotifItem['type'], string> = {
  info: 'var(--accent)',
  warning: 'var(--amber)',
  success: 'var(--green)',
};

function NotifBody({ loading, items }: { readonly loading: boolean; readonly items: readonly NotifItem[] }) {
  if (loading) {
    return (
      <div className="notif-empty">
        <span className="spinner" style={{ width: 24, height: 24, borderColor: 'var(--surface-3)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="notif-empty">
        <Icon name="bell" size={28} />
        <span>Sem notificações</span>
      </div>
    );
  }
  return (
    <>
      {items.map(item => (
        <div key={item.id} className="notif-item">
          <div className="notif-item-icon" style={{ color: NOTIF_COLOR[item.type], background: NOTIF_COLOR[item.type] + '20' }}>
            <Icon name={NOTIF_ICON[item.type]} size={15} />
          </div>
          <div className="notif-item-body">
            <span className="notif-item-title">{item.title}</span>
            <span className="notif-item-text">{item.body}</span>
          </div>
        </div>
      ))}
    </>
  );
}

export default function Header({ user, pageTitle, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [showUser, setShowUser] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const { items, loading, load } = useNotifications(user.id);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showUser && !showNotif) return;
    const close = (e: MouseEvent) => {
      if (notifRef.current?.contains(e.target as Node)) return;
      if (userRef.current?.contains(e.target as Node)) return;
      setShowUser(false);
      setShowNotif(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showUser, showNotif]);

  useEffect(() => {
    if (showNotif) void load();
  }, [showNotif, load]);

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="app-header">
      <div className="header-title">{pageTitle}</div>
      <div className="header-actions">

        {/* Notification bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="header-icon-btn"
            title="Notificações"
            onClick={() => { setShowNotif(v => !v); setShowUser(false); }}
          >
            <Icon name="bell" size={18} />
            {items.length > 0 && <span className="badge-dot">{items.length}</span>}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span className="notif-title">Notificações</span>
                {items.length > 0 && <span className="notif-count-badge">{items.length}</span>}
              </div>
              <div className="notif-body">
                <NotifBody loading={loading} items={items} />
              </div>
            </div>
          )}
        </div>

        {/* User chip */}
        <button
          ref={userRef}
          type="button"
          className="user-chip"
          onClick={() => { setShowUser(v => !v); setShowNotif(false); }}
        >
          <div className="user-avatar">{initials}</div>
          <div className="user-info-mini">
            <span className="user-name-mini">{user.name || 'Associado'}</span>
            <span className="user-role-mini">{user.role || 'Associado'}</span>
          </div>
          <Icon name="chevDown" size={14} />

          {showUser && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <div className="dropdown-divider" />
              <button type="button" className="dropdown-item" onClick={() => navigate('/profile')}>
                <Icon name="user" size={15} /> Meu perfil
              </button>
              <div className="dropdown-divider" />
              <button type="button" className="dropdown-item logout" onClick={onLogout}>
                <Icon name="logout" size={15} /> Sair da conta
              </button>
            </div>
          )}
        </button>

      </div>
    </header>
  );
}
