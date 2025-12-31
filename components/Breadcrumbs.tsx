import React from 'react';
import { Link } from 'react-router-dom';

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
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[18px] mr-1">home</span>
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index}>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-muted-foreground text-[18px] mx-1">chevron_right</span>
                {isLast ? (
                  <span className="font-bold text-foreground" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.to || '#'}
                    className="font-bold text-muted-foreground hover:text-primary transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;