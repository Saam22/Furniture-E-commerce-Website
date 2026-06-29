import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getDashboard, getAllOrders, updateOrderStatus, getAdminProducts, createProduct, updateProduct, deleteProduct } from '../utils/adminApi';
import { ORDER_STATUSES } from '../data/shippingData';
import '../styles/Admin.css';

const TABS = [
  { id: 'dashboard', label: 'لوحة التحكم' },
  { id: 'orders', label: 'الطلبات' },
  { id: 'products', label: 'المنتجات' },
];

export default function AdminPage({ onClose }) {
  const { user } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'غرف معيشة', image: '', description: '', stockCount: '', discount: '0' });

  useEffect(() => {
    if (!user || user.role !== 'admin') { onClose?.(); return; }
    if (tab === 'dashboard') loadDashboard();
    else if (tab === 'orders') loadOrders();
    else if (tab === 'products') loadProducts();
  }, [tab]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const res = await getDashboard();
      setDashboard(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await getAllOrders(1, orderFilter);
      setOrders(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await getAdminProducts();
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleUpdateStatus(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);
      loadOrders();
    } catch (e) { alert(e.message); }
  }

  async function handleSaveProduct() {
    try {
      const data = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        image: formData.image,
        description: formData.description,
        stockCount: Number(formData.stockCount) || 0,
        discount: Number(formData.discount) || 0,
      };
      if (editProduct) {
        await updateProduct(editProduct, data);
      } else {
        await createProduct(data);
      }
      setEditProduct(null);
      setShowAddForm(false);
      setFormData({ name: '', price: '', category: 'غرف معيشة', image: '', description: '', stockCount: '', discount: '0' });
      loadProducts();
    } catch (e) { alert(e.message); }
  }

  async function handleDelete(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (e) { alert(e.message); }
  }

  function openEdit(p) {
    setEditProduct(p._id);
    setFormData({ name: p.name, price: String(p.price), category: p.category, image: p.image, description: p.description || '', stockCount: String(p.stockCount || 0), discount: String(p.discount || 0) });
    setShowAddForm(true);
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>لوحة الإدارة</h1>
        <button className="admin-close" onClick={onClose}>×</button>
      </div>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`admin-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'dashboard' && renderDashboard()}
        {tab === 'orders' && renderOrders()}
        {tab === 'products' && renderProducts()}
      </div>
    </div>
  );

  function renderDashboard() {
    if (loading) return <div className="admin-loading">جاري التحميل...</div>;
    if (!dashboard || !dashboard.stats) return <div className="admin-loading">فشل تحميل البيانات</div>;
    const { stats, recentOrders: recent, ordersByStatus, lowStockProducts } = dashboard;

    return (
      <>
        <div className="admin-stats">
          <div className="admin-stat-card"><span className="admin-stat-value">{stats.totalUsers}</span><span className="admin-stat-label">المستخدمين</span></div>
          <div className="admin-stat-card"><span className="admin-stat-value">{stats.totalProducts}</span><span className="admin-stat-label">المنتجات</span></div>
          <div className="admin-stat-card"><span className="admin-stat-value">{stats.totalOrders}</span><span className="admin-stat-label">الطلبات</span></div>
          <div className="admin-stat-card"><span className="admin-stat-value">{stats.totalRevenue.toLocaleString()}</span><span className="admin-stat-label">الإيرادات</span></div>
        </div>

        <div className="admin-section">
          <h3>حالة الطلبات</h3>
          <div className="admin-status-bars">
            {ORDER_STATUSES.filter(s => s.id !== 'cancelled').map(s => (
              <div key={s.id} className="admin-status-bar">
                <span className="admin-status-bar-label">{s.label}</span>
                <div className="admin-status-bar-track">
                  <div className="admin-status-bar-fill" style={{ width: `${Math.min(100, ((ordersByStatus?.[s.id] || 0) / Math.max(1, stats.totalOrders)) * 100)}%` }} />
                </div>
                <span className="admin-status-bar-count">{ordersByStatus?.[s.id] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {lowStockProducts?.length > 0 && (
          <div className="admin-section">
            <h3>منتجات منخفضة المخزون</h3>
            <div className="admin-warning-list">
              {lowStockProducts.map(p => (
                <div key={p._id} className="admin-warning-item">
                  <span>{p.name}</span>
                  <span className="admin-warning-stock">المتبقي: {p.stockCount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="admin-section">
          <h3>آخر الطلبات</h3>
          {recent?.map(o => (
            <div key={o._id} className="admin-recent-order">
              <span className="admin-recent-order-user">{o.user?.name || o.user?.email || '—'}</span>
              <span className="admin-recent-order-total">{o.grandTotal?.toLocaleString()} ج.م</span>
              <span className="admin-recent-order-status">{ORDER_STATUSES.find(s => s.id === o.status)?.label}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderOrders() {
    return (
      <>
        <div className="admin-filter-bar">
          <select value={orderFilter} onChange={e => { setOrderFilter(e.target.value); loadOrders(); }}>
            <option value="">كل الطلبات</option>
            {ORDER_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <button className="admin-refresh-btn" onClick={loadOrders}>تحديث</button>
        </div>

        {loading ? <div className="admin-loading">جاري التحميل...</div> : (
          <div className="admin-orders-list">
            {orders.length === 0 && <div className="admin-loading">لا توجد طلبات</div>}
            {orders.map(o => (
              <div key={o._id} className="admin-order-card">
                <div className="admin-order-card-header">
                  <div>
                    <span className="admin-order-user">{o.user?.name || o.user?.email || 'مستخدم'}</span>
                    <span className="admin-order-date">{new Date(o.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <span className="admin-order-total">{o.grandTotal?.toLocaleString()} ج.م</span>
                </div>
                <div className="admin-order-card-body">
                  <span className={`admin-order-status-badge status-${o.status}`}>
                    {ORDER_STATUSES.find(s => s.id === o.status)?.label}
                  </span>
                </div>
                {(o.status === 'pending' || o.status === 'confirmed') && (
                  <div className="admin-order-actions">
                    {o.status === 'pending' && (
                      <button className="admin-action-btn confirm" onClick={() => handleUpdateStatus(o._id, 'confirmed')}>تأكيد</button>
                    )}
                    {o.status === 'confirmed' && (
                      <button className="admin-action-btn process" onClick={() => handleUpdateStatus(o._id, 'processing')}>قيد التجهيز</button>
                    )}
                    {['pending', 'confirmed'].includes(o.status) && (
                      <button className="admin-action-btn cancel" onClick={() => handleUpdateStatus(o._id, 'cancelled')}>إلغاء</button>
                    )}
                  </div>
                )}
                {!['pending', 'confirmed'].includes(o.status) && o.status !== 'cancelled' && (
                  <div className="admin-order-actions">
                    <button className="admin-action-btn process" onClick={() => {
                      const next = { processing: 'shipped', shipped: 'out_for_delivery', out_for_delivery: 'delivered' }[o.status];
                      if (next) handleUpdateStatus(o._id, next);
                    }}>المرحلة التالية</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  function renderProducts() {
    return (
      <>
        <div className="admin-products-toolbar">
          <button className="admin-add-btn" onClick={() => { setEditProduct(null); setFormData({ name: '', price: '', category: 'غرف معيشة', image: '', description: '', stockCount: '', discount: '0' }); setShowAddForm(true); }}>
            + إضافة منتج
          </button>
        </div>

        {showAddForm && (
          <div className="admin-product-form">
            <h3>{editProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
            <div className="admin-form-grid">
              <input placeholder="اسم المنتج" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input placeholder="السعر" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="غرف معيشة">غرف معيشة</option>
                <option value="غرف نوم">غرف نوم</option>
                <option value="غرف طعام">غرف طعام</option>
                <option value="مكاتب">مكاتب</option>
                <option value="ديكور">ديكور</option>
              </select>
              <input placeholder="رابط الصورة" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
              <input placeholder="الكمية" type="number" value={formData.stockCount} onChange={e => setFormData({ ...formData, stockCount: e.target.value })} />
              <input placeholder="الخصم %" type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} />
              <textarea className="admin-form-full" placeholder="الوصف" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="admin-form-actions">
              <button className="admin-save-btn" onClick={handleSaveProduct}>حفظ</button>
              <button className="admin-cancel-form-btn" onClick={() => setShowAddForm(false)}>إلغاء</button>
            </div>
          </div>
        )}

        {loading ? <div className="admin-loading">جاري التحميل...</div> : (
          <div className="admin-products-list">
            {products.map(p => (
              <div key={p._id} className="admin-product-card">
                <img src={p.image} alt={p.name} className="admin-product-img" />
                <div className="admin-product-info">
                  <span className="admin-product-name">{p.name}</span>
                  <span className="admin-product-price">{p.price.toLocaleString()} ج.م</span>
                  <span className="admin-product-stock">المخزون: {p.stockCount}</span>
                </div>
                <div className="admin-product-actions">
                  <button className="admin-product-edit" onClick={() => openEdit(p)}>تعديل</button>
                  <button className="admin-product-delete" onClick={() => handleDelete(p._id)}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}
