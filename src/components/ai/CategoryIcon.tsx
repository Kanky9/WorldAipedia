import type { FC } from 'react';
import * as LucideIcons from 'lucide-react';
import type { Category } from '@/lib/types';
import { categories as allCategories } from '@/data/ai-tools';

interface CategoryIconProps {
  categoryName: string;
  className?: string;
}

const CategoryIcon: FC<CategoryIconProps> = ({ categoryName, className }) => {
  const categoryData = allCategories.find(cat => cat.name === categoryName);
  
  if (!categoryData || !categoryData.iconName) {
    return <LucideIcons.HelpCircle className={className} aria-label="Unknown category" />;
  }

  const IconComponent = LucideIcons[categoryData.iconName] as LucideIcons.LucideIcon;

  if (!IconComponent) {
    return <LucideIcons.HelpCircle className={className} aria-label="Icon not found" />;
  }

  return <IconComponent className={className} aria-label={`${categoryName} category icon`} />;
};

export default CategoryIcon;
