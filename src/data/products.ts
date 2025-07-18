
import type { Category as ProductCategory, LocalizedString } from '@/lib/types';

// Helper function to create LocalizedString
const LS = (en: string, es: string, it?: string, zh?: string, ja?: string, pt?: string): LocalizedString => ({
  en,
  es,
  it: it || en,
  zh: zh || en,
  ja: ja || en,
  pt: pt || en,
});

export const categories: ProductCategory[] = [
  {
    name: LS('Books', 'Libros'),
    slug: 'books',
    iconName: 'BookOpen',
    description: LS('Books about AI, technology, and more.', 'Libros sobre IA, tecnología y más.')
  },
  {
    name: LS('Notebooks', 'Portátiles'),
    slug: 'notebooks',
    iconName: 'Laptop',
    description: LS('Powerful notebooks for work and play.', 'Portátiles potentes para trabajar y jugar.')
  },
  {
    name: LS('Smartphones', 'Smartphones'),
    slug: 'smartphones',
    iconName: 'Smartphone',
    description: LS('The latest in mobile technology.', 'Lo último en tecnología móvil.')
  },
  {
    name: LS('PC Components', 'Componentes de PC'),
    slug: 'pc-components',
    iconName: 'Cpu',
    description: LS('Build or upgrade your PC with the best components.', 'Construye o actualiza tu PC con los mejores componentes.')
  },
  {
    name: LS('Peripherals', 'Periféricos'),
    slug: 'peripherals',
    iconName: 'Mouse',
    description: LS('Keyboards, mice, and other essential peripherals.', 'Teclados, ratones y otros periféricos esenciales.')
  },
];

export const getProductCategoryBySlug = (slug: string): ProductCategory | undefined => {
  return categories.find(cat => cat.slug === slug);
};

    