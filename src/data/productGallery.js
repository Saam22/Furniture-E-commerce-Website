const categoryGallery = {
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

const environments = [
  {
    id: 'living',
    name: 'غرفة معيشة',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&h=700&fit=crop&auto=format',
  },
  {
    id: 'office',
    name: 'مكتب',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&h=700&fit=crop&auto=format',
  },
  {
    id: 'bedroom',
    name: 'غرفة نوم',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&h=700&fit=crop&auto=format',
  },
  {
    id: 'dining',
    name: 'غرفة طعام',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1000&h=700&fit=crop&auto=format',
  },
];

const categoryEnvMap = {
  'غرف معيشة': ['living', 'office'],
  'غرف نوم': ['bedroom', 'living'],
  'غرف طعام': ['dining', 'living'],
  'مكاتب': ['office', 'living'],
  'ديكور': ['living', 'bedroom', 'office'],
};

export function getProductGallery(product) {
  const extras = categoryGallery[product.category] || [];
  return [product.image, ...extras];
}

export function getProductEnvironments(product) {
  const envIds = categoryEnvMap[product.category] || ['living'];
  return envIds.map(id => environments.find(e => e.id === id)).filter(Boolean);
}
