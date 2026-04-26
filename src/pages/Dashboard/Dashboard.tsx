import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Icon, { type IconName } from '../../components/Icon';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';
import { usePautas } from '../../hooks/usePautas';
import type { PautaModel } from '../../components/PautaCard';
import type { UserData } from '../../components/Layout/AppLayout';

interface StatCardProps {
  readonly label: string;
  readonly value: string | number;
  readonly sub?: string;
  readonly icon: IconName;
  readonly accent: string;
  readonly trend?: number;
}

function StatCard({ label, value, sub, icon, accent, trend }: StatCardProps) {
  return (
    <div className="stat-card" style={{ ['--card-accent' as string]: accent }}>
      <div className="stat-icon" style={{ background: accent + '22', color: accent }}>
        <Icon name={icon} size={20} />
      </div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
      {trend !== undefined && (
        <div
          className="stat-trend"
          style={{ color: trend >= 0 ? 'var(--green)' : 'var(--red)' }}
        >
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as const;

function computeBarData(pautas: readonly PautaModel[]) {
  const now = new Date();
  const months: { label: string; approved: number; rejected: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: MONTHS_PT[d.getMonth()] ?? '', approved: 0, rejected: 0 });
  }
  const closed = pautas.filter(p => p.isExpired && p.totalVotes > 0);
  const totalApproved = closed.filter(p => p.votesTrue > p.votesFalse).length;
  const totalRejected = closed.length - totalApproved;
  const last = months[months.length - 1];
  if (last) {
    last.approved = totalApproved;
    last.rejected = totalRejected;
  }
  return months;
}

export default function Dashboard() {
  const { user } = useOutletContext<{ user: UserData }>();
  const { pautas, loading } = usePautas(user.id);

  const stats = useMemo(() => {
    const open       = pautas.filter(p => !p.isExpired);
    const closed     = pautas.filter(p => p.isExpired);
    const closedWithVotes = closed.filter(p => p.totalVotes > 0);
    const approved   = closedWithVotes.filter(p => p.votesTrue > p.votesFalse);
    const rejected   = closedWithVotes.filter(p => p.votesTrue <= p.votesFalse);
    const noVotes    = pautas.filter(p => p.totalVotes === 0);
    const approvalRate = closedWithVotes.length > 0
      ? Math.round((approved.length / closedWithVotes.length) * 100)
      : 0;
    return { open, closed, closedWithVotes, approved, rejected, noVotes, approvalRate };
  }, [pautas]);

  const donutData = [
    { label: 'Abertas',    value: stats.open.length,     color: 'var(--accent)' },
    { label: 'Aprovadas',  value: stats.approved.length, color: 'var(--green)'  },
    { label: 'Rejeitadas', value: stats.rejected.length, color: 'var(--red)'    },
    { label: 'Sem votos',  value: stats.noVotes.length,  color: 'var(--amber)'  },
  ];

  const barData = useMemo(() => computeBarData(pautas), [pautas]);
  const recent = useMemo(() => [...pautas].sort((a, b) => b.id - a.id).slice(0, 5), [pautas]);

  if (loading) {
    return (
      <div className="empty-state">
        <span
          className="spinner"
          style={{ borderColor: 'var(--surface-3)', borderTopColor: 'var(--accent)' }}
        ></span>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="stat-grid">
        <StatCard
          label="Total de Pautas"
          value={pautas.length}
          icon="file"
          accent="var(--accent)"
        />
        <StatCard
          label="Pautas Abertas"
          value={stats.open.length}
          icon="clock"
          accent="var(--accent)"
        />
        <StatCard
          label="Taxa de Aprovação"
          value={`${stats.approvalRate}%`}
          icon="percent"
          accent="var(--green)"
          sub={`${stats.approved.length} de ${stats.closedWithVotes.length} encerradas`}
        />
        <StatCard
          label="Sem Votos"
          value={stats.noVotes.length}
          icon="alert"
          accent="var(--amber)"
          sub="pautas sem participação"
        />
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Distribuição de Pautas</span>
          </div>
          <div className="donut-wrapper">
            <div style={{ position: 'relative' }}>
              <DonutChart data={donutData} size={180} thickness={32} />
              <div className="donut-center">
                <span className="donut-total">{pautas.length}</span>
                <span className="donut-label">total</span>
              </div>
            </div>
            <div className="donut-legend">
              {donutData.map(d => (
                <div key={d.label} className="legend-item">
                  <span className="legend-dot" style={{ background: d.color }}></span>
                  <span className="legend-text">{d.label}</span>
                  <span className="legend-val">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Histórico de Votações</span>
            <span className="chart-sub">Últimos 6 meses</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <BarChart data={barData} width={420} height={160} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'var(--green)' }}></span>
              <span className="legend-text">Aprovadas</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'var(--red)' }}></span>
              <span className="legend-text">Rejeitadas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <span className="chart-title">Atividade Recente</span>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <p>Nenhuma pauta para exibir.</p>
          </div>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Pauta</th>
                <th>Status</th>
                <th>Votos</th>
                <th>Aprovação</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(p => {
                const pct = p.totalVotes > 0 ? Math.round((p.votesTrue / p.totalVotes) * 100) : null;
                const passed = p.votesTrue > p.votesFalse && p.totalVotes > 0;
                return (
                  <tr key={p.id}>
                    <td className="recent-name">{p.name}</td>
                    <td>
                      {p.isExpired ? (
                        <span className="chip chip-closed">Encerrada</span>
                      ) : (
                        <span className="chip chip-open">Aberta</span>
                      )}
                    </td>
                    <td className="recent-votes">{p.totalVotes}</td>
                    <td>
                      {pct === null ? (
                        <span style={{ color: 'var(--text-3)', fontSize: 13 }}>—</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="mini-bar-bg">
                            <div
                              className="mini-bar-fill"
                              style={{
                                width: `${pct}%`,
                                background: passed ? 'var(--green)' : 'var(--red)',
                              }}
                            ></div>
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-2)', minWidth: 30 }}>
                            {pct}%
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
