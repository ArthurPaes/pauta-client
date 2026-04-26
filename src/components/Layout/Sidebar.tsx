import Icon, { type IconName } from '../Icon';

interface NavItemDef {
  id: string;
  label: string;
  icon: IconName;
  path: string;
}

export const NAV_ITEMS: readonly NavItemDef[] = [
  { id: 'dashboard',  label: 'Dashboard',     icon: 'grid',  path: '/dashboard' },
  { id: 'pautas',     label: 'Pautas',        icon: 'file',  path: '/pautas' },
  { id: 'my-pautas',  label: 'Minhas Pautas', icon: 'user',  path: '/my-pautas' },
  { id: 'my-votes',   label: 'Meus Votos',    icon: 'check', path: '/my-votes' },
];

interface SidebarProps {
  readonly currentPath: string;
  readonly onNavigate: (path: string) => void;
  readonly collapsed: boolean;
  readonly onToggle: () => void;
}

export default function Sidebar({ currentPath, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon"><Icon name="shield" size={18} /></div>
        {!collapsed && <span className="brand-name">Pauta</span>}
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${currentPath === item.path ? ' active' : ''}`}
            onClick={() => onNavigate(item.path)}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon"><Icon name={item.icon} size={18} /></span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="nav-item collapse-btn"
          onClick={onToggle}
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          <span
            className="nav-icon"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }}
          >
            <Icon name="chevLeft" size={18} />
          </span>
          {!collapsed && <span className="nav-label">Recolher</span>}
        </button>
      </div>
    </aside>
  );
}
