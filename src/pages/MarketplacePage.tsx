import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { SkeletonCard } from '../components/ui/Loader';
import { PROPERTY_TYPE_OPTIONS, PROPERTY_CATEGORY_OPTIONS, PRICE_RANGE_OPTIONS } from '../utils/helpers';

const ITEMS_PER_PAGE = 6;

export function MarketplacePage() {
  const {
    listedProperties,
    isLoadingProperties,
    filterType,
    filterCategory,
    filterPrice,
    setFilterType,
    setFilterCategory,
    setFilterPrice,
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);

  // Filter logic
  const filteredProperties = useMemo(() => {
    return listedProperties.filter((p) => {
      const typeMatch = !filterType || filterType === 'All Types' || p.propType === filterType;
      const catMatch = !filterCategory || filterCategory === 'All Categories' || p.category === filterCategory;
      let priceMatch = true;
      if (filterPrice === '0 - 50K') priceMatch = Number(p.price) / 1e18 <= 50000;
      else if (filterPrice === '50K - 250K') priceMatch = Number(p.price) / 1e18 > 50000 && Number(p.price) / 1e18 <= 250000;
      else if (filterPrice === '250K+') priceMatch = Number(p.price) / 1e18 > 250000;
      return typeMatch && catMatch && priceMatch;
    });
  }, [listedProperties, filterType, filterCategory, filterPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / ITEMS_PER_PAGE));
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleApplyFilters = () => setCurrentPage(1);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [paginatedProperties]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-8 bg-deep-radial page-enter">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 md:mb-16 scroll-reveal">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter mb-4">
            Marketplace
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-light text-base md:text-lg font-body">
            Curated digital real estate assets with high liquidity and verified chain history.
          </p>
        </header>

        {/* Filter Bar */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row gap-4 md:gap-6 items-end scroll-reveal">
          <div className="flex-1 w-full space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              Property Type
            </label>
            <div className="relative">
              <select
                className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary appearance-none outline-none font-body text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {PROPERTY_TYPE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-3 text-on-surface-variant pointer-events-none text-base">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              Price Range (Tokens)
            </label>
            <div className="relative">
              <select
                className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary appearance-none outline-none font-body text-sm"
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
              >
                {PRICE_RANGE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-3 text-on-surface-variant pointer-events-none text-base">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              Category
            </label>
            <div className="relative">
              <select
                className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary appearance-none outline-none font-body text-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {PROPERTY_CATEGORY_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-3 text-on-surface-variant pointer-events-none text-base">
                expand_more
              </span>
            </div>
          </div>

          <button
            onClick={handleApplyFilters}
            className="bg-surface-container-high text-primary border border-outline-variant/20 px-6 md:px-8 py-3 rounded-lg hover:bg-surface-container-highest transition-colors font-headline font-semibold whitespace-nowrap w-full md:w-auto"
          >
            Apply Filters
          </button>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-on-surface-variant text-sm font-body">
            {filteredProperties.length} properties found
          </p>
          {(filterType || filterCategory || filterPrice) && (
            <button
              onClick={() => { setFilterType(''); setFilterCategory(''); setFilterPrice(''); setCurrentPage(1); }}
              className="text-primary text-sm font-label hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoadingProperties
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : paginatedProperties.length > 0
            ? paginatedProperties.map((property, i) => (
                <PropertyCard key={property.id} property={property} animationDelay={i * 80} />
              ))
            : (
              <div className="col-span-3 flex flex-col items-center justify-center py-24 gap-6">
                <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">domain_disabled</span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-headline font-bold mb-2">No properties found</h3>
                  <p className="text-on-surface-variant text-sm font-body">Try adjusting your filters</p>
                </div>
              </div>
            )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 md:mt-20 flex justify-center items-center gap-4">
            <button
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full font-bold font-label text-sm transition-all ${
                    page === currentPage
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}