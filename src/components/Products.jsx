import { useState } from 'react';
import ProductCard from './ProductCard';
import RatingFilter from './RatingFilter';
import '../styles/Products.css';

const Products = ({ products, addToCart, searchQuery, onClearSearch, wishlist, onToggleWishlist, compareIds, onToggleCompare, onOpenGallery, minRating, onRatingChange }) => {
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [showAll, setShowAll] = useState(false);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':  return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating':     return b.rating - a.rating;
      case 'newest':     return Number(b.isNew) - Number(a.isNew);
      default:           return 0;
    }
  });

  const INITIAL_COUNT = 8;
  const visibleProducts = showAll ? sortedProducts : sortedProducts.slice(0, INITIAL_COUNT);
  const hasMore = sortedProducts.length > INITIAL_COUNT;

  return (
    <section className="products-section" id="products">
      <div className="container">
        <div className="section-header products-header">
          <div>
            <h2>
              {searchQuery
                ? `نتائج البحث عن "${searchQuery}"`
                : 'منتجاتنا المميزة'}
            </h2>
            <p>
              {searchQuery
                ? `${sortedProducts.length} منتج متاح`
                : 'قطع مختارة بعناية لتجديد البيت من غير دوشة.'}
            </p>
          </div>

          <div className="products-controls">
            <label className="sort-control">
              <span>ترتيب حسب</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">الأكثر مناسبة</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="newest">الأحدث</option>
              </select>
            </label>

            <RatingFilter minRating={minRating} onChange={onRatingChange} />

            <div className="view-toggle" aria-label="طريقة العرض">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="عرض شبكي"
              >▦</button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                title="عرض قائمة"
              >☰</button>
            </div>
          </div>
        </div>

        {sortedProducts.length > 0 ? (
          <>
            <div className={`products-${viewMode}`}>
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  index={index}
                  viewMode={viewMode}
                  searchQuery={searchQuery}
                  isInWishlist={wishlist.includes(product.id)}
                  onToggleWishlist={() => onToggleWishlist(product.id)}
                  isInCompare={compareIds.includes(product.id)}
                  onToggleCompare={() => onToggleCompare(product.id)}
                  onOpenGallery={() => onOpenGallery(product)}
                />
              ))}
            </div>

            {hasMore && !showAll && (
              <div className="show-more-wrapper">
                <button className="show-more-btn" onClick={() => setShowAll(true)}>
                  عرض المزيد ({sortedProducts.length - INITIAL_COUNT} منتج)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-products">
            <span className="no-products-icon">□</span>
            {searchQuery ? (
              <>
                <h3>ما لقيناش نتائج لـ "{searchQuery}"</h3>
                <p>جرب كلمة تانية أو تصفح الفئات.</p>
                <button className="btn btn-primary clear-search-btn" onClick={onClearSearch}>
                  عرض كل المنتجات
                </button>
              </>
            ) : (
              <>
                <h3>لا توجد منتجات في هذه الفئة</h3>
                <p>جرب فئة أخرى أو ارجع لكل المنتجات.</p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;