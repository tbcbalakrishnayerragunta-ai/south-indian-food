export const MENU_ITEMS = [
  { id: 'idli', name: 'Idli', price: 40, description: 'Soft fluffy steamed rice cakes served with sambar & coconut chutney', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80', badge: 'Daily Fresh' },
  { id: 'medu-vada', name: 'Medu Vada', price: 50, description: 'Golden crispy vadas with fresh coconut chutney & sambar', image: 'https://images.unsplash.com/photo-1630383249896-483b843dd54b?w=600&q=80', badge: 'Best Seller' },
  { id: 'dosa', name: 'Dosa', price: 60, description: 'Crispy golden crepe served hot with sambar & chutneys', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80', badge: "Chef's Pick" },
] as const;

export type MenuItem = typeof MENU_ITEMS[number];
