export const SHIPPING_ZONES = [
  {
    id: 'cairo',
    label: 'القاهرة الكبرى',
    standardRate: 40,
    expressRate: 75,
    etaStandard: { min: 1, max: 2 },
    etaExpress: { min: 0, max: 1 },
    cities: [
      'القاهرة', 'الجيزة', 'القليوبية', 'بنها', 'شبرا الخيمة', 'مدينة نصر',
      'المعادي', 'التجمع الخامس', 'الشيخ زايد', 'السادس من أكتوبر',
    ],
  },
  {
    id: 'alex',
    label: 'الإسكندرية والوجه البحري',
    standardRate: 55,
    expressRate: 100,
    etaStandard: { min: 2, max: 4 },
    etaExpress: { min: 1, max: 2 },
    cities: [
      'الإسكندرية', 'بورسعيد', 'دمياط', 'المنصورة', 'الزقازيق', 'طنطا',
      'شبين الكوم', 'دمنهور', 'كفر الشيخ', 'المحلة الكبرى', 'ميت غمر',
      'بلطيم', 'رشيد', 'العريش',
    ],
  },
  {
    id: 'delta',
    label: 'الدلتا والوسط',
    standardRate: 60,
    expressRate: 110,
    etaStandard: { min: 2, max: 4 },
    etaExpress: { min: 1, max: 2 },
    cities: [
      'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج',
      'ملوي', 'ديروط', 'أبنوب', 'طهطا', 'الواسطى',
    ],
  },
  {
    id: 'upper',
    label: 'الصعيد',
    standardRate: 80,
    expressRate: 145,
    etaStandard: { min: 3, max: 6 },
    etaExpress: { min: 2, max: 3 },
    cities: [
      'الأقصر', 'أسوان', 'قنا', 'نجع حمادي', 'إسنا',
      'كوم أمبو', 'إدفو', 'الغردقة',
    ],
  },
  {
    id: 'border',
    label: 'المناطق الحدودية',
    standardRate: 110,
    expressRate: 200,
    etaStandard: { min: 4, max: 8 },
    etaExpress: { min: 2, max: 4 },
    cities: [
      'مرسى مطروح', 'السلوم', 'سيوة', 'شلاتين',
      'أبو رماد', 'حلايب', 'نويبع', 'طابا', 'سانت كاترين',
      'الوادي الجديد', 'الخارجة',
    ],
  },
]

export const FREE_SHIPPING_THRESHOLD = 2000

export const ORDER_STATUSES = [
  { id: 'pending', label: 'قيد الانتظار', icon: '⏳' },
  { id: 'confirmed', label: 'تم التأكيد', icon: '✓' },
  { id: 'processing', label: 'قيد التجهيز', icon: '🛠' },
  { id: 'shipped', label: 'تم الشحن', icon: '📦' },
  { id: 'out_for_delivery', label: 'خرج للتوصيل', icon: '🚚' },
  { id: 'delivered', label: 'تم التوصيل', icon: '✅' },
  { id: 'cancelled', label: 'ملغي', icon: '✕' },
]

export const DEFAULT_CITY = { zone: 'cairo', city: 'القاهرة' }
