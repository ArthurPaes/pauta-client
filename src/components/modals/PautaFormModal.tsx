import { useState } from 'react';
import Icon from '../Icon';

export interface PautaFormData {
  name: string;
  description: string;
  expiration: number;
}

interface PautaFormModalProps {
  readonly mode?: 'create' | 'edit';
  readonly initial?: PautaFormData;
  readonly onClose: (data: PautaFormData | null) => void;
}

const EMPTY: PautaFormData = { name: '', description: '', expiration: 30 };

export default function PautaFormModal({ mode = 'create', initial, onClose }: PautaFormModalProps) {
  const [form, setForm] = useState<PautaFormData>(initial ?? EMPTY);

  const set = (k: keyof PautaFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = k === 'expiration' ? Number(e.target.value) || 0 : e.target.value;
      setForm(f => ({ ...f, [k]: value }));
    };

  const valid = form.name.trim() && form.description.trim() && form.expiration > 0;

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
            <div className="modal-eyebrow">{mode === 'create' ? 'Nova pauta' : 'Editar pauta'}</div>
            <h2 className="modal-title">
              {mode === 'create' ? 'Criar uma nova pauta' : form.name || 'Editar pauta'}
            </h2>
          </div>
          <button type="button" className="modal-close" onClick={() => onClose(null)}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label htmlFor="pauta-name">Nome da pauta</label>
            <input
              id="pauta-name"
              type="text"
              className="modal-input"
              placeholder="Ex: Aprovação do orçamento 2026"
              value={form.name}
              onChange={set('name')}
            />
          </div>
          <div className="field">
            <label htmlFor="pauta-desc">Descrição</label>
            <textarea
              id="pauta-desc"
              className="modal-input modal-textarea"
              placeholder="Descreva o que será votado..."
              value={form.description}
              onChange={set('description')}
              rows={3}
            />
          </div>
          <div className="field">
            <label htmlFor="pauta-exp">Duração (minutos)</label>
            <input
              id="pauta-exp"
              type="number"
              className="modal-input"
              min={1}
              value={form.expiration}
              onChange={set('expiration')}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-ghost" onClick={() => onClose(null)}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!valid}
            onClick={() => onClose(form)}
          >
            {mode === 'create' ? 'Criar Pauta' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
