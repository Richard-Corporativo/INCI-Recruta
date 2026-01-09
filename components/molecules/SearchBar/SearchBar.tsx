import React, { useState } from 'react';
import { Button, Input, Icon } from '../../atoms';
import './SearchBar.css';

export interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = 'Buscar...',
    className = ''
}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
            <div className="search-bar__input-container">
                <Icon name="search" className="search-bar__icon" size={20} />
                <Input
                    type="search"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-bar__input"
                />
            </div>
            <Button type="submit" variant="primary" size="small" className="search-bar__button">
                Buscar
            </Button>
        </form>
    );
};

export default SearchBar;
