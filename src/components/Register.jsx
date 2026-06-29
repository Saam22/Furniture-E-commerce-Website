import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Register({ onSwitch, onClose }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        <h2>إنشاء حساب جديد</h2>
        <p className="auth-subtitle">انضم إلينا واستمتع بتجربة تسوق مميزة</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>الاسم</label>
            <input
              type="text"
              placeholder="أدخل اسمك"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              minLength={2}
            />
          </div>
          <div className="auth-field">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="auth-field">
            <label>رقم الهاتف (اختياري)</label>
            <input
              type="tel"
              placeholder="أدخل رقم الهاتف"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="auth-field">
            <label>كلمة المرور</label>
            <input
              type="password"
              placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button className="auth-submit" disabled={loading}>
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="auth-switch">
          لديك حساب بالفعل؟{' '}
          <button className="auth-link-btn" onClick={onSwitch}>تسجيل الدخول</button>
        </p>
      </div>
    </div>
  );
}
