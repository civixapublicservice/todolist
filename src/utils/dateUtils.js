export const getLegacyTimeNotSet = (utcDateString) => {
  if (!utcDateString) return false;
  return utcDateString.endsWith('T00:00:00.000Z');
};

export const formatFriendlyDate = (dateString, userTimezone) => {
  if (!dateString) return 'No Deadline';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Use user settings timezone, fallback to local browser timezone
  const tz = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const dateOptions = { timeZone: tz, year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { timeZone: tz, hour: 'numeric', minute: '2-digit' };
  const weekdayOptions = { timeZone: tz, weekday: 'long' };
  
  const tzDateStr = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  const todayStr = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = new Intl.DateTimeFormat('en-US', dateOptions).format(tomorrow);

  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
  
  const isLegacy = getLegacyTimeNotSet(dateString);
  const timeDisplay = isLegacy ? 'Time Not Set' : formattedTime;
  
  let dayDisplay = tzDateStr;
  if (tzDateStr === todayStr) {
    dayDisplay = 'Today';
  } else if (tzDateStr === tomorrowStr) {
    dayDisplay = 'Tomorrow';
  } else {
    // Display day name if within the next 7 days
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays <= 7) {
       dayDisplay = new Intl.DateTimeFormat('en-US', weekdayOptions).format(date);
    }
  }

  return `${dayDisplay} • ${timeDisplay}`;
};

export const calculateTriggerTime = (dueDateString, reminderTimeStr) => {
  if (!dueDateString || !reminderTimeStr) return null;
  const match = reminderTimeStr.match(/^(\d+)(m|h|d)$/);
  if (!match) return null;
  
  const value = parseInt(match[1], 10);
  const unit = match[2];
  
  let offset;
  switch (unit) {
    case 'm': offset = value * 60 * 1000; break;
    case 'h': offset = value * 60 * 60 * 1000; break;
    case 'd': offset = value * 24 * 60 * 60 * 1000; break;
    default: offset = 0;
  }
  
  const triggerDate = new Date(new Date(dueDateString).getTime() - offset);
  return triggerDate;
};

// Formats the trigger time nicely (e.g. "Triggering at: 3:30 PM on Today")
export const formatTriggerPreview = (triggerDate, userTimezone) => {
  if (!triggerDate) return '';
  const tz = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const timeOptions = { timeZone: tz, hour: 'numeric', minute: '2-digit' };
  const dateOptions = { timeZone: tz, year: 'numeric', month: 'short', day: 'numeric' };
  
  const timeStr = new Intl.DateTimeFormat('en-US', timeOptions).format(triggerDate);
  const dateStr = new Intl.DateTimeFormat('en-US', dateOptions).format(triggerDate);
  
  const now = new Date();
  const todayStr = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
  
  if (dateStr === todayStr) {
    return `Reminding at ${timeStr} today`;
  }
  return `Reminding at ${timeStr} on ${dateStr}`;
};

export const getLocalYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

export const getLocalHHMM = (dateString) => {
  if (!dateString) return '';
  if (getLegacyTimeNotSet(dateString)) return '';
  const d = new Date(dateString);
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

export const isTodayLocal = (dateString, userTimezone) => {
  if (!dateString) return false;
  const tz = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateOptions = { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric' };
  const d1 = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(dateString));
  const d2 = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date());
  return d1 === d2;
};

export const convert12HourTo24Hour = (hour12, minute, period) => {
  let h = parseInt(hour12, 10);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

export const convert24HourTo12Hour = (time24) => {
  if (!time24) return { hour: '12', minute: '00', period: 'PM' };
  const [h24, m] = time24.split(':');
  let h = parseInt(h24, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return { hour: h.toString(), minute: m, period };
};
