import { useState } from 'react';
import Icon from '../Icon';

export interface SelectableUser {
  id: number;
  name: string;
  email: string;
}

interface AddUsersModalProps {
  readonly allUsers: readonly SelectableUser[];
  readonly initialSelected: readonly number[];
  readonly onClose: (selected: number[] | null) => void;
}

export default function AddUsersModal({ allUsers, initialSelected, onClose }: AddUsersModalProps) {
  const [selected, setSelected] = useState<Set<number>>(() => new Set(initialSelected));

  const toggle = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => onClose(null)}
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
            <div className="modal-eyebrow">Gerenciar acesso</div>
            <h2 className="modal-title">Usuários habilitados</h2>
          </div>
          <button type="button" className="modal-close" onClick={() => onClose(null)}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-desc" style={{ marginBottom: 16 }}>
            Selecione quais usuários podem votar nesta pauta.
          </p>
          <div className="users-list">
            {allUsers.length === 0 && (
              <div style={{ padding: 16, color: 'var(--text-3)', fontSize: 13, textAlign: 'center' }}>
                Nenhum usuário disponível.
              </div>
            )}
            {allUsers.map(u => {
              const isSelected = selected.has(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  className={`user-row${isSelected ? ' selected' : ''}`}
                  onClick={() => toggle(u.id)}
                >
                  <div className="user-avatar-sm">{(u.name[0] ?? '?').toUpperCase()}</div>
                  <div className="user-row-info">
                    <span className="user-row-name">{u.name}</span>
                    <span className="user-row-email">{u.email}</span>
                  </div>
                  <div className={`user-check${isSelected ? ' checked' : ''}`}>
                    {isSelected && <Icon name="check" size={12} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <span style={{ fontSize: 13, color: 'var(--text-2)', marginRight: 'auto' }}>
            {selected.size} usuário(s) selecionado(s)
          </span>
          <button type="button" className="btn-ghost" onClick={() => onClose(null)}>
            Cancelar
          </button>
          <button type="button" className="btn-primary" onClick={() => onClose([...selected])}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
