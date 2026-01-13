
import React from 'react';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  className?: string;
}

export const DateFilter: React.FC<DateFilterProps> = ({ startDate, endDate, onDateChange, className = '' }) => {
  return (
    <div className={`flex items-center border border-[#374151] rounded-lg px-2 py-2 bg-[#111827] text-gray-300 ${className}`}>
      <Calendar size={16} className="text-inherit opacity-60 mr-2 shrink-0" />
      <div className="flex items-center gap-1">
        <input 
          type="date" 
          value={startDate} 
          min="2025-01-01" 
          max="2100-12-31"
          onChange={(e) => onDateChange(e.target.value, endDate)}
          className="bg-transparent text-xs font-medium text-inherit focus:outline-none w-[100px] cursor-pointer uppercase opacity-90 [color-scheme:dark]"
        />
        <span className="text-inherit opacity-40 text-xs font-medium">TO</span>
        <input 
          type="date" 
          value={endDate} 
          min="2025-01-01" 
          max="2100-12-31"
          onChange={(e) => onDateChange(startDate, e.target.value)}
          className="bg-transparent text-xs font-medium text-inherit focus:outline-none w-[100px] cursor-pointer uppercase opacity-90 [color-scheme:dark]"
        />
      </div>
    </div>
  );
};
