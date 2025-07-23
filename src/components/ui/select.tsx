import { ChevronDown, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export function Select({
  value,
  placeholder = 'Select an option',
  options,
  onValueChange,
  className,
  disabled = false,
  searchable = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  
  const filteredOptions = searchable && searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  return (
    <div className={cn('relative', className)} ref={selectRef}>
      <button
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'hover:bg-gray-50',
        )}
        disabled={disabled}
        onClick={handleOpen}
        type="button"
      >
        <span className={cn('truncate', !selectedOption && 'text-gray-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {searchable && (
            <div className="border-b border-gray-200 p-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  className="w-full pl-7 pr-2 py-1 text-sm border-0 focus:outline-none focus:ring-0"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  type="text"
                  value={searchQuery}
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    'flex w-full items-center px-3 py-2 text-sm text-left',
                    'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                    value === option.value && 'bg-primary-50 text-primary-700 font-medium',
                  )}
                  onClick={() => handleSelect(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No categories found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}