import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api';
import { useSnackbar } from '../../hooks/useSnackbar';
import Icon from '../../components/Icon';

export default function SignUp() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [form, setForm] = useState({ name: '', cpf: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (err) setErr('');
  };

  const handleCpfKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9.\-]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  const valid = form.name && form.cpf && form.email && form.password;

  const handleCreate = async () => {
    setErr('');
    if (!valid) {
      setErr('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      await userApi.createUser(form);
      showSuccess('Conta criada com sucesso!');
      navigate('/login');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao criar conta';
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

        <h1 className="login-title">Criar conta</h1>
        <p className="login-sub">Cadastre-se para participar das votações.</p>

        <form
          className="login-form"
          onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
        >
          <div className="field">
            <label htmlFor="signup-name">Nome completo</label>
            <div className="input-wrap">
              <span className="input-icon"><Icon name="user" size={16} /></span>
              <input
                id="signup-name"
                type="text"
                placeholder="Carlos Silva"
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="signup-cpf">CPF</label>
            <div className="input-wrap">
              <span className="input-icon"><Icon name="shield" size={16} /></span>
              <input
                id="signup-cpf"
                type="text"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={set('cpf')}
                onKeyDown={handleCpfKey}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="signup-email">E-mail</label>
            <div className="input-wrap">
              <span className="input-icon"><Icon name="email" size={16} /></span>
              <input
                id="signup-email"
                type="email"
                placeholder="seuemail@email.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="signup-password">Senha</label>
            <div className="input-wrap">
              <span className="input-icon"><Icon name="lock" size={16} /></span>
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                autoComplete="new-password"
              />
            </div>
          </div>

          {err && (
            <div className="login-err">
              <Icon name="alert" size={14} /> {err}
            </div>
          )}

          <button type="submit" className="btn-primary btn-full" disabled={loading || !valid}>
            {loading ? <span className="spinner"></span> : 'Criar conta'}
          </button>

          <div className="login-switch">
            Já tem conta?{' '}
            <button type="button" className="link-btn" onClick={() => navigate('/login')}>
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
