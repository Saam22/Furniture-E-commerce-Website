import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { ApiError } from '../utils/ApiError.js';
import { success, created, paginated } from '../utils/ApiResponse.js';
import { CATEGORIES } from '../utils/constants.js';

export async function getProducts(req, res, next) {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sort = 'default',
      minPrice,
      maxPrice,
      minRating,
      isNew,
    } = req.query;

    const query = { isActive: true };

    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (isNew === 'true') query.isNewArrival = true;

    let sortOption = {};
    switch (sort) {
      case 'price-low': sortOption = { price: 1 }; break;
      case 'price-high': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { rating: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      default: sortOption = { isNewArrival: -1, rating: -1, createdAt: -1 }; break;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return paginated(res, products, {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) throw ApiError.notFound('Product not found');

    const reviews = await Review.find({ product: product._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return success(res, { product, reviews });
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedProducts(req, res, next) {
  try {
    const featured = await Product.find({ isActive: true, isNewArrival: true })
      .sort({ rating: -1 })
      .limit(8)
      .lean();
    return success(res, { products: featured });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req, res, next) {
  try {
    const categoriesWithCount = await Promise.all(
      CATEGORIES.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat.id, isActive: true });
        return { ...cat, count };
      })
    );
    return success(res, { categories: categoriesWithCount });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    return created(res, { product }, 'Product created');
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) throw ApiError.notFound('Product not found');
    return success(res, { product }, 'Product updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!product) throw ApiError.notFound('Product not found');
    return success(res, null, 'Product deleted');
  } catch (error) {
    next(error);
  }
}
