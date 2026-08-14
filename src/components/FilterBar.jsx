import { ArrowUpDown, Tag, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import CustomSelect from './ui/CustomSelect'

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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
      
      {/* Sleek iOS-style Segmented Control */}
      <div className="relative flex p-1 rounded-[1.25rem] bg-foreground/5 dark:bg-[#121212]/50 border border-black/5 dark:border-white/5 backdrop-blur-xl shrink-0">
        {['all', 'active', 'completed'].map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={cn(
                "relative flex-1 lg:flex-none px-4 sm:px-6 py-2 text-sm font-semibold rounded-2xl transition-colors z-10 capitalize text-center",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-status-pill"
                  className="absolute inset-0 bg-background dark:bg-white/10 rounded-2xl shadow-sm border border-black/5 dark:border-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{status}</span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 w-full lg:w-auto lg:justify-end">
        {/* Unified Search Bar */}
        <div className="relative flex-1 max-w-full sm:max-w-[280px] group">
          <div className="absolute z-10 inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search strokeWidth={2.5} className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 text-sm font-medium rounded-[1.25rem] bg-foreground/5 dark:bg-[#121212]/50 border border-black/5 dark:border-white/5 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex-1 sm:flex-none sm:w-[160px]">
          <CustomSelect
            value={priorityFilter}
            onChange={onPriorityChange}
            align="right"
            icon={Tag}
            ariaLabel="Filter by priority"
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'HIGH', label: 'High Priority' },
              { value: 'MEDIUM', label: 'Medium Priority' },
              { value: 'LOW', label: 'Low Priority' }
            ]}
          />
        </div>

        {/* Sort Filter */}
        <div className="flex-1 sm:flex-none sm:w-[160px]">
          <CustomSelect
            value={sortBy}
            onChange={onSortChange}
            icon={ArrowUpDown}
            ariaLabel="Sort todos"
            options={[
              { value: 'newest', label: 'Sort: Newest' },
              { value: 'oldest', label: 'Sort: Oldest' },
              { value: 'title', label: 'Sort: Title A-Z' }
            ]}
          />
        </div>
      </div>
    </div>
  )
}
