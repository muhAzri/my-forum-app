import { Filter } from 'lucide-react';

import Icon from '../../../shared/components/atoms/Icon';
import Text from '../../../shared/components/atoms/Text';
import { Select, type SelectOption } from '../../../shared/components/ui/select';
import { capitalizeCategory } from '../../../shared/utils/utils';

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
      label: capitalizeCategory(category),
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
        <Icon className="text-gray-500" icon={Filter} size="sm" />
        <Text className="text-gray-700" variant="small" weight="medium">
          Filter by category:
        </Text>
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
