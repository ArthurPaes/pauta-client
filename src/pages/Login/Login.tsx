import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useSnackbar } from '../../hooks/useSnackbar';
import Icon from '../../components/Icon';

export default function Login() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (err) setErr('');
  };

  const handleLogin = async () => {
    setErr('');
    if (!form.email || !form.password) {
      setErr('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      await authApi.authenticateUser(form);
      showSuccess('Login efetuado com sucesso');
      navigate('/dashboard');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao logar';
      setErr(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-glow login-glow-1"></div>
      <div className="login-glow login-glow-2"></div>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon"><Icon name="shield" size={22} /></div>
          <span className="login-brand-name">Pauta</span>
        </div>

        <h1 className="login-title">Bem-vindo de volta</h1>
        <p className="login-sub">Entre para votar nas pautas da sua associação.</p>

        <form
          className="login-form"
          onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
        >
          <div className="field">
            <label htmlFor="login-email">E-mail</label>
            <div className="input-wrap">
              <span className="input-icon"><Icon name="email" size={16} /></span>
              <input
                id="login-email"
                type="email"
                placeholder="seuemail@email.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="login-password">Senha</label>
            <div className="input-wrap">
              <span className="input-icon"><Icon name="lock" size={16} /></span>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                autoComplete="current-password"
              />
            </div>
          </div>

          {err && (
            <div className="login-err">
              <Icon name="alert" size={14} /> {err}
            </div>
          )}

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Entrar'}
          </button>

          <div className="login-switch">
            Não tem conta?{' '}
            <button type="button" className="link-btn" onClick={() => navigate('/sign-up')}>
              Cadastre-se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
