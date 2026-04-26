import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Icon, { type IconName } from '../components/Icon';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  msg: string;
  type: ToastType;
}

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

const STYLE: Record<ToastType, { bg: string; icon: IconName }> = {
  success: { bg: 'var(--green)',  icon: 'checkCirc' },
  error:   { bg: 'var(--red)',    icon: 'x' },
  warning: { bg: 'var(--amber)',  icon: 'alert' },
  info:    { bg: 'var(--accent)', icon: 'info' },
};

const removeToast = (id: number) =>
  (prev: Toast[]) => prev.filter(t => t.id !== id);

interface SnackbarProviderProps {
  readonly children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((msg: string, type: ToastType) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(removeToast(id)), 3800);
  }, []);

  const showSuccess = useCallback((m: string) => add(m, 'success'), [add]);
  const showError   = useCallback((m: string) => add(m, 'error'),   [add]);
  const showWarning = useCallback((m: string) => add(m, 'warning'), [add]);
  const showInfo    = useCallback((m: string) => add(m, 'info'),    [add]);

  const value = useMemo<SnackbarContextType>(
    () => ({ showSuccess, showError, showWarning, showInfo }),
    [showSuccess, showError, showWarning, showInfo],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {toasts.map(t => {
          const s = STYLE[t.type];
          return (
            <div key={t.id} className="toast-item" style={{ background: s.bg }}>
              <Icon name={s.icon} size={16} />
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextType {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within a SnackbarProvider');
  return ctx;
}
