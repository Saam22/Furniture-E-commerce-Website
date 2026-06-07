import { useState, useCallback, useEffect, useRef } from 'react';
import { SHIPPING_ZONES } from '../data/shippingData';
import { calcShipping, formatEta, findZoneById } from '../utils/shippingUtils';
import '../styles/Cart.css';

const DeliverySection = ({ total, freeShipping: couponFreeShipping, onDeliveryChange }) => {
  let saved;
  try {
    const raw = localStorage.getItem('furnitureDelivery');
    saved = raw ? JSON.parse(raw) : null;
  } catch { saved = null; }
  saved = saved || { zoneId: 'cairo', city: 'القاهرة', express: false };
  const [selectedZone, setSelectedZone] = useState(saved.zoneId);
  const [selectedCity, setSelectedCity] = useState(saved.city);
  const [express, setExpress] = useState(saved.express);
  const callbackRef = useRef(onDeliveryChange);
  callbackRef.current = onDeliveryChange;

  const zone = findZoneById(selectedZone);
  const { cost, eta, freeShipping: thresholdFree } = calcShipping(total, zone, express);
  const freeShipping = couponFreeShipping || thresholdFree;

  useEffect(() => {
    localStorage.setItem('furnitureDelivery', JSON.stringify({ zoneId: selectedZone, city: selectedCity, express }));
  }, [selectedZone, selectedCity, express]);

  useEffect(() => {
    callbackRef.current({
      zoneId: selectedZone,
      city: selectedCity,
      cost: freeShipping ? 0 : cost,
      eta,
      freeShipping,
      express,
    });
  }, [cost, freeShipping, eta, express, selectedZone, selectedCity]);

  const handleZoneClick = (zoneId) => {
    const z = findZoneById(zoneId);
    if (z) {
      setSelectedZone(zoneId);
      setSelectedCity(z.cities[0]);
    }
  };

  return (
    <div className="delivery-section">
      <h4 className="delivery-title">توصيل</h4>

      <div className="delivery-city-select">
        <label className="delivery-label">المنطقة / المدينة</label>
        <div className="delivery-zones">
          {SHIPPING_ZONES.map(z => {
            const isActive = selectedZone === z.id;
            return (
              <div key={z.id} className={`delivery-zone ${isActive ? 'active' : ''}`}>
                <button className="delivery-zone-btn" onClick={() => handleZoneClick(z.id)}>
                  {z.label}
                </button>
                {isActive && (
                  <div className="delivery-cities">
                    {z.cities.map(c => (
                      <button key={c} className={`delivery-city-btn ${selectedCity === c ? 'active' : ''}`} onClick={() => setSelectedCity(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="delivery-options">
        <div className={`delivery-option ${express ? '' : 'selected'}`} onClick={() => setExpress(false)}>
          <div className="delivery-option-info">
            <span className="delivery-option-name">عادي</span>
            <span className="delivery-option-eta">{zone ? formatEta(zone.etaStandard) : ''}</span>
          </div>
          <span className="delivery-option-price">{freeShipping || total >= 2000 ? 'مجاني' : `${zone?.standardRate || 0} ج.م`}</span>
          {!express && <span className="delivery-check">✓</span>}
        </div>
        <div className={`delivery-option express ${express ? 'selected' : ''}`} onClick={() => setExpress(true)}>
          <div className="delivery-option-info">
            <span className="delivery-option-name">
              إكسبرس
              <span className="express-badge">سريع</span>
            </span>
            <span className="delivery-option-eta">{zone ? formatEta(zone.etaExpress) : ''}</span>
          </div>
          <span className="delivery-option-price">{freeShipping ? 'مجاني' : `${zone?.expressRate || 0} ج.م`}</span>
          {express && <span className="delivery-check">✓</span>}
        </div>
      </div>

      {eta && (
        <div className="delivery-eta">
          🚚 وقت التوصيل المتوقع: {formatEta(eta)}
        </div>
      )}
    </div>
  );
};

export default DeliverySection;
