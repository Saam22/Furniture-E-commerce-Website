import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { success, created } from '../utils/ApiResponse.js';

function generateToken(user) {
  return jwt.sign({ userId: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw ApiError.conflict('Email already registered');

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      referralCode: new User().generateReferralCode(),
    });

    const token = generateToken(user);

    return created(res, {
      user: user.toJSON(),
      token,
    }, 'Account created successfully');
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

    if (!user.isActive) throw ApiError.forbidden('Account has been deactivated');

    const token = generateToken(user);

    return success(res, {
      user: user.toJSON(),
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    return success(res, { user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone, birthday } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (birthday) updates.birthday = birthday;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return success(res, { user }, 'Profile updated');
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

    user.password = newPassword;
    await user.save();

    return success(res, null, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function getLoyaltyInfo(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const { TIERS, LOYALTY } = await import('../utils/constants.js');

    const currentTier = TIERS.filter(t => user.orderCount >= t.minOrders).pop() || TIERS[0];
    const nextTier = TIERS.find(t => t.minOrders > user.orderCount) || null;

    return success(res, {
      points: user.points,
      pointsHistory: user.pointsHistory.slice(-50),
      currentTier,
      nextTier,
      birthday: user.birthday,
      referralCode: user.referralCode,
      referrals: user.referrals,
      orderCount: user.orderCount,
      rules: LOYALTY,
    });
  } catch (error) {
    next(error);
  }
}
