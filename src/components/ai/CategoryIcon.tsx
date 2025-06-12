import type { FC } from 'react';
import * as LucideIcons from 'lucide-react';
import type { Category } from '@/lib/types';
import { categories as allCategories } from '@/data/posts'; // Changed to use categories from posts.ts

interface CategoryIconProps {
  categoryName: string;
  className?: string;
}

const CategoryIcon: FC<CategoryIconProps> = ({ categoryName, className }) => {
  // Find category by matching the 'en' name, as categoryName prop is likely the English name
  const categoryData = allCategories.find(cat => {
    if (typeof cat.name === 'string') { // Should not happen with LocalizedString but good for safety
        return cat.name === categoryName;
    }
    return cat.name.en === categoryName;
  });
  
  if (!categoryData || !categoryData.iconName) {
    return <LucideIcons.HelpCircle className={className} aria-label="Unknown category" />;
  }

  const IconComponent = LucideIcons[categoryData.iconName] as LucideIcons.LucideIcon;

  if (!IconComponent) {
    // This case should ideally not happen if iconName is always a valid LucideIcon key
    return <LucideIcons.HelpCircle className={className} aria-label="Icon not found" />;
  }

  return <IconComponent className={className} aria-label={`${categoryName} category icon`} />;
};

export default CategoryIcon;
