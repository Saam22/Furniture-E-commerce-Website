import { SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD, ORDER_STATUSES } from '../data/shippingData'

export function findZoneByCity(cityName) {
  for (const zone of SHIPPING_ZONES) {
    const match = zone.cities.some(c =>
      c === cityName || cityName.includes(c) || c.includes(cityName)
    )
    if (match) return zone
  }
  return null
}

export function findZoneById(zoneId) {
  return SHIPPING_ZONES.find(z => z.id === zoneId) || null
}

export function calcShipping(total, zone, express) {
  if (!zone) return { cost: 0, eta: null, freeShipping: false }

  let cost = express ? zone.expressRate : zone.standardRate
  let eta = express ? zone.etaExpress : zone.etaStandard
  let freeShipping = false

  if (total >= FREE_SHIPPING_THRESHOLD) {
    cost = 0
    freeShipping = true
  }

  return { cost, eta, freeShipping }
}

export function formatEta(eta) {
  if (!eta) return ''
  if (eta.min === eta.max) return `${eta.min} يوم`
  if (eta.max === 0) return 'اليوم نفسه'
  return `من ${eta.min} إلى ${eta.max} أيام`
}

export function getNextStatus(currentStatusId) {
  const idx = ORDER_STATUSES.findIndex(s => s.id === currentStatusId)
  if (idx === -1 || idx >= ORDER_STATUSES.length - 1) return null
  return ORDER_STATUSES[idx + 1]
}

export function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `FUR-${ts}-${rand}`
}

export function createOrder(cartItems, total, discountInfo, deliveryInfo, grandTotal) {
  return {
    id: generateOrderId(),
    date: new Date().toISOString(),
    status: 'pending',
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    subtotal: total,
    discounts: discountInfo,
    delivery: deliveryInfo,
    grandTotal: grandTotal ?? 0,
  }
}

const STATUS_ORDER = ORDER_STATUSES.map(s => s.id)

export function statusIndex(statusId) {
  return STATUS_ORDER.indexOf(statusId)
}
