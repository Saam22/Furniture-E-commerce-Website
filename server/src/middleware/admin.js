import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../utils/constants.js';

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
}
