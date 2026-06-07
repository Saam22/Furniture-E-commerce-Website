import { useState, useCallback, useRef } from 'react';
import { productsData } from '../data/productsData';
import '../styles/VirtualRoom.css';

const CELL = 60;
const COLS = 10;
const ROWS = 8;

function getItemSize(product) {
  const cat = product.category || '';
  if (cat.includes('معيشة') && product.price >= 4000) return { w: 4, d: 2 };
  if (cat.includes('معيشة') && product.price >= 2000) return { w: 3, d: 2 };
  if (cat.includes('معيشة')) return { w: 2, d: 1.5 };
  if (cat.includes('نوم') && product.price >= 3000) return { w: 3, d: 2.5 };
  if (cat.includes('نوم')) return { w: 2, d: 1.5 };
  if (cat.includes('طعام')) return { w: 3, d: 2 };
  if (cat.includes('مكاتب') && product.price >= 1000) return { w: 3, d: 1.5 };
  if (cat.includes('مكاتب')) return { w: 2, d: 1.5 };
  if (cat.includes('ديكور') && product.price >= 400) return { w: 1.5, d: 1 };
  return { w: 1, d: 1 };
}

function snap(val) { return Math.round(val / CELL) * CELL; }

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

let nextId = 1;

const VirtualRoom = ({ onAddToCart, onClose }) => {
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const canvasRef = useRef(null);

  const filteredProducts = selectedCat === 'all'
    ? productsData
    : productsData.filter(p => p.category === selectedCat);

  const total = items.reduce((s, i) => s + i.price, 0);

  const handleDragStart = useCallback((e, product) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ product }));
    e.dataTransfer.effectAllowed = 'copy';
    dragItemRef.current = product;
  }, []);

  const calcDropPosition = useCallback((clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(clamp(clientX - rect.left - CELL, 0, rect.width - CELL));
    const y = snap(clamp(clientY - rect.top - CELL, 0, rect.height - CELL));
    return { x, y };
  }, []);

  const canPlace = useCallback((x, y, w, d, excludeId) => {
    const wPx = w * CELL;
    const dPx = d * CELL;
    for (const item of items) {
      if (item.id === excludeId) continue;
      if (x < item.x + item.wPx && x + wPx > item.x &&
        y < item.y + item.dPx && y + dPx > item.y) {
        return false;
      }
    }
    const maxX = COLS * CELL;
    const maxY = ROWS * CELL;
    return x >= 0 && y >= 0 && x + wPx <= maxX && y + dPx <= maxY;
  }, [items]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const product = data.product;
      if (!product || !product.id) return;
      const size = getItemSize(product);
      const wPx = size.w * CELL;
      const dPx = size.d * CELL;
      const { x, y } = calcDropPosition(e.clientX, e.clientY);

      if (!canPlace(x, y, size.w, size.d, null)) return;

      setItems(prev => [...prev, {
        id: nextId++,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        x, y,
        w: size.w,
        d: size.d,
        wPx, dPx,
        rotation: 0,
      }]);
    } catch { /* ignore */ }
  }, [calcDropPosition, canPlace]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('room-grid')) {
      setSelectedItemId(null);
    }
  }, []);

  const handleItemClick = useCallback((e, id) => {
    e.stopPropagation();
    setSelectedItemId(id === selectedItemId ? null : id);
  }, [selectedItemId]);

  const handleItemDoubleClick = useCallback((e, id) => {
    e.stopPropagation();
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
    ));
  }, []);

  const handleRemoveItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItemId(null);
  }, []);

  const handleAddAllToCart = useCallback(() => {
    const seen = new Set();
    items.forEach(item => {
      if (!seen.has(item.productId)) {
        seen.add(item.productId);
        const product = productsData.find(p => p.id === item.productId);
        if (product) onAddToCart(product);
      }
    });
  }, [items, onAddToCart]);

  return (
    <section className="virtual-room" id="virtual-room">
      <div className="vr-header">
        <h2>صمم غرفتك 🪄</h2>
        <p>اسحب الأثاث من القائمة وضعه في الغرفة كما تريد</p>
      </div>

      <div className="vr-layout">
        <div className="vr-canvas-section">
          <div className="vr-canvas-header">
            <span>غرفتك</span>
            <span className="vr-canvas-dims">{COLS * CELL / 10} × {ROWS * CELL / 10} م</span>
            {items.length > 0 && (
              <button className="vr-clear-btn" onClick={() => { setItems([]); setSelectedItemId(null); }}>
                تفريغ الغرفة
              </button>
            )}
          </div>
          <div
            ref={canvasRef}
            className={`room-canvas ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleCanvasClick}
          >
            <div className="room-grid" style={{ width: COLS * CELL, height: ROWS * CELL }}>
              {Array.from({ length: ROWS * COLS }).map((_, i) => (
                <div key={i} className="room-cell" />
              ))}
              {items.map(item => {
                const isSelected = item.id === selectedItemId;
                const style = {
                  left: item.x,
                  top: item.y,
                  width: item.dPx,
                  height: item.wPx,
                  transform: `rotate(${item.rotation}deg)`,
                };
                return (
                  <div
                    key={item.id}
                    className={`room-item ${isSelected ? 'selected' : ''}`}
                    style={style}
                    onClick={e => handleItemClick(e, item.id)}
                    onDoubleClick={e => handleItemDoubleClick(e, item.id)}
                    title={`${item.name}\n${item.price.toLocaleString()} ج.م`}
                  >
                    <img src={item.image} alt={item.name} draggable={false} />
                    <div className="room-item-label">
                      <span className="room-item-name">{item.name}</span>
                      <span className="room-item-price">{item.price.toLocaleString()} ج.م</span>
                    </div>
                    <button className="room-item-remove" onClick={e => { e.stopPropagation(); handleRemoveItem(item.id); }}>×</button>
                    <span className="room-item-rotate-hint">🔄</span>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="room-empty-hint">
                  <span>🏠</span>
                  <p>اسحب الأثاث من القائمة الجانبية إلى هنا</p>
                </div>
              )}
            </div>
          </div>
          <div className="vr-canvas-footer">
            <span>{items.length} قطعة في الغرفة</span>
            <span>انقر للاختيار • انقر مرتين للتدوير • احذف بالضغط على ×</span>
          </div>
        </div>

        <div className="vr-panel-section">
          <div className="vr-panel-header">
            <span>قائمة الأثاث</span>
          </div>
          <div className="vr-panel-cats">
            {['all', 'غرف معيشة', 'غرف نوم', 'غرف طعام', 'مكاتب', 'ديكور'].map(cat => (
              <button
                key={cat}
                className={`vr-cat-btn ${selectedCat === cat ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>
          <div className="vr-panel-products">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="vr-panel-item"
                draggable
                onDragStart={e => handleDragStart(e, product)}
              >
                <img src={product.image} alt={product.name} draggable={false} />
                <div className="vr-panel-item-info">
                  <span className="vr-panel-item-name">{product.name}</span>
                  <span className="vr-panel-item-price">{product.price.toLocaleString()} ج.م</span>
                </div>
                <span className="vr-panel-drag-hint" title="اسحب للغرفة">⠿</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="vr-footer">
        <div className="vr-total">
          <span>إجمالي الغرفة</span>
          <span className="vr-total-price">{total.toLocaleString()} ج.م</span>
        </div>
        <div className="vr-actions">
          <button className="btn btn-primary" onClick={handleAddAllToCart} disabled={items.length === 0}>
            🛒 أضف الكل إلى السلة
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </section>
  );
};

export default VirtualRoom;
