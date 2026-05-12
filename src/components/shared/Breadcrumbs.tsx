// @component Breadcrumbs | @tipo componente | @versao 1.0.0
// > Navegação breadcrumb para hierarquia de páginas
// @api items: { label: string, href?: string }[]

import React from 'react';
import { Link } from '@src/lib/router-compat';
import { Icon } from "@iconify/react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center text-sm ${className} transition-colors`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-all duration-200 ease-in-out font-medium outline-none focus-visible:underline decoration-primary/30"
          >
            <Icon icon="material-symbols:home" className="mr-1.5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 h-4 w-4" aria-hidden="true" />
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              <Icon icon="material-symbols:chevron-right" className="text-muted-foreground/50 mx-1 select-none transition-colors h-4 w-4" aria-hidden="true" />
              {isLast ? (
                <span className="font-semibold text-foreground transition-colors" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to || '#'}
                  className="font-semibold text-muted-foreground hover:text-primary transition-all duration-200 ease-in-out outline-none focus-visible:underline decoration-primary/30"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
