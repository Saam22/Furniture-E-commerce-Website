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

const ROOM_PRESETS = [
  {
    name: 'غرفة فارغة',
    label: 'ابدأ من الصفر',
    items: [],
  },
  {
    name: 'غرفة معيشة',
    label: 'كنبة + طاولة + كرسي',
    items: [1, 9, 11],
  },
  {
    name: 'غرفة نوم',
    label: 'سرير + خزانة + تسريحة',
    items: [3, 8, 15],
  },
  {
    name: 'مكتب منزلي',
    label: 'مكتب + كرسي + دولاب',
    items: [10, 16, 34],
  },
];

function findFirstFreePosition(items, size, excludeId) {
  const wPx = size.w * CELL;
  const dPx = size.d * CELL;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * CELL;
      const y = row * CELL;
      let overlap = false;
      for (const item of items) {
        if (item.id === excludeId) continue;
        if (x < item.x + item.wPx && x + wPx > item.x &&
            y < item.y + item.dPx && y + dPx > item.y) {
          overlap = true;
          break;
        }
      }
      if (!overlap && x + wPx <= COLS * CELL && y + dPx <= ROWS * CELL) {
        return { x, y };
      }
    }
  }
  return null;
}

const VirtualRoom = ({ onAddToCart, onClose }) => {
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const canvasRef = useRef(null);
  const dragItemRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

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
    return x >= 0 && y >= 0 && x + wPx <= COLS * CELL && y + dPx <= ROWS * CELL;
  }, [items]);

  const addItem = useCallback((product, x, y) => {
    const size = getItemSize(product);
    const wPx = size.w * CELL;
    const dPx = size.d * CELL;
    const pos = { x, y };
    if (!pos.x && !pos.y) {
      const free = findFirstFreePosition(items, size, null);
      if (!free) return false;
      pos.x = free.x;
      pos.y = free.y;
    }
    if (!canPlace(pos.x, pos.y, size.w, size.d, null)) return false;
    const maxId = items.reduce((m, i) => Math.max(m, i.id), 0);
    setItems(prev => [...prev, {
      id: maxId + 1,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      x: pos.x,
      y: pos.y,
      w: size.w,
      d: size.d,
      wPx, dPx,
      rotation: 0,
    }]);
    return true;
  }, [items, canPlace]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const product = data.product;
      if (!product || !product.id) return;
      const { x, y } = calcDropPosition(e.clientX, e.clientY);
      addItem(product, x, y);
    } catch { /* ignore */ }
  }, [calcDropPosition, addItem]);

  const handlePanelItemClick = useCallback((product) => {
    const added = addItem(product, null, null);
    if (!added) return;
  }, [addItem]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('room-grid') || e.target.classList.contains('room-cell')) {
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

  const handleUndo = useCallback(() => {
    setItems(prev => prev.slice(0, -1));
    setSelectedItemId(null);
  }, []);

  const handleClearRoom = useCallback(() => {
    setItems([]);
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

  const handlePreset = useCallback((preset) => {
    setItems([]);
    setSelectedItemId(null);
    if (preset.items.length === 0) return;
    const newItems = [];
    const placed = [];
    preset.items.forEach(productId => {
      const product = productsData.find(p => p.id === productId);
      if (!product) return;
      const size = getItemSize(product);
      const wPx = size.w * CELL;
      const dPx = size.d * CELL;
      const pos = findFirstFreePosition(placed, size, null);
      if (!pos) return;
      placed.push({ id: 0, x: pos.x, y: pos.y, wPx, dPx }); // temp for overlap check
      newItems.push({
        id: newItems.length + 1,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        x: pos.x, y: pos.y,
        w: size.w, d: size.d,
        wPx, dPx,
        rotation: 0,
      });
    });
    setItems(newItems);
  }, []);

  const handleItemDragStart = useCallback((e, item) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'move');
    dragItemRef.current = item;
    dragOffsetRef.current = {
      x: e.clientX - item.x,
      y: e.clientY - item.y,
    };
  }, []);

  const handleCanvasDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleItemDrop = useCallback((e) => {
    e.preventDefault();
    if (!dragItemRef.current || !dragItemRef.current.id) return;
    const item = dragItemRef.current;
    const { x, y } = calcDropPosition(e.clientX, e.clientY);
    const size = { w: item.w, d: item.d };
    if (canPlace(x, y, size.w, size.d, item.id)) {
      setItems(prev => prev.map(i =>
        i.id === item.id ? { ...i, x, y } : i
      ));
    }
    dragItemRef.current = null;
  }, [calcDropPosition, canPlace]);

  const catButtons = ['all', 'غرف معيشة', 'غرف نوم', 'غرف طعام', 'مكاتب', 'ديكور'];

  return (
    <section className="virtual-room" id="virtual-room">
      <div className="vr-header">
        <h2>صمم غرفتك 🪄</h2>
        <p>اختر من القائمة الجانبية أو اسحب الأثاث وضعه في الغرفة</p>
      </div>

      <div className="vr-layout">
        <div className="vr-canvas-section">
          <div className="vr-canvas-header">
            <span>غرفتك</span>
            <span className="vr-canvas-dims">{COLS * CELL / 10} × {ROWS * CELL / 10} م</span>
            <div className="vr-canvas-header-actions">
              {items.length > 0 && (
                <>
                  <button className="vr-undo-btn" onClick={handleUndo} title="تراجع">
                    ↩
                  </button>
                  <button className="vr-clear-btn" onClick={handleClearRoom}>
                    تفريغ
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Room presets */}
          <div className="vr-presets">
            {ROOM_PRESETS.map(p => (
              <button key={p.name} className="vr-preset-btn" onClick={() => handlePreset(p)}>
                <span className="vr-preset-name">{p.name}</span>
                <span className="vr-preset-label">{p.label}</span>
              </button>
            ))}
          </div>

          <div
            ref={canvasRef}
            className={`room-canvas ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleCanvasDragOver}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              const dt = e.dataTransfer.getData('text/plain');
              if (dt === 'move') {
                handleItemDrop(e);
              } else {
                handleDrop(e);
              }
            }}
            onClick={handleCanvasClick}
          >
            <div className="room-grid" style={{ width: COLS * CELL, height: ROWS * CELL }}>
              {/* Grid cells */}
              {Array.from({ length: ROWS * COLS }).map((_, i) => (
                <div key={i} className="room-cell" />
              ))}

              {/* Room walls */}
              <div className="room-wall room-wall-top" />
              <div className="room-wall room-wall-bottom" />
              <div className="room-wall room-wall-left" />
              <div className="room-wall room-wall-right" />

              {/* Items */}
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
                    draggable
                    onDragStart={e => handleItemDragStart(e, item)}
                    onClick={e => handleItemClick(e, item.id)}
                    onDoubleClick={e => handleItemDoubleClick(e, item.id)}
                  >
                    <img src={item.image} alt={item.name} draggable={false} />
                    <div className="room-item-label">
                      <span className="room-item-name">{item.name}</span>
                      <span className="room-item-price">{item.price.toLocaleString()} ج.م</span>
                    </div>
                    {isSelected && (
                      <>
                        <button className="room-item-rotate" onClick={e => { e.stopPropagation(); handleItemDoubleClick(e, item.id); }} title="تدوير">
                          ↻
                        </button>
                        <button className="room-item-remove" onClick={e => { e.stopPropagation(); handleRemoveItem(item.id); }} title="حذف">
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                );
              })}

              {items.length === 0 && (
                <div className="room-empty-hint">
                  <span>🏠</span>
                  <p>اختر أثاث من القائمة أو اسحب القطع إلى هنا</p>
                  <small>انقر على أي قطعة لإضافتها إلى الغرفة</small>
                </div>
              )}
            </div>
          </div>

          <div className="vr-canvas-footer">
            <span>{items.length} قطعة</span>
            <span>انقر للاختيار • دبل كليك للتدوير • اسحب لتحريك</span>
          </div>
        </div>

        <div className="vr-panel-section">
          <div className="vr-panel-header">
            <span>قائمة الأثاث</span>
            <span className="vr-panel-count">{filteredProducts.length}</span>
          </div>
          <div className="vr-panel-cats">
            {catButtons.map(cat => (
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
                onClick={() => handlePanelItemClick(product)}
              >
                <img src={product.image} alt={product.name} draggable={false} />
                <div className="vr-panel-item-info">
                  <span className="vr-panel-item-name">{product.name}</span>
                  <span className="vr-panel-item-price">{product.price.toLocaleString()} ج.م</span>
                </div>
                <span className="vr-panel-add-hint" title="أضف للغرفة">+</span>
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
