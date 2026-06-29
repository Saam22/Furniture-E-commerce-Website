import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import { ROLES, COUPONS } from './utils/constants.js';

const productsData = [
  { name: 'كنبة مودرن فاخرة', price: 2500, originalPrice: 3200, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'كنبة مريحة بتصميم هادئ وقماش فاخر يناسب المساحات العائلية.', rating: 3, reviewCount: 128, isNewArrival: true, discount: 22, stockCount: 15 },
  { name: 'طاولة طعام خشبية', price: 1800, originalPrice: 2100, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=420&fit=crop&auto=format', category: 'غرف طعام', description: 'طاولة من الخشب الطبيعي بتفاصيل دافئة وتتسع لثمانية أشخاص.', rating: 4, reviewCount: 95, discount: 14, stockCount: 20 },
  { name: 'سرير مزدوج أنيق', price: 3200, originalPrice: 4000, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=420&fit=crop&auto=format', category: 'غرف نوم', description: 'سرير بتصميم بسيط مع رأس مبطن ولمسة فندقية مريحة.', rating: 5, reviewCount: 156, isNewArrival: true, discount: 20, stockCount: 10 },
  { name: 'كرسي مكتب جلدي', price: 850, originalPrice: 1100, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=420&fit=crop&auto=format', category: 'مكاتب', description: 'كرسي عمل عملي يدعم الظهر ومناسب لساعات طويلة.', rating: 5, reviewCount: 203, discount: 23, stockCount: 25 },
  { name: 'رف كتب معدني', price: 650, originalPrice: 800, image: 'https://images.unsplash.com/photo-1597072689227-8882273e8f6a?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'رف متين بخطوط صناعية خفيفة لتنظيم الكتب والإكسسوارات.', rating: 4, reviewCount: 87, discount: 19, stockCount: 30 },
  { name: 'مرآة حائط كبيرة', price: 420, originalPrice: 550, image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'مرآة بإطار ذهبي رفيع تضيف اتساعاً وإضاءة للمكان.', rating: 5, reviewCount: 142, isNewArrival: true, discount: 24, stockCount: 18 },
  { name: 'طقم كنبة زاوية', price: 4500, originalPrice: 5500, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'طقم واسع ومريح بتقسيم ذكي يناسب الجلسات الكبيرة.', rating: 5, reviewCount: 178, isNewArrival: true, discount: 18, stockCount: 8 },
  { name: 'خزانة ملابس خشبية', price: 2800, originalPrice: 3400, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=420&fit=crop&auto=format', category: 'غرف نوم', description: 'خزانة واسعة بأبواب منزلقة ومرايا عملية للمساحات الحديثة.', rating: 5, reviewCount: 112, discount: 18, stockCount: 12 },
  { name: 'طاولة قهوة رخامية', price: 950, originalPrice: 1200, image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'طاولة قهوة بسطح رخامي وقاعدة معدنية أنيقة.', rating: 5, reviewCount: 89, isNewArrival: true, discount: 21, stockCount: 22 },
  { name: 'مكتب عمل خشبي', price: 1450, originalPrice: 1800, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=420&fit=crop&auto=format', category: 'مكاتب', description: 'مكتب واسع بأدراج جانبية يساعدك ترتب مساحة العمل بسهولة.', rating: 5, reviewCount: 134, discount: 19, stockCount: 16 },
  { name: 'كرسي استرخاء', price: 1200, originalPrice: 1500, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'كرسي استرخاء بخطوط انسيابية ومقعد عميق للراحة اليومية.', rating: 5, reviewCount: 167, isNewArrival: true, discount: 20, stockCount: 14 },
  { name: 'لوحة جدارية عصرية', price: 380, originalPrice: 500, image: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'لوحة فنية بألوان هادئة تكمل ديكور غرفة المعيشة.', rating: 4, reviewCount: 76, discount: 24, stockCount: 40 },
  { name: 'كنبة كلاسيك فخمة', price: 3800, originalPrice: 4600, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'كنبة كلاسيك بتفاصيل راقية وقماش مخمل ناعم تناسب المجالس الفخمة.', rating: 5, reviewCount: 93, isNewArrival: true, discount: 17, stockCount: 7 },
  { name: 'طقم سفرة 6 أفراد', price: 3200, originalPrice: 4000, image: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?w=600&h=420&fit=crop&auto=format', category: 'غرف طعام', description: 'طقم سفرة كامل بـ 6 كراسي، خشب زان متين وتصميم أنيق.', rating: 5, reviewCount: 74, discount: 20, stockCount: 11 },
  { name: 'دولاب تسريحة أنيق', price: 1600, originalPrice: 2100, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=420&fit=crop&auto=format', category: 'غرف نوم', description: 'تسريحة بمرآة كبيرة وأدراج واسعة تنظم أدواتك ومستحضراتك.', rating: 5, reviewCount: 65, isNewArrival: true, discount: 24, stockCount: 9 },
  { name: 'كرسي مكتب شبكي', price: 1100, originalPrice: 1500, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=420&fit=crop&auto=format', category: 'مكاتب', description: 'كرسي شبكي مريح بمساند ذراع قابلة للتعديل ودعم للقطنية.', rating: 4, reviewCount: 145, isNewArrival: true, discount: 27, stockCount: 20 },
  { name: 'سجادة صوف ناعمة', price: 520, originalPrice: 700, image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'سجادة صوف طبيعي بألوان دافئة تدفئ المكان وتضيف لمسة راقية.', rating: 5, reviewCount: 98, discount: 26, stockCount: 35 },
  { name: 'كنبة جلد بيضاء', price: 4200, originalPrice: 5200, image: 'https://images.unsplash.com/photo-1628512743826-2c28a508ad5e?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'كنبة جلد طبيعي أبيض بتفصيل هادئ تناسب الديكور العصري.', rating: 5, reviewCount: 112, isNewArrival: true, discount: 19, stockCount: 5 },
  { name: 'طاولة جانبية خشب', price: 380, originalPrice: 500, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'طاولة صغيرة من الخشب الطبيعي، مناسبة لوضع كوب القهوة أو كتاب.', rating: 4, reviewCount: 56, discount: 24, stockCount: 28 },
  { name: 'سرير أطفال خشبي', price: 1800, originalPrice: 2400, image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&h=420&fit=crop&auto=format', category: 'غرف نوم', description: 'سرير أطفال مصنوع من الخشب الصلب بتصميم آمن ومبهج.', rating: 5, reviewCount: 88, isNewArrival: true, discount: 25, stockCount: 13 },
  { name: 'رفوف حائط ديكور', price: 250, originalPrice: 350, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'مجموعة رفوف حائط بتصميم هندسي تعرض كتبك وتحفك بأناقة.', rating: 4, reviewCount: 72, discount: 29, stockCount: 45 },
  { name: 'طاولة مكتب زاوية', price: 2100, originalPrice: 2800, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=420&fit=crop&auto=format', category: 'مكاتب', description: 'مكتب زاوية واسع يناسب المساحات الصغيرة ويزيد من إنتاجيتك.', rating: 5, reviewCount: 93, isNewArrival: true, discount: 25, stockCount: 10 },
  { name: 'كرسي طعام فاخر', price: 420, originalPrice: 580, image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&h=420&fit=crop&auto=format', category: 'غرف طعام', description: 'كرسي طعام بقماش مخمل وظهر مريح، لمسة فخمة لسفرة منزلك.', rating: 4, reviewCount: 61, discount: 28, stockCount: 32 },
  { name: 'كونسول مودرن', price: 950, originalPrice: 1300, image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'طاولة كونسول بتصميم عصري تناسب المدخل أو الردهة.', rating: 5, reviewCount: 48, isNewArrival: true, discount: 27, stockCount: 17 },
  { name: 'كنبة سرير 2 في 1', price: 2900, originalPrice: 3700, image: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'كنبة تتحول لسرير مزدوج، حل عملي للضيافة والمساحات الصغيرة.', rating: 5, reviewCount: 134, discount: 22, stockCount: 8 },
  { name: 'خزانة أحذية ذكية', price: 750, originalPrice: 1000, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'خزانة أحذية بسعة كبيرة وتصميم أنيق يحافظ على ترتيب المدخل.', rating: 4, reviewCount: 83, isNewArrival: true, discount: 25, stockCount: 22 },
  { name: 'دولاب ملابس منزلق', price: 4200, originalPrice: 5200, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&h=420&fit=crop&auto=format', category: 'غرف نوم', description: 'دولاب ملابس بأبواب منزلقة ومرايا، سعة تخزين ضخمة بتصميم أنيق.', rating: 5, reviewCount: 97, discount: 19, stockCount: 6 },
  { name: 'أباجورة أرضية', price: 320, originalPrice: 450, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'أباجورة أرضية بتصميم عصري وإضاءة دافئة تضفي جواً هادئاً.', rating: 5, reviewCount: 56, isNewArrival: true, discount: 29, stockCount: 38 },
  { name: 'مكتب كمبيوتر صغير', price: 1100, originalPrice: 1500, image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&h=420&fit=crop&auto=format', category: 'مكاتب', description: 'مكتب كمبيوتر عملي بأدراج ورفوف تنظيمية للمساحات الصغيرة.', rating: 4, reviewCount: 112, discount: 27, stockCount: 19 },
  { name: 'كرسي هزاز مريح', price: 1400, originalPrice: 1900, image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'كرسي هزاز بقماش قطيفة ناعم، مثالي للاسترخاء مع كتاب أو موسيقى.', rating: 5, reviewCount: 78, isNewArrival: true, discount: 26, stockCount: 12 },
  { name: 'بونبوسة دائرية', price: 2200, originalPrice: 2900, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'بونبوسة دائرية بتصميم عصري ومقعد عميق تناسب الجلسات الكاجوال.', rating: 4, reviewCount: 67, isNewArrival: true, discount: 24, stockCount: 9 },
  { name: 'منضدة زينة مع مرايا', price: 1900, originalPrice: 2500, image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=420&fit=crop&auto=format', category: 'غرف نوم', description: 'منضدة زينة أنيقة بمرايا ثلاثية وأدراج واسعة مرتبة.', rating: 5, reviewCount: 54, discount: 24, stockCount: 14 },
  { name: 'ساعة حائط كبيرة', price: 280, originalPrice: 400, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'ساعة حائط كبيرة بتصميم مودرن هادئ تناسب غرفة المعيشة.', rating: 4, reviewCount: 45, discount: 30, stockCount: 50 },
  { name: 'دولاب مكتبي صغير', price: 650, originalPrice: 900, image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=600&h=420&fit=crop&auto=format', category: 'مكاتب', description: 'دولاب تنظيم مكتبي بأدراج متعددة يحافظ على ترتيب أوراقك وأدواتك.', rating: 4, reviewCount: 38, discount: 28, stockCount: 24 },
  { name: 'طقم انتريه مودرن', price: 6500, originalPrice: 8200, image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=420&fit=crop&auto=format', category: 'غرف معيشة', description: 'طقم انتريه مكون من كنبة 3 مقاعد وكنبتين فردي، قماش فاخر وتفصيل راقي.', rating: 5, reviewCount: 156, isNewArrival: true, discount: 21, stockCount: 4 },
  { name: 'زهرية سيراميك كبيرة', price: 180, originalPrice: 260, image: 'https://images.unsplash.com/photo-1581912492723-688317ba2162?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'زهرية سيراميك بيج كبير تضيف لمسة طبيعية وجمالية لأي ركن.', rating: 4, reviewCount: 34, isNewArrival: true, discount: 31, stockCount: 60 },
  { name: 'كرسي طعام خشبي', price: 350, originalPrice: 480, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&h=420&fit=crop&auto=format', category: 'غرف طعام', description: 'كرسي طعام خشبي متين بتصميم كلاسيك أنيق.', rating: 4, reviewCount: 29, discount: 27, stockCount: 40 },
  { name: 'طاولة كونسول رخام', price: 1200, originalPrice: 1600, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=600&h=420&fit=crop&auto=format', category: 'ديكور', description: 'كونسول رخامي أنيق بقاعدة ذهبية للمداخل الفخمة.', rating: 5, reviewCount: 41, isNewArrival: true, discount: 25, stockCount: 11 },
];

const galleryData = {
  'غرف معيشة': [
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&h=800&fit=crop&auto=format',
  ],
  'غرف نوم': [
    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=800&fit=crop&auto=format',
  ],
  'غرف طعام': [
    'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1554295405-abb8fd54f153?w=800&h=800&fit=crop&auto=format',
  ],
  'مكاتب': [
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop&auto=format',
  ],
  'ديكور': [
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=800&fit=crop&auto=format',
  ],
};

async function seed() {
  await connectDB();
  console.log('Seeding database...');

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'مدير المتجر',
    email: 'admin@gmail.com',
    password: '123456',
    role: ROLES.ADMIN,
    referralCode: 'FURN-ADMIN',
  });
  console.log(`Admin created: admin@gmail.com / 123456`);

  const user = await User.create({
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    password: 'user123',
    role: ROLES.CUSTOMER,
    referralCode: 'FURN-AHMED',
  });
  console.log(`User created: ahmed@example.com / user123`);

  const galleryLookup = {};
  for (const [cat, images] of Object.entries(galleryData)) {
    galleryLookup[cat] = images;
  }

  for (const data of productsData) {
    await Product.create({
      ...data,
      images: galleryLookup[data.category] || [],
    });
  }
  console.log(`${productsData.length} products seeded`);

  for (const couponData of COUPONS) {
    await Coupon.create({
      ...couponData,
      description: couponData.description || '',
      usageLimit: couponData.usageLimit || null,
    });
  }
  console.log(`${COUPONS.length} coupons seeded`);

  console.log('\nSeed complete!');
  console.log('---');
  console.log('Admin: admin@furnture.com / admin123');
  console.log('User:  ahmed@example.com / user123');

  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
