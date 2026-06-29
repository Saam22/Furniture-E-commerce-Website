export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

export const ORDER_STATUSES = [
  { id: 'pending', label: 'قيد الانتظار' },
  { id: 'confirmed', label: 'تم التأكيد' },
  { id: 'processing', label: 'قيد التجهيز' },
  { id: 'shipped', label: 'تم الشحن' },
  { id: 'out_for_delivery', label: 'خرج للتوصيل' },
  { id: 'delivered', label: 'تم التوصيل' },
  { id: 'cancelled', label: 'ملغي' },
];

export const SHIPPING_ZONES = [
  {
    id: 'cairo',
    label: 'القاهرة والجيزة',
    standardRate: 40,
    expressRate: 75,
    etaStandard: { min: 1, max: 3 },
    etaExpress: { min: 1, max: 1 },
    cities: ['القاهرة', 'الجيزة', 'مدينة نصر', 'المعادي', 'المهندسين', 'الزمالك', 'مصر الجديدة', 'الشروق', 'التجمع', '6 أكتوبر', 'الشيخ زايد'],
  },
  {
    id: 'alex',
    label: 'الإسكندرية',
    standardRate: 55,
    expressRate: 100,
    etaStandard: { min: 2, max: 4 },
    etaExpress: { min: 1, max: 2 },
    cities: ['الإسكندرية', 'برج العرب', 'برج العرب الجديدة', 'العامرية', 'العجمي', 'المنتزه', 'سموحة', 'محرم بك', 'كامب شيزار', 'لوران'],
  },
  {
    id: 'delta',
    label: 'الدلتا',
    standardRate: 55,
    expressRate: 100,
    etaStandard: { min: 2, max: 4 },
    etaExpress: { min: 1, max: 2 },
    cities: ['طنطا', 'المنصورة', 'المحلة', 'كفر الشيخ', 'دمياط', 'الزقازيق', 'بنها', 'شبين الكوم', 'دمنهور', 'ميت غمر'],
  },
  {
    id: 'upper',
    label: 'الصعيد',
    standardRate: 80,
    expressRate: 150,
    etaStandard: { min: 3, max: 6 },
    etaExpress: { min: 2, max: 3 },
    cities: ['أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'المنيا', 'بني سويف', 'الفيوم', 'الغردقة', 'مرسى علم'],
  },
  {
    id: 'border',
    label: 'المناطق الحدودية',
    standardRate: 110,
    expressRate: 200,
    etaStandard: { min: 4, max: 8 },
    etaExpress: { min: 2, max: 4 },
    cities: ['العريش', 'رفح', 'شرم الشيخ', 'دهب', 'نويبع', 'طابا', 'الوادي الجديد', 'سيوة', 'حلايب', 'مرسى مطروح', 'السلوم'],
  },
];

export const FREE_SHIPPING_THRESHOLD = 2000;

export const LOYALTY = {
  pointsPerEgp: 10,
  pointsRedeemRate: 2,
  minRedeemPoints: 100,
  birthdayBonusPoints: 200,
  referralBonusPoints: 100,
  birthdayMultiplier: 2,
};

export const TIERS = [
  { id: 'bronze', label: 'برونزي', minOrders: 0, discount: 0 },
  { id: 'silver', label: 'فضي', minOrders: 3, discount: 5 },
  { id: 'gold', label: 'ذهبي', minOrders: 6, discount: 10 },
  { id: 'platinum', label: 'بلاتيني', minOrders: 10, discount: 15 },
];

export const CATEGORIES = [
  { id: 'غرف معيشة', name: 'غرف معيشة', icon: '▣' },
  { id: 'غرف نوم', name: 'غرف نوم', icon: '▤' },
  { id: 'غرف طعام', name: 'غرف طعام', icon: '◫' },
  { id: 'مكاتب', name: 'مكاتب', icon: '▥' },
  { id: 'ديكور', name: 'ديكور', icon: '✦' },
];

export const COUPONS = [
  { code: 'WELCOME10', type: 'percent', value: 10, minAmount: 500, description: 'خصم 10% على أول طلب', usageLimit: 1 },
  { code: 'SAVE20', type: 'percent', value: 20, minAmount: 1000, description: 'خصم 20% على طلبات +1000 ج.م', usageLimit: 1 },
  { code: 'FURNITURE50', type: 'fixed', value: 50, minAmount: 300, description: 'خصم 50 ج.م على الأثاث', usageLimit: 1 },
  { code: 'FLASH15', type: 'percent', value: 15, minAmount: 800, description: 'خصم 15% فلاش', usageLimit: 1, activeUntil: null },
  { code: 'FREESHIP', type: 'freeshipping', value: 0, minAmount: 0, description: 'شحن مجاني', usageLimit: 1 },
];
