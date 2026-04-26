import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Icon from '../../components/Icon';
import { usePautas } from '../../hooks/usePautas';
import type { UserData } from '../../components/Layout/AppLayout';

export default function Profile() {
  const { user } = useOutletContext<{ user: UserData }>();
  const { pautas, loading } = usePautas(user.id);

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const maskedCpf = user.cpf
    ? user.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.***.***-$4')
    : '—';

  const stats = useMemo(() => {
    const mine        = pautas.filter(p => p.ownerId === user.id);
    const voted       = pautas.filter(p => p.hasVoted);
    const closedMine  = mine.filter(p => p.isExpired && p.totalVotes > 0);
    const approvedMine = closedMine.filter(p => p.votesTrue > p.votesFalse);
    const approvalRate = closedMine.length > 0
      ? Math.round((approvedMine.length / closedMine.length) * 100)
      : null;
    return { mine, voted, approvalRate, openMine: mine.filter(p => !p.isExpired) };
  }, [pautas, user.id]);

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-lg">{initials}</div>
        <div className="profile-hero-info">
          <h1 className="profile-name">{user.name}</h1>
          <div className="profile-meta">
            <span><Icon name="email" size={14} />{user.email}</span>
            <span><Icon name="shield" size={14} />CPF: {maskedCpf}</span>
          </div>
          <span className="profile-role-badge">Associado</span>
        </div>
      </div>

      {loading ? (
        <div className="empty-state" style={{ padding: '48px 0' }}>
          <span className="spinner" style={{ borderColor: 'var(--surface-3)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : (
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              <Icon name="file" size={20} />
            </div>
            <div className="profile-stat-value">{stats.mine.length}</div>
            <div className="profile-stat-label">Pautas criadas</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'rgba(15,185,129,.12)', color: 'var(--green)' }}>
              <Icon name="check" size={20} />
            </div>
            <div className="profile-stat-value">{stats.voted.length}</div>
            <div className="profile-stat-label">Votos realizados</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'rgba(15,185,129,.12)', color: 'var(--green)' }}>
              <Icon name="thumbUp" size={20} />
            </div>
            <div className="profile-stat-value">
              {stats.approvalRate !== null ? `${stats.approvalRate}%` : '—'}
            </div>
            <div className="profile-stat-label">Aprovação nas suas pautas</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'rgba(245,166,35,.12)', color: 'var(--amber)' }}>
              <Icon name="clock" size={20} />
            </div>
            <div className="profile-stat-value">{stats.openMine.length}</div>
            <div className="profile-stat-label">Pautas abertas agora</div>
          </div>
        </div>
      )}

      <div className="profile-section">
        <div className="profile-section-title">Informações da conta</div>
        <div className="profile-info-grid">
          <div className="profile-info-row">
            <span className="profile-info-label">Nome completo</span>
            <span className="profile-info-value">{user.name}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">E-mail</span>
            <span className="profile-info-value">{user.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">CPF</span>
            <span className="profile-info-value">{maskedCpf}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Papel</span>
            <span className="profile-info-value">Associado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
