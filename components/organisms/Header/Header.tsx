import React from 'react';
import { SearchBar } from '../../molecules';
import { Icon, Avatar } from '../../atoms';
import './Header.css';

export interface HeaderProps {
    onSearch?: (query: string) => void;
    user?: {
        name: string;
        avatar?: string;
    };
}

const Header: React.FC<HeaderProps> = ({ onSearch, user }) => {
    return (
        <header className="header-org">
            <div className="header-org__container">
                <div className="header-org__search">
                    {onSearch && <SearchBar onSearch={onSearch} placeholder="Pesquisar candidaturas..." />}
                </div>

                <div className="header-org__actions">
                    <button className="header-org__icon-btn">
                        <Icon name="notifications" size={22} />
                        <span className="header-org__badge"></span>
                    </button>

                    <div className="header-org__user">
                        <div className="header-org__user-info">
                            <span className="header-org__user-name">{user?.name || 'Usuário'}</span>
                            <span className="header-org__user-role">Recrutador</span>
                        </div>
                        <Avatar src={user?.avatar} alt={user?.name} size="medium" fallback={user?.name?.charAt(0)} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
