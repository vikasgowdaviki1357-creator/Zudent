import React from 'react';
import { Search, X } from 'lucide-react';
import '../../styles/components.css';

export default function SearchBar({ placeholder = 'Search...', value, onChange, onClear, className = '' }) {
  return (
    <div className={`search-bar ${className}`}>
      <Search className="search-bar__icon" size={18} />
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {value && onClear && (
        <button className="search-bar__clear" onClick={onClear} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
