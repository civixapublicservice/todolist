import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CustomDatePicker({ value, onChange, minDate, align = 'left', placeholder = "Select Date" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value or use today for viewing
  const initialDate = value ? new Date(value + 'T12:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-11

  // Update view when value changes externally
  useEffect(() => {
    if (value && !isOpen) {
      const d = new Date(value + 'T12:00:00');
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const friendlyDate = value 
    ? `${value.split('-')[2]}/${value.split('-')[1]}/${value.split('-')[0]}` 
    : placeholder;

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleSelect = (day) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateString = `${viewYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateString);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center group" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer w-full text-left outline-none"
      >
        <CalendarIcon className="h-4 w-4 text-primary mr-2 shrink-0 group-hover:scale-110 transition-transform" />
        <span className="text-[13px] font-medium text-foreground min-w-[85px]">
          {friendlyDate}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute top-full mt-2 z-50 w-64 p-4",
              "bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border border-glass-border rounded-2xl shadow-2xl"
            )}
            style={{ [align]: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={handlePrevMonth}
                type="button"
                className="p-1.5 hover:bg-foreground/5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-[14px] font-bold text-foreground">
                {monthNames[viewMonth]} {viewYear}
              </div>
              <button 
                onClick={handleNextMonth}
                type="button"
                className="p-1.5 hover:bg-foreground/5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} />;
                
                const formattedMonth = String(viewMonth + 1).padStart(2, '0');
                const formattedDay = String(day).padStart(2, '0');
                const dateString = `${viewYear}-${formattedMonth}-${formattedDay}`;
                
                const isSelected = value === dateString;
                const isToday = todayString === dateString;
                const isDisabled = minDate && dateString < minDate;

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelect(day)}
                    className={cn(
                      "h-8 w-8 mx-auto rounded-full flex items-center justify-center text-[12px] font-medium transition-all",
                      isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-110",
                      isSelected 
                        ? "bg-primary text-white shadow-glow font-bold" 
                        : isToday
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground hover:bg-foreground/10"
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-glass-border">
               <button
                 type="button"
                 onClick={() => { onChange(''); setIsOpen(false); }}
                 className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-foreground/5"
               >
                 Clear
               </button>
               <button
                 type="button"
                 onClick={() => { onChange(todayString); setIsOpen(false); }}
                 className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded hover:bg-primary/10"
               >
                 Today
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
