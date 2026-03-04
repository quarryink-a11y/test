import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isWithinInterval } from 'date-fns';

export default function DateRangePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDayClick = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const handleDone = () => {
    if (startDate) {
      const s = format(startDate, 'dd/MM');
      const e = endDate ? format(endDate, 'dd/MM') : s;
      const lastDate = endDate || startDate;
      onChange(`${s} - ${e}`, format(lastDate, 'yyyy-MM-dd'));
    }
    setOpen(false);
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    const rows = [];
    let day = calStart;

    while (day <= calEnd) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const d = day;
        const inMonth = isSameMonth(d, monthStart);
        const isStart = startDate && isSameDay(d, startDate);
        const isEnd = endDate && isSameDay(d, endDate);
        const inRange = startDate && endDate && isWithinInterval(d, { start: startDate, end: endDate });

        week.push(
          <button
            key={d.toISOString()}
            type="button"
            onClick={() => handleDayClick(d)}
            className={`w-8 h-8 rounded-full text-xs flex items-center justify-center transition-colors
              ${!inMonth ? 'text-gray-300' : 'text-gray-700'}
              ${(isStart || isEnd) ? 'bg-blue-500 text-white font-semibold' : ''}
              ${inRange && !isStart && !isEnd ? 'bg-blue-100 text-blue-700' : ''}
              ${inMonth && !isStart && !isEnd && !inRange ? 'hover:bg-gray-100' : ''}
            `}
          >
            {format(d, 'd')}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toISOString()} className="grid grid-cols-7 gap-0.5">{week}</div>);
    }
    return rows;
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || 'Select a date'}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-[300px]">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-sm font-semibold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</span>
            <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-[10px] text-gray-400 text-center">{d}</div>
            ))}
          </div>
          <div className="space-y-0.5">
            {renderDays()}
          </div>
          <div className="flex justify-center mt-3">
            <Button onClick={handleDone} size="sm" className="bg-blue-500 hover:bg-blue-600 rounded-full px-8">
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}