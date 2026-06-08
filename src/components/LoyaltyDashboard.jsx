import { useState, useEffect } from 'react';
import { getLoyaltyTier, getNextTier } from '../utils/discountUtils';
import {
  getPointsBalance, getPointsHistory, getBirthday, setBirthday,
  getReferralCode, getReferrals, isBirthdayMonth,
  POINTS_REDEEM_RATE, MIN_REDEEM_POINTS, REFERRAL_BONUS_POINTS, BIRTHDAY_BONUS_POINTS,
  POINTS_PER_EGP,
} from '../data/loyaltyData';
import '../styles/LoyaltyDashboard.css';

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

const LoyaltyDashboard = ({ orderCount, onClose }) => {
  const [points, setPoints] = useState(getPointsBalance());
  const [history] = useState(getPointsHistory());
  const [birthday, setBirthdayState] = useState(getBirthday());
  const [selectedMonth, setSelectedMonth] = useState(birthday?.month || '');
  const [selectedYear, setSelectedYear] = useState(birthday?.year || '');
  const referralCode = getReferralCode();
  const referrals = getReferrals();
  const tier = getLoyaltyTier(orderCount);
  const next = getNextTier(orderCount);
  const isBirthday = isBirthdayMonth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSaveBirthday = () => {
    if (selectedMonth && selectedYear) {
      setBirthday(Number(selectedMonth), Number(selectedYear));
      setBirthdayState({ month: Number(selectedMonth), year: Number(selectedYear) });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
  };

  const progressToNext = next
    ? Math.min(orderCount / next.minOrders * 100, 99)
    : 100;

  const years = Array.from({ length: 80 }, (_, i) => currentYear - i);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <aside className="loyalty-sidebar">
        <div className="cart-header">
          <h2>برنامج الولاء</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="loyalty-body">
          {/* Tier Card */}
          <div className="loyalty-tier-card" style={{ borderColor: tier.color }}>
            <div className="loyalty-tier-header">
              <span className="loyalty-tier-badge" style={{ background: tier.color, color: tier.id === 'gold' || tier.id === 'platinum' ? '#333' : '#fff' }}>
                {tier.label}
              </span>
              <span className="loyalty-tier-discount">خصم {tier.discount}%</span>
            </div>
            {orderCount > 0 && (
              <div className="loyalty-tier-orders">
                <span>{orderCount} طلب{orderCount > 1 ? 'ات' : ''}</span>
              </div>
            )}
            {next && (
              <div className="loyalty-progress">
                <div className="loyalty-progress-header">
                  <span>المستوى التالي: {next.label}</span>
                  <span>{orderCount} / {next.minOrders} طلب</span>
                </div>
                <div className="loyalty-progress-bar">
                  <div className="loyalty-progress-fill" style={{ width: `${progressToNext}%`, background: next.color }} />
                </div>
                <span className="loyalty-progress-hint">اطلب {next.minOrders - orderCount} قطع إضافية للوصول</span>
              </div>
            )}
            {!next && (
              <div className="loyalty-max-tier">🎉 أنت في أعلى مستوى ولاء!</div>
            )}
          </div>

          {/* Points Card */}
          <div className="loyalty-card">
            <div className="loyalty-card-title">
              <span className="loyalty-points-icon">✦</span>
              <h3>رصيد النقاط</h3>
            </div>
            <div className="loyalty-points-balance">{points.toLocaleString()}</div>
            <p className="loyalty-points-hint">
              كل {POINTS_PER_EGP.toLocaleString()} ج.م = نقطة • {MIN_REDEEM_POINTS} نقطة كحد أدنى للاستبدال
            </p>
            {points >= MIN_REDEEM_POINTS && (
              <p className="loyalty-points-avail">
                يمكنك استبدال نقاطك بخصم يصل إلى {Math.floor(points / MIN_REDEEM_POINTS) * MIN_REDEEM_POINTS * POINTS_REDEEM_RATE} ج.م
              </p>
            )}
          </div>

          {/* Points History */}
          {history.length > 0 && (
            <div className="loyalty-card">
              <h3 className="loyalty-card-title">سجل النقاط</h3>
              <div className="loyalty-history">
                {history.slice(0, 15).map(entry => (
                  <div key={entry.id} className="loyalty-history-row">
                    <div className="loyalty-history-info">
                      <span className="loyalty-history-reason">{entry.reason}</span>
                      <span className="loyalty-history-date">
                        {new Date(entry.date).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    <span className={`loyalty-history-amount ${entry.amount > 0 ? 'positive' : 'negative'}`}>
                      {entry.amount > 0 ? '+' : ''}{entry.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Birthday Card */}
          <div className="loyalty-card">
            <div className="loyalty-card-title">
              <span className="loyalty-birthday-icon">🎂</span>
              <h3>مكافأة عيد الميلاد</h3>
            </div>
            {isBirthday && (
              <div className="loyalty-birthday-active">
                🎉 شهر ميلادك! ستحصل على ضعف النقاط في كل طلب!
              </div>
            )}
            {birthday ? (
              <div className="loyalty-birthday-set">
                <span>تاريخ ميلادك: {MONTHS[birthday.month - 1]} {birthday.year}</span>
              </div>
            ) : (
              <p className="loyalty-birthday-hint">أدخل تاريخ ميلادك واحصل على {BIRTHDAY_BONUS_POINTS} نقطة هدية وخصومات خاصة!</p>
            )}
            <div className="loyalty-birthday-form">
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                <option value="">الشهر</option>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                <option value="">السنة</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button
                className="btn btn-primary"
                onClick={handleSaveBirthday}
                disabled={!selectedMonth || !selectedYear}
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              >
                حفظ
              </button>
            </div>
          </div>

          {/* Referral Card */}
          <div className="loyalty-card">
            <div className="loyalty-card-title">
              <span className="loyalty-referral-icon">👥</span>
              <h3>ادعي صديق</h3>
            </div>
            <p className="loyalty-referral-hint">
              شارك كود الدعوة الخاص بك. عندما يسجل صديق ويطلب أول طلب، تحصل أنت على {REFERRAL_BONUS_POINTS} نقطة!
            </p>
            <div className="loyalty-referral-code">
              <span className="loyalty-referral-code-text">{referralCode}</span>
              <button className="btn btn-primary" onClick={handleCopyCode} style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                نسخ
              </button>
            </div>
            {referrals.length > 0 && (
              <div className="loyalty-referral-stats">
                <span>تمت دعوة {referrals.length} صديق</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default LoyaltyDashboard;
