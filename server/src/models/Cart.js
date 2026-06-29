import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  appliedCoupon: {
    code: String,
    discount: Number,
  },
}, {
  timestamps: true,
});

cartSchema.methods.calcTotal = async function () {
  await this.populate('items.product');
  const subtotal = this.items.reduce((sum, item) => {
    const price = item.product.discount
      ? item.product.price - (item.product.price * item.product.discount) / 100
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);
  return subtotal;
};

export default mongoose.model('Cart', cartSchema);
