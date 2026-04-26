import Icon from './Icon';

export interface PautaModel {
  id: number;
  name: string;
  description: string;
  expiration: number;
  hasVoted: boolean;
  myVote?: boolean | null;
  totalVotes: number;
  votesTrue: number;
  votesFalse: number;
  isExpired: boolean;
  ownerId?: number;
  allowedUsers?: number[];
}

interface PautaCardProps {
  readonly pauta: PautaModel;
  readonly userId: number;
  readonly onVote: (p: PautaModel) => void;
  readonly onEdit: (p: PautaModel) => void;
  readonly onDelete: (p: PautaModel) => void;
  readonly onAddUsers: (p: PautaModel) => void;
}

export default function PautaCard({
  pauta,
  userId,
  onVote,
  onEdit,
  onDelete,
  onAddUsers,
}: PautaCardProps) {
  const isOwner = pauta.ownerId === userId;
  const allowed = pauta.allowedUsers ?? [];
  const hasAllowList = allowed.length > 0;
  const userAllowed = !hasAllowList || allowed.includes(userId);
  const canVote = !pauta.isExpired && !pauta.hasVoted && userAllowed;
  const notAllowed = !pauta.isExpired && !pauta.hasVoted && !userAllowed;

  const pct = pauta.totalVotes > 0 ? Math.round((pauta.votesTrue / pauta.totalVotes) * 100) : 0;
  const passed = pauta.votesTrue > pauta.votesFalse && pauta.totalVotes > 0;

  return (
    <div className={`pauta-card${pauta.isExpired ? ' expired' : ''}`}>
      <div className="pauta-card-top">
        <div className="pauta-card-meta">
          {pauta.isExpired ? (
            <span className={`chip ${passed ? 'chip-approved' : 'chip-rejected'}`}>
              {passed ? 'Aprovada' : 'Rejeitada'}
            </span>
          ) : (
            <span className="chip chip-open">Aberta</span>
          )}
          {pauta.hasVoted && <span className="chip chip-voted">Votou</span>}
          {isOwner && <span className="chip chip-owner">Criador</span>}
        </div>
        {isOwner && !pauta.isExpired && (
          <div className="pauta-card-actions">
            <button
              type="button"
              className="icon-btn"
              title="Gerenciar usuários"
              onClick={() => onAddUsers(pauta)}
            >
              <Icon name="users" size={15} />
            </button>
            <button
              type="button"
              className="icon-btn"
              title="Editar"
              onClick={() => onEdit(pauta)}
            >
              <Icon name="edit" size={15} />
            </button>
            <button
              type="button"
              className="icon-btn danger"
              title="Excluir"
              onClick={() => onDelete(pauta)}
            >
              <Icon name="trash" size={15} />
            </button>
          </div>
        )}
      </div>

      <h3 className="pauta-card-name">{pauta.name}</h3>
      <p className="pauta-card-desc">{pauta.description}</p>

      <div className="pauta-card-footer">
        <div className="pauta-card-stats">
          <span><Icon name="clock" size={13} /> {pauta.expiration}min</span>
          <span><Icon name="users" size={13} /> {pauta.totalVotes} votos</span>
          {pauta.totalVotes > 0 && (
            <span style={{ color: passed ? 'var(--green)' : 'var(--red)' }}>
              <Icon name={passed ? 'thumbUp' : 'thumbDown'} size={13} /> {pct}% sim
            </span>
          )}
        </div>

        {!pauta.isExpired && (
          <div>
            {canVote && (
              <button type="button" className="btn-primary btn-sm" onClick={() => onVote(pauta)}>
                <Icon name="check" size={14} /> Votar
              </button>
            )}
            {pauta.hasVoted && (
              <span className="voted-badge">
                <Icon name="checkCirc" size={14} /> Voto registrado
              </span>
            )}
            {notAllowed && (
              <span className="voted-badge" style={{ color: 'var(--text-3)' }}>
                <Icon name="info" size={14} /> Sem permissão
              </span>
            )}
          </div>
        )}

        {pauta.isExpired && pauta.totalVotes > 0 && (
          <div className="vote-bar-wrap">
            <div className="vote-bar">
              <div className="vote-bar-yes" style={{ width: `${pct}%` }}></div>
            </div>
            <div className="vote-counts">
              <span style={{ color: 'var(--green)' }}>{pauta.votesTrue} sim</span>
              <span style={{ color: 'var(--red)' }}>{pauta.votesFalse} não</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
