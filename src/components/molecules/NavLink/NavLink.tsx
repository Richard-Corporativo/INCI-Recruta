// @component NavLink | @tipo molecule | @versao 1.0.0
// > Link de navegação com estado ativo — highlight por rota atual
// @api to, label, icon, exact

import React from 'react';
import { Link, useLocation } from '@src/lib/router-compat';
import { Text, Icon } from '../../atoms';

export interface NavLinkProps {
    to: string;
    label: string;
    icon?: string;
    active?: boolean;
    className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
    to,
    label,
    icon,
    active = false,
    className = ''
}) => {
    return (
        <Link
            to={to}
            className={`nav-link ${active ? 'nav-link--active' : ''} ${className}`}
        >
            {icon && <Icon name={icon} className="nav-link__icon" size={20} filled={active} />}
            <Text weight={active ? 'bold' : 'medium'} size="base" className="nav-link__text">
                {label}
            </Text>
        </Link>
    );
};

export default NavLink;
