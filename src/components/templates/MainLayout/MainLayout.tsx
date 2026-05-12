// @component MainLayout | @tipo template | @versao 1.0.0
// > Layout completo painel admin — sidebar, header, conteúdo
// @api children, sidebar, header

import React from 'react';
import { Header } from '../../organisms';

export interface MainLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    headerProps?: any;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    sidebar,
    headerProps
}) => {
    return (
        <div className="main-template">
            {sidebar && (
                <aside className="main-template__sidebar">
                    {sidebar}
                </aside>
            )}

            <div className="main-template__content-wrapper">
                <Header {...headerProps} />

                <main className="main-template__main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
