const POINTS_KEY = 'furniturePoints';
const HISTORY_KEY = 'furniturePointsHistory';
const BIRTHDAY_KEY = 'furnitureBirthday';
const REFERRAL_CODE_KEY = 'furnitureReferralCode';
const REFERRED_BY_KEY = 'furnitureReferredBy';
const REFERRALS_KEY = 'furnitureReferrals';

export const POINTS_PER_EGP = 10;
export const POINTS_REDEEM_RATE = 2;
export const MIN_REDEEM_POINTS = 100;
export const BIRTHDAY_BONUS_POINTS = 200;
export const REFERRAL_BONUS_POINTS = 100;
export const BIRTHDAY_MULTIPLIER = 2;

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

/* ====== POINTS ====== */
export function getPointsBalance() {
  return load(POINTS_KEY, 0);
}

export function getPointsHistory() {
  return load(HISTORY_KEY, []);
}

export function addPoints(amount, reason) {
  const balance = getPointsBalance();
  const history = getPointsHistory();
  const entry = { amount, reason, date: new Date().toISOString(), id: `pt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
  history.unshift(entry);
  save(POINTS_KEY, balance + amount);
  save(HISTORY_KEY, history);
  return entry;
}

export function redeemPoints(pointsToRedeem) {
  const balance = getPointsBalance();
  if (pointsToRedeem > balance) return { ok: false, error: 'رصيد النقاط غير كافٍ' };
  if (pointsToRedeem < MIN_REDEEM_POINTS) return { ok: false, error: `الحد الأدنى للاستبدال ${MIN_REDEEM_POINTS} نقطة` };
  const discount = pointsToRedeem * POINTS_REDEEM_RATE;
  addPoints(-pointsToRedeem, `استبدال نقاط - خصم ${discount} ج.م`);
  return { ok: true, discount, pointsUsed: pointsToRedeem };
}

export function calcEarnedPoints(subtotal) {
  return Math.floor(subtotal / POINTS_PER_EGP);
}

export function calcRedeemDiscount(pointsToRedeem) {
  return pointsToRedeem * POINTS_REDEEM_RATE;
}

export function isBirthdayMonth() {
  const birthday = getBirthday();
  if (!birthday) return false;
  const now = new Date();
  return now.getMonth() + 1 === birthday.month;
}

/* ====== BIRTHDAY ====== */
export function getBirthday() {
  return load(BIRTHDAY_KEY, null);
}

export function setBirthday(month, year) {
  save(BIRTHDAY_KEY, { month, year });
}

export function clearBirthday() {
  localStorage.removeItem(BIRTHDAY_KEY);
}

/* ====== REFERRALS ====== */
function generateReferralCode() {
  const prefix = 'FURN';
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${rand}`;
}

export function getReferralCode() {
  let code = load(REFERRAL_CODE_KEY, null);
  if (!code) {
    code = generateReferralCode();
    save(REFERRAL_CODE_KEY, code);
  }
  return code;
}

export function getReferredBy() {
  return load(REFERRED_BY_KEY, null);
}

export function setReferredBy(code) {
  if (code && code.trim()) {
    save(REFERRED_BY_KEY, code.trim().toUpperCase());
  }
}

export function getReferrals() {
  return load(REFERRALS_KEY, []);
}

export function addReferral(referralCode) {
  const referrals = getReferrals();
  referrals.push({ code: referralCode, date: new Date().toISOString() });
  save(REFERRALS_KEY, referrals);
}

export function applyReferralBonus() {
  const referredBy = getReferredBy();
  if (!referredBy) return null;
  const entry = addPoints(REFERRAL_BONUS_POINTS, `مكافأة دعوة صديق (${referredBy})`);
  localStorage.removeItem(REFERRED_BY_KEY);
  return entry;
}
