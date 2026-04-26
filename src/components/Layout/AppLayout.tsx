import { useState } from 'react';
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Sidebar, { NAV_ITEMS } from './Sidebar';
import Header from './Header';

interface UserData {
  id: number;
  name: string;
  email: string;
  cpf?: string;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/pautas':    'Todas as Pautas',
  '/my-pautas': 'Minhas Pautas',
  '/my-votes':  'Meus Votos',
  '/profile':   'Meu Perfil',
};

function readUser(): UserData | null {
  try {
    const raw = localStorage.getItem('@UserData');
    return raw ? (JSON.parse(raw) as UserData) : null;
  } catch {
    return null;
  }
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = readUser();

  if (!user) return <Navigate to="/login" replace />;

  const matchedNav = NAV_ITEMS.find(n => location.pathname.startsWith(n.path));
  const pageTitle = PAGE_TITLES[location.pathname] ?? matchedNav?.label ?? 'Pauta';

  const handleLogout = () => {
    localStorage.removeItem('@UserData');
    navigate('/login', { replace: true });
  };

  return (
    <div className={`app-layout${collapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar
        currentPath={location.pathname}
        onNavigate={navigate}
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
      />
      <div className="app-main">
        <Header
          user={{ id: user.id, name: user.name, email: user.email, role: 'Associado' }}
          pageTitle={pageTitle}
          onLogout={handleLogout}
        />
        <main className="app-content">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}

export type { UserData };
