import { Search, X } from 'lucide-react'
import '../styles/searchbar.css'

export default function SearchBar({ query, onQueryChange, totalTodos }) {
  const handleClear = () => {
    onQueryChange('')
  }

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search todos..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="search-input"
          autoComplete="off"
          aria-label="Search todos"
        />
        {query && (
          <button
            className="search-clear"
            onClick={handleClear}
            title="Clear search"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="search-info">
        <small>Total todos: {totalTodos}</small>
      </div>
    </div>
  )
}