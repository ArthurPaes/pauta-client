import Icon from '../Icon';

interface ConfirmModalProps {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Excluir',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel} role="presentation">
      <div
        className="modal modal-sm"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 className="modal-title" style={{ color: 'var(--red)' }}>{title}</h2>
          <button type="button" className="modal-close" onClick={onCancel}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-desc">{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="button" className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
