import { useState } from 'react';
import Icon from '../Icon';

interface VotingPauta {
  name: string;
  description: string;
  expiration: number;
  totalVotes: number;
}

interface VotingModalProps {
  readonly pauta: VotingPauta;
  readonly onClose: (vote: boolean | undefined) => void;
}

export default function VotingModal({ pauta, onClose }: VotingModalProps) {
  const [vote, setVote] = useState<boolean | null>(null);

  return (
    <div
      className="modal-overlay"
      onClick={() => onClose(undefined)}
      role="presentation"
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div>
            <div className="modal-eyebrow">Votação</div>
            <h2 className="modal-title">{pauta.name}</h2>
          </div>
          <button type="button" className="modal-close" onClick={() => onClose(undefined)}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-desc">{pauta.description}</p>
          <div className="modal-meta">
            <span><Icon name="clock" size={14} /> {pauta.expiration} minutos</span>
            <span><Icon name="users" size={14} /> {pauta.totalVotes} votos registrados</span>
          </div>
          <div className="vote-question">Você é a favor desta pauta?</div>
          <div className="vote-options">
            <button
              type="button"
              className={`vote-btn vote-yes${vote === true ? ' selected' : ''}`}
              onClick={() => setVote(true)}
            >
              <Icon name="thumbUp" size={22} />
              <span>Sim, a favor</span>
            </button>
            <button
              type="button"
              className={`vote-btn vote-no${vote === false ? ' selected' : ''}`}
              onClick={() => setVote(false)}
            >
              <Icon name="thumbDown" size={22} />
              <span>Não, contra</span>
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-ghost" onClick={() => onClose(undefined)}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={vote === null}
            onClick={() => onClose(vote ?? undefined)}
          >
            Confirmar Voto
          </button>
        </div>
      </div>
    </div>
  );
}
