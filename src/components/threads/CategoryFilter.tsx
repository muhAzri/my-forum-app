import { Filter } from 'lucide-react';

import { Select, type SelectOption } from '../ui/select';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryFilterProps) {
  const options: SelectOption[] = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((category) => ({
      value: category,
      label: category,
    })),
  ];

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      onCategorySelect(null);
    } else {
      onCategorySelect(value);
    }
  };

  const currentValue = selectedCategory ?? 'all';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter by category:</span>
      </div>
      
      <Select
        className="w-full sm:w-48"
        onValueChange={handleValueChange}
        options={options}
        placeholder="Select category"
        searchable={categories.length > 5}
        value={currentValue}
      />
    </div>
  );
}