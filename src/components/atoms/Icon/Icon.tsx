// @component Icon | @tipo atom | @versao 1.1.1
// > Wrapper para @iconify/react — compatível com Material Symbols names e legacy 'name' prop
// @api icon|name: string (iconify name), className: string

import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';

interface IconProps {
    icon?: string;
    name?: string; // Para compatibilidade legado
    className?: string;
    width?: string | number;
    height?: string | number;
    size?: string | number; // Alias para width/height
    filled?: boolean; // Legado, ignorado pelo Iconify por padrão mas mantido na prop
    style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ 
    icon, 
    name, 
    className = '', 
    width, 
    height, 
    size, 
    filled, 
    style 
}) => {
    const finalIcon = icon || name || '';
    if (!finalIcon) return null;

    // Se o ícone não tiver prefixo, assumimos material-symbols
    const iconName = finalIcon.includes(':') ? finalIcon : `material-symbols:${finalIcon}`;
    
    const finalSize = size || width || 20;
    
    return (
        <IconifyIcon 
            icon={iconName} 
            className={className} 
            width={finalSize} 
            height={height || finalSize} 
            style={style} 
        />
    );
};

export default Icon;
