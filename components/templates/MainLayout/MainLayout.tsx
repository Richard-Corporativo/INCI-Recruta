import React from 'react';
import { Header } from '../../organisms';
import './MainLayout.css';

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
