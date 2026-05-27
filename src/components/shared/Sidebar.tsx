'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from '@src/lib/router-compat';
import { useAuth } from '@src/hooks/useAuth';
import { Icon } from "@iconify/react";
import Avatar from '@src/components/atoms/Avatar/Avatar';
import { cn } from '@src/lib/utils';

interface SidebarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ expanded, setExpanded }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = useMemo(() => [
    { name: 'Dashboard', icon: 'material-symbols:dashboard-outline', activeIcon: 'material-symbols:dashboard', path: '/admin/dashboard' },
    { name: 'Cargos', icon: 'material-symbols:work-outline', activeIcon: 'material-symbols:work', path: '/admin/roles' },
    { name: 'Banco de Talentos', icon: 'material-symbols:group-outline', activeIcon: 'material-symbols:group', path: '/admin/talent-bank' },
    { name: 'Vagas', icon: 'material-symbols:description-outline', activeIcon: 'material-symbols:description', path: '/admin/jobs' },
    { name: 'Agenda', icon: 'material-symbols:calendar-today-outline', activeIcon: 'material-symbols:calendar-today', path: '/admin/agenda' },
    { name: 'Auditoria', icon: 'material-symbols:fact-check-outline', activeIcon: 'material-symbols:fact-check', path: '/admin/audit' },
  ], []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/vagas');
  }, [logout, navigate]);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border h-full transition-all duration-300 overflow-visible relative",
        expanded ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-sidebar-border transition-all duration-150 shrink-0 h-16",
        expanded ? 'px-6 justify-start' : 'px-4 justify-center'
      )}>
        <Link to="/vagas" className="outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-md shrink-0">
          <img
            src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png"
            alt="INCI Recruta"
            className={expanded ? 'h-8 w-auto transition-all' : 'h-5 w-auto object-contain transition-all'}
          />
        </Link>
      </div>

      {/* Profile Card */}
      {expanded && (
        <div className="flex gap-3 items-center p-4 mx-3 mt-4 rounded-2xl bg-muted/30 border border-border/40 shadow-sm transition-all duration-300 animate-in fade-in zoom-in-95">
          <Avatar
            size="md"
            className="ring-2 ring-white shadow-sm"
            fallback={user?.name ? user.name.split(' ').map(n => n[0]).join('') : '?'}
          />
          <div className="flex flex-col overflow-hidden">
            <p className="text-foreground text-sm font-bold leading-tight truncate">{user?.name || 'Admin'}</p>
            <p className="text-muted-foreground text-[9px] font-bold tracking-[0.15em] truncate uppercase mt-0.5">{user?.role || 'MANAGER'}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 p-3 mt-2">
        {navItems.map((item) => {
          const currentPath = location.pathname || '/';
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150 outline-none border border-transparent",
                expanded ? 'justify-start' : 'justify-center',
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
              title={!expanded ? item.name : undefined}
            >
              <Icon
                icon={isActive ? item.activeIcon : item.icon}
                className={cn("size-5 shrink-0", isActive && "text-primary")}
              />
              {expanded && (
                <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}

        <div className="h-px bg-sidebar-border/60 my-2 mx-2" />

        <Link
          to="/admin/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150 outline-none border border-transparent",
            expanded ? 'justify-start' : 'justify-center',
            (location.pathname || '').startsWith('/admin/settings')
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          )}
          title={!expanded ? 'Configurações' : undefined}
        >
          <Icon
            icon={(location.pathname || '').startsWith('/admin/settings') ? "material-symbols:settings" : "material-symbols:settings-outline"}
            className={cn("size-5 shrink-0", (location.pathname || '').startsWith('/admin/settings') && "text-primary")}
          />
          {expanded && (
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">
              Configurações
            </span>
          )}
        </Link>
      </nav>

      {/* Footer */}
      <div className={`border-t border-sidebar-border p-3 ${expanded ? '' : 'flex flex-col items-center'}`}>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40 hover:bg-error/10 hover:text-error transition-all duration-150 outline-none w-full",
            expanded ? 'justify-start' : 'justify-center'
          )}
          title={!expanded ? 'Sair' : undefined}
        >
          <Icon icon="material-symbols:logout-outline" className="size-5 shrink-0" />
          {expanded && <span>Sair do Sistema</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
