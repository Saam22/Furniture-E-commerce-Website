import User from '../models/User.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { success } from '../utils/ApiResponse.js';

export async function getWishlist(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('wishlist').lean();
    return success(res, { wishlist: user.wishlist || [] });
  } catch (error) {
    next(error);
  }
}

export async function toggleWishlist(req, res, next) {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound('Product not found');

    const user = await User.findById(req.user._id);
    const index = user.wishlist.findIndex(id => id.toString() === productId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      return success(res, { wishlist: user.wishlist, isInWishlist: false }, 'Removed from wishlist');
    } else {
      user.wishlist.push(productId);
      await user.save();
      return success(res, { wishlist: user.wishlist, isInWishlist: true }, 'Added to wishlist');
    }
  } catch (error) {
    next(error);
  }
}

export async function clearWishlist(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { wishlist: [] });
    return success(res, { wishlist: [] }, 'Wishlist cleared');
  } catch (error) {
    next(error);
  }
}

export async function addAllToCart(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const Cart = (await import('../models/Cart.js')).default;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const productId of user.wishlist) {
      const exists = cart.items.find(i => i.product.toString() === productId.toString());
      if (!exists) {
        cart.items.push({ product: productId, quantity: 1 });
      }
    }

    await cart.save();
    return success(res, null, 'All wishlist items added to cart');
  } catch (error) {
    next(error);
  }
}
