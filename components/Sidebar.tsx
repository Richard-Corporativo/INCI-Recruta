import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = React.useState('light');

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/' },
    { name: 'Cargos', icon: 'work', path: '/roles' },
    { name: 'Vagas', icon: 'description', path: '/jobs' },
    { name: 'Auditoria', icon: 'fact_check', path: '/audit' },
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('recruitsys_theme', newTheme);
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('recruitsys_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-colors duration-200 fixed h-full z-10 hidden lg:flex text-sidebar-foreground">
      <div className="p-6">
        <div className="flex gap-4 items-center mb-8 bg-sidebar-accent/50 p-3 rounded-xl border border-sidebar-border">
          <div className="size-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm border border-indigo-200">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : '?'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-sidebar-foreground text-sm font-bold leading-tight truncate">{user?.name || 'Recrutamento'}</h1>
            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider truncate uppercase">{user?.role || 'Admin'}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground'
                  }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="h-px bg-sidebar-border my-2 mx-3"></div>

          <NavLink
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${location.pathname.startsWith('/settings')
              ? 'bg-sidebar-accent text-sidebar-primary'
              : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground'
              }`}
          >
            <span className={`material-symbols-outlined ${location.pathname.startsWith('/settings') ? 'filled' : ''}`}>settings</span>
            <span className={`text-sm ${location.pathname.startsWith('/settings') ? 'font-bold' : 'font-medium'}`}>Configurações</span>
          </NavLink>
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors w-full"
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
          <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-medium text-red-500 hover:text-red-400 transition-colors w-full"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sair do Sistema</span>
        </button>

        <div className="bg-sidebar-accent/30 rounded-xl p-4 border border-sidebar-border">
          <h3 className="font-bold text-sm text-sidebar-foreground mb-1">Precisa de Ajuda?</h3>
          <p className="text-xs text-muted-foreground mb-3">Consulte a documentação do sistema.</p>
          <button className="text-xs font-semibold text-sidebar-primary hover:underline transition-colors">Ver Documentação →</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;