// @component RootLayout | @tipo layout | @versao 1.0.0
// > Layout raiz da aplicação — metadata, Providers, globals.css
// @api children

import React from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
    title: 'INCI Recruta — Sistema de Recrutamento',
    description: 'Plataforma ATS para gestão de vagas, candidatos e processos seletivos.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                {/* FontAwesome Pro/Duotone Support */}
                {/* <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css" /> */}
                <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js" async></script>
            </head>
            <body className="font-sans antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
