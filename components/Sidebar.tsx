import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/' },
    { name: 'Cargos', icon: 'work', path: '/roles' },
    { name: 'Vagas', icon: 'description', path: '/jobs' },
    { name: 'Auditoria', icon: 'fact_check', path: '/audit' },
  ];

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-colors duration-200 fixed h-full z-10 hidden lg:flex text-sidebar-foreground">
      <div className="p-6">
        <div className="flex gap-4 items-start mb-8">
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-sm shrink-0 bg-sidebar-accent mt-1" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPnhm69OkfJ6JYDAQVptxP6CaG5JqDjnlTHYSgUyLXCmc5KZUhy5KdpSNnchyXvmVKbiZnE6wyqJxvaGw1cdYwY8MwZDG2pVfNYIJiQZkM8IusjTwS9qspALvwr_4vrnpW6EGAmdaAkweNToggKCvUy0WBR-Rdb2H332jiKtUtFa6G76n1GOcXrAg2mkxYOu_u2WPDh3NSa4Fc7HR0KI1Rfmvng-KcsUmWZfk82pdr0LaZMp5iKAFOVHofveqlLIk4BvdS7FyTeiw")' }}
          >
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-sidebar-foreground text-base font-bold leading-tight truncate">Recrutamento</h1>
            <p className="text-muted-foreground text-xs font-medium leading-normal truncate mb-2">Painel Administrativo</p>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-md transition-colors w-fit shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
             const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
             return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              location.pathname.startsWith('/settings')
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
          <span className="material-symbols-outlined text-[18px]">contrast</span>
          <span>Alternar Tema</span>
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