import { Filter, ArrowUpDown, Tag, Search } from 'lucide-react'

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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border rounded-xl p-2 shadow-sm mb-6">
      <div className="flex bg-muted/50 p-1 rounded-lg">
        {['all', 'active', 'completed'].map((status) => (
          <button
            key={status}
            className={`flex-1 lg:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              statusFilter === status
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            onClick={() => onStatusChange(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 max-w-md mx-auto sm:mx-0 w-full relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none hover:border-foreground/30 focus:border-ring focus:ring-0 transition-colors"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 sm:flex-none">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-muted-foreground" />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="block w-full pl-9 pr-8 py-2 text-sm bg-background border border-border rounded-lg text-foreground hover:border-foreground/30 focus:outline-none focus:border-ring focus:ring-0 transition-colors appearance-none"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        <div className="relative flex-1 sm:flex-none">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full pl-9 pr-8 py-2 text-sm bg-background border border-border rounded-lg text-foreground hover:border-foreground/30 focus:outline-none focus:border-ring focus:ring-0 transition-colors appearance-none"
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
