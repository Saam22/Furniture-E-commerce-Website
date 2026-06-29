import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { success, created } from '../utils/ApiResponse.js';

export async function getProductReviews(req, res, next) {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const productId = req.params.productId;

    let sortOption = {};
    switch (sort) {
      case 'oldest': sortOption = { createdAt: 1 }; break;
      case 'highest': sortOption = { rating: -1 }; break;
      case 'lowest': sortOption = { rating: 1 }; break;
      default: sortOption = { createdAt: -1 }; break;
    }

    const total = await Review.countDocuments({ product: productId });
    const reviews = await Review.find({ product: productId })
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const distribution = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);

    const distMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distribution.forEach(d => { distMap[d._id] = d.count; });

    return res.json({
      success: true,
      data: { reviews, distribution: distMap, average: 0 },
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req, res, next) {
  try {
    const { product: productId, rating, text, images } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound('Product not found');

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) throw ApiError.conflict('You have already reviewed this product');

    const hasOrdered = await Order.exists({
      user: req.user._id,
      'items.product': productId,
      status: 'delivered',
    });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      author: req.user.name,
      rating,
      text,
      images: images || [],
      isVerified: !!hasOrdered,
    });

    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      product.rating = Math.round(stats[0].avgRating * 10) / 10;
      product.reviewCount = stats[0].count;
    } else {
      product.rating = rating;
      product.reviewCount = 1;
    }
    await product.save();

    return created(res, { review }, 'Review added successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) throw ApiError.notFound('Review not found');

    await Review.deleteOne({ _id: review._id });

    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    await Product.findByIdAndUpdate(review.product, {
      rating: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
      reviewCount: stats.length > 0 ? stats[0].count : 0,
    });

    return success(res, null, 'Review deleted');
  } catch (error) {
    next(error);
  }
}
