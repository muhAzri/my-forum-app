import { Search, X } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '../../utils/utils';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Input from '../atoms/Input';

export interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  onSearch,
  onClear,
  className,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue ?? internalValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onClear?.();
  };

  return (
    <form className={cn('relative', className)} onSubmit={handleSubmit}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="text-muted-foreground" icon={Search} size="sm" />
        </div>

        <Input
          className="pl-10 pr-10"
          onChange={(e) => {
            if (controlledValue === undefined) {
              setInternalValue(e.target.value);
            }
          }}
          placeholder={placeholder}
          type="text"
          value={value}
        />

        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Button
              className="p-1 h-auto"
              onClick={handleClear}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Icon className="text-muted-foreground" icon={X} size="sm" />
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBox;