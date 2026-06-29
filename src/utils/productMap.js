const API_URL = 'http://localhost:5000/api';

let serverProducts = null;
let nameToId = null;

export async function getServerProductMap() {
  if (nameToId) return nameToId;

  try {
    const res = await fetch(`${API_URL}/products?limit=100`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      serverProducts = data.data;
      nameToId = new Map();
      for (const p of serverProducts) {
        nameToId.set(p.name, p._id);
      }
    }
  } catch {
  }

  return nameToId || new Map();
}

export function findServerId(frontendProduct, map) {
  return map.get(frontendProduct.name);
}

export function toFrontendCartItems(serverCart, frontendProducts) {
  const lookup = new Map(frontendProducts.map(p => [p.name, p]));
  if (!serverCart.items || !Array.isArray(serverCart.items)) return [];

  return serverCart.items
    .filter(item => item.product)
    .map(item => {
      const sp = item.product;
      const fp = lookup.get(sp.name);
      return {
        _serverId: sp._id,
        id: fp ? fp.id : sp._id,
        name: sp.name,
        price: sp.price,
        originalPrice: sp.originalPrice || sp.price,
        image: sp.image,
        category: sp.category,
        description: sp.description,
        rating: sp.rating,
        discount: sp.discount || 0,
        quantity: item.quantity,
        inStock: sp.inStock,
      };
    });
}
