import { ArrowUpDown, Tag, Search } from 'lucide-react'
import { cn } from '../utils/cn'

export default function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Status Segmented Control */}
      <div className="flex p-1.5 rounded-xl bg-foreground/5 border border-glass-border shadow-inner">
        {['all', 'active', 'completed'].map((status) => (
          <button
            key={status}
            className={cn(
              "flex-1 lg:flex-none px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 capitalize",
              statusFilter === status
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-glow"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-auto sm:mx-0 w-full relative group">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-4 py-2.5 text-sm glass-input bg-foreground/5 focus:bg-background border-transparent focus:border-primary transition-all duration-300"
        />
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 sm:flex-none group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="block w-full pl-9 pr-8 py-2.5 text-sm glass-input bg-foreground/5 hover:bg-white/5 focus:bg-background border-transparent focus:border-primary transition-all duration-300 appearance-none cursor-pointer font-medium"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        <div className="relative flex-1 sm:flex-none group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full pl-9 pr-8 py-2.5 text-sm glass-input bg-foreground/5 hover:bg-white/5 focus:bg-background border-transparent focus:border-primary transition-all duration-300 appearance-none cursor-pointer font-medium"
            aria-label="Sort todos"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="title">Sort: Title A-Z</option>
          </select>
        </div>
      </div>
    </div>
  )
}
