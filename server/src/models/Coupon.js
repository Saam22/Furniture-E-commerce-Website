import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percent', 'fixed', 'freeshipping'],
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  minAmount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  usageLimit: {
    type: Number,
    default: null,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

couponSchema.methods.isValid = function (subtotal) {
  if (!this.isActive) return false;
  if (this.expiresAt && this.expiresAt < new Date()) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  if (subtotal < this.minAmount) return false;
  return true;
};

export default mongoose.model('Coupon', couponSchema);
