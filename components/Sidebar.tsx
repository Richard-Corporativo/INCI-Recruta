import React, { useMemo, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = React.useState('light');

  const navItems = useMemo(() => [
    { name: 'Dashboard', icon: 'dashboard', path: '/' },
    { name: 'Cargos', icon: 'work', path: '/roles' },
    { name: 'Banco de Talentos', icon: 'group', path: '/talent-bank' },
    { name: 'Vagas', icon: 'description', path: '/jobs' },
    { name: 'Auditoria', icon: 'fact_check', path: '/audit' },
  ], []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('recruitsys_theme', newTheme);
  }, [theme]);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('recruitsys_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/vagas');
  }, [logout, navigate]);

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-colors duration-200 ease-in-out fixed h-full z-10 hidden lg:flex text-sidebar-foreground">
      <div className="p-6">
        <div className="flex gap-4 items-center mb-8 bg-sidebar-accent/50 p-3 rounded-lg border border-sidebar-border transition-colors duration-200 ease-in-out">
          <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm border border-primary/20 transition-colors duration-200 ease-in-out">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : '?'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-sidebar-foreground text-sm font-semibold leading-tight truncate transition-colors">{user?.name || 'Recrutamento'}</h1>
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider truncate transition-colors">{user?.role || 'Admin'}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: linkActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 ${isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground'
                  }`}
              >
                <span className={`material-symbols-outlined transition-colors ${isActive ? 'filled' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-sm transition-colors ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="h-px bg-sidebar-border my-2 mx-3"></div>

          <NavLink
            to="/settings"
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 ${isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border'
              : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground'
              }`}
          >
            <span className={`material-symbols-outlined transition-colors ${location.pathname.startsWith('/settings') ? 'filled' : ''}`}>settings</span>
            <span className={`text-sm transition-colors ${location.pathname.startsWith('/settings') ? 'font-semibold' : 'font-medium'}`}>Configurações</span>
          </NavLink>
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-all duration-200 ease-in-out w-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
          <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-medium text-destructive hover:text-destructive/80 transition-all duration-200 ease-in-out w-full outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded-sm active:scale-95"
          aria-label="Sair do Sistema"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sair do Sistema</span>
        </button>

        <div className="bg-sidebar-accent/30 rounded-lg p-4 border border-sidebar-border transition-all duration-200 ease-in-out">
          <h3 className="font-semibold text-sm text-sidebar-foreground mb-1">Precisa de Ajuda?</h3>
          <p className="text-xs text-muted-foreground mb-3">Consulte a documentação do sistema.</p>
          <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors outline-none focus-visible:underline" aria-label="Ver Documentação">Ver Documentação →</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
