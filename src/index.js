import FilterCheckboxManager from './filters/filter-checkbox.js';
import FilterRadioManager from './filters/filter-radio.js';
import FilterSelectManager from './filters/filter-select.js';
import FilterSelectRangeManager from './filters/filter-select-range.js';
import FilterChipsManager from './filters/filter-chips.js';
import FilterSortManager from './filters/filter-sort.js';
import FilterPaginationManager from './filters/filter-pagination.js';
import FilterResetManager from './filters/filter-reset.js';
import FilterSearchManager from './filters/filter-search.js';

// Export all components
export { FilterCheckboxManager };
export { FilterRadioManager };
export { FilterSelectManager };
export { FilterSelectRangeManager };
export { FilterChipsManager };
export { FilterSortManager };
export { FilterPaginationManager };
export { FilterResetManager };
export { FilterSearchManager };

let managersInitialized = false;

const initializeAllManagers = (Wized) => {
  if (managersInitialized || !Wized) {
    return;
  }
  managersInitialized = true;

  // Initialize chips manager first since other managers depend on it
  new FilterChipsManager(Wized);

  // Initialize all other filter managers
  new FilterCheckboxManager(Wized);
  new FilterRadioManager(Wized);
  new FilterSelectManager(Wized);
  new FilterSelectRangeManager(Wized);
  new FilterSortManager(Wized);
  new FilterPaginationManager(Wized);
  new FilterSearchManager(Wized);

  // Initialize reset manager last since it depends on other managers being ready
  new FilterResetManager(Wized);
};

const isWizedApiReady = (maybeWized) =>
  !!maybeWized &&
  typeof maybeWized === 'object' &&
  !!maybeWized.data &&
  typeof maybeWized.on === 'function';

const bootstrapWizedManagers = () => {
  // If Wized already hydrated, initialize immediately
  if (isWizedApiReady(window.Wized)) {
    initializeAllManagers(window.Wized);
    return;
  }

  // Ensure our callback is queued for when Wized finishes booting
  window.Wized = Array.isArray(window.Wized) ? window.Wized : [];
  window.Wized.push((Wized) => {
    initializeAllManagers(Wized);
  });
};

// Initialize components when loaded in browser
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready before attempting to bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapWizedManagers);
  } else {
    bootstrapWizedManagers();
  }
}
