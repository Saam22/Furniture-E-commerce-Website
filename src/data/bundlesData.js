import { productsData } from './productsData';

export const bundles = [
  {
    id: 'living-room',
    name: 'غرفة المعيشة',
    description: 'كنبة مودرن + طاولة قهوة + كرسي استرخاء',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop&auto=format',
    items: [1, 9, 11],
    discount: 20,
    originalTotal: 4650,
    bundlePrice: 3720,
    savings: 930,
    badge: 'وفر 930 ج.م',
  },
  {
    id: 'bedroom',
    name: 'غرفة النوم',
    description: 'سرير مزدوج + خزانة ملابس + تسريحة',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format',
    items: [3, 8, 15],
    discount: 22,
    originalTotal: 7600,
    bundlePrice: 5928,
    savings: 1672,
    badge: 'وفر 1,672 ج.م',
  },
  {
    id: 'home-office',
    name: 'المكتب المنزلي',
    description: 'مكتب عمل + كرسي مكتب + دولاب تنظيم',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=500&fit=crop&auto=format',
    items: [10, 16, 34],
    discount: 18,
    originalTotal: 3200,
    bundlePrice: 2624,
    savings: 576,
    badge: 'وفر 576 ج.م',
  },
];

export function getBundleProducts(bundle) {
  return bundle.items.map(id => productsData.find(p => p.id === id)).filter(Boolean);
}

export function calcBundleTotal(bundle, selectedIds) {
  const resolved = getBundleProducts(bundle);
  const selected = selectedIds
    ? resolved.filter(p => selectedIds.includes(p.id))
    : resolved;
  const subtotal = selected.reduce((sum, p) => sum + p.price, 0);
  const ratio = subtotal / bundle.originalTotal;
  const bundlePortion = Math.round(bundle.bundlePrice * ratio);
  return { subtotal, bundlePortion, savings: subtotal - bundlePortion };
}
