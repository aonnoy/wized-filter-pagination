/**
 * FilterChipsManager: Main class responsible for managing filter chips functionality
 *
 * This class handles:
 * 1. State Management: Tracks chips and their relationships
 * 2. UI Management: Handles chip creation, updates, and removal
 * 3. DOM Management: Manages chip template and container
 * 4. Event Handling: Manages chip interactions
 *
 * The manager supports multiple filter types (checkbox, radio, select)
 * and provides a clean public API for external integrations.
 */
class FilterChipsManager {
  constructor(Wized) {
    console.log('[FilterChipsManager] Initializing...');
    this.Wized = Wized;

    // Internal state
    this.state = {
      chipTemplate: null,
      chipContainer: null,
      chipRelationships: new Map(),
      activeChips: new Set(),
      // Filter types that allow only one selection per category
      singleSelectionCategories: new Set(['radio', 'select']),
      // Track chips by their source type
      chipsByType: new Map(),
      isEnabled: false, // Track if chips functionality is enabled
    };

    // Initialize the manager
    this.initialize();
  }

  // =============================================
  // INITIALIZATION AND SETUP
  // =============================================

  /**
   * Initializes the chips manager and sets up necessary elements
   */
  initialize() {
    // Set up template and container
    const hasTemplate = this.setupTemplate();
    const hasContainer = this.setupContainer();

    // Only enable chips if both template and container are present
    this.state.isEnabled = hasTemplate && hasContainer;
    console.log(
      '[FilterChipsManager] Initialization complete. Chips enabled:',
      this.state.isEnabled
    );

    if (this.state.isEnabled) {
      // Initialize chip type tracking
      this.state.chipsByType.set('checkbox', new Set());
      this.state.chipsByType.set('radio', new Set());
      this.state.chipsByType.set('select', new Set());

      // Make public API available globally
      this.exposePublicAPI();
    } else {
      console.log(
        '[FilterChipsManager] Chips functionality disabled due to missing template or container'
      );
    }
  }

  /**
   * Sets up the chip template element
   */
  setupTemplate() {
    console.log('[FilterChipsManager] Setting up template...');
    if (this.state.chipTemplate) return true;

    const template = document.querySelector('div[w-filter-chip="chip"]');
    if (!template) {
      console.log('[FilterChipsManager] No chip template found');
      return false;
    }

    // Hide the template element
    template.style.display = 'none';
    this.state.chipTemplate = template;
    console.log('[FilterChipsManager] Template setup successful');
    return true;
  }

  /**
   * Sets up the chip container element
   */
  setupContainer() {
    console.log('[FilterChipsManager] Setting up container...');
    if (this.state.chipContainer) return true;

    const template = this.state.chipTemplate;
    if (!template) {
      console.log('[FilterChipsManager] No template available for container setup');
      return false;
    }

    const container = template.parentElement;
    if (!container) {
      console.log('[FilterChipsManager] No container found');
      return false;
    }

    this.state.chipContainer = container;
    console.log('[FilterChipsManager] Container setup successful');
    return true;
  }

  // =============================================
  // CHIP RELATIONSHIP MANAGEMENT
  // =============================================

  /**
   * Creates a relationship between a chip and its source element
   */
  createChipRelationship(chipId, sourceElement, onSourceUpdate) {
    if (!chipId || !sourceElement) {
      console.error('Invalid chip relationship parameters');
      return;
    }

    this.state.chipRelationships.set(chipId, {
      sourceElement,
      onSourceUpdate,
    });
  }

  /**
   * Handles the removal of a chip and its relationships
   */
  handleChipRemoval(chip) {
    if (!chip) {
      console.error('Invalid chip element provided for removal');
      return;
    }

    const chipId = chip.getAttribute('data-chip-id');
    const filterType = chip.getAttribute('data-filter-type');

    if (!chipId) {
      console.error('Chip missing required data-chip-id attribute');
      return;
    }

    // Remove from tracking sets first
    this.state.activeChips.delete(chipId);
    if (filterType) {
      this.state.chipsByType.get(filterType)?.delete(chipId);
    }

    // Get relationship before removing the chip
    const relationship = this.state.chipRelationships.get(chipId);

    // Remove the chip element
    chip.remove();

    // Handle relationship after chip removal
    if (relationship) {
      try {
        // Execute the source update callback after chip is removed
        relationship.onSourceUpdate();
      } catch (error) {
        console.error('Error updating source element:', error);
      } finally {
        // Clean up the relationship
        this.state.chipRelationships.delete(chipId);
      }
    }
  }

  // =============================================
  // CHIP CREATION AND MANAGEMENT
  // =============================================

  /**
   * Checks if a chip already exists
   */
  doesChipExist(category, value) {
    const chipId = `${category}-${value}`;
    return this.state.activeChips.has(chipId);
  }

  /**
   * Handles single-selection filter types (radio, select)
   */
  handleSingleSelection(filterType, category) {
    if (!this.state.singleSelectionCategories.has(filterType)) return;

    // Clear existing chips for this category
    this.clearCategoryChips(category);
  }

  /**
   * Creates a new filter chip
   */
  createFilterChip({ label, filterType, category, value, sourceElement, onSourceUpdate }) {
    if (!this.state.isEnabled) {
      console.log('[FilterChipsManager] Chips disabled, skipping chip creation');
      // Still execute the source update callback if provided
      if (onSourceUpdate) {
        onSourceUpdate();
      }
      return null;
    }

    try {
      // Validate required parameters
      if (!label || !category || !value) {
        console.error('[FilterChipsManager] Missing required parameters for chip creation');
        return null;
      }

      console.log('[FilterChipsManager] Creating chip:', { label, filterType, category, value });

      // Check if template exists - chips are optional
      const template = this.state.chipTemplate;
      if (!template) {
        // If no template exists, just execute the source update callback
        if (onSourceUpdate) {
          onSourceUpdate();
        }
        return null;
      }

      // Check if chip already exists
      if (this.doesChipExist(category, value)) {
        return null;
      }

      // Handle single-selection filter types
      if (filterType) {
        this.handleSingleSelection(filterType, category);
      }

      // Clone the template
      const chip = template.cloneNode(true);
      const chipId = `${category}-${value}`;

      // Set data attributes
      chip.setAttribute('data-filter-type', filterType || 'default');
      chip.setAttribute('data-filter-category', category);
      chip.setAttribute('data-filter-value', value);
      chip.setAttribute('data-chip-id', chipId);

      // Ensure chip is visible
      chip.style.display = '';

      // Set the label text
      const labelElement = chip.querySelector('[w-filter-chip="label"]');
      if (labelElement) {
        labelElement.textContent = label;
      } else {
        console.warn('Label element not found in chip template');
      }

      // Add remove button handler
      const removeButton = chip.querySelector('[w-filter-chip="remove"]');
      if (removeButton) {
        removeButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleChipRemoval(chip);
        });
      } else {
        console.warn('Remove button not found in chip template');
      }

      // Create relationship if source element is provided
      if (sourceElement && onSourceUpdate) {
        this.createChipRelationship(chipId, sourceElement, onSourceUpdate);
      }

      // Add to tracking sets
      this.state.activeChips.add(chipId);
      if (filterType) {
        const typeSet = this.state.chipsByType.get(filterType);
        if (typeSet) {
          typeSet.add(chipId);
        } else {
          console.warn(`Unknown filter type: ${filterType}`);
        }
      }

      return chip;
    } catch (error) {
      console.error('[FilterChipsManager] Error creating filter chip:', error);
      return null;
    }
  }

  /**
   * Adds a chip to the container
   */
  addChipToContainer(chip) {
    const container = this.state.chipContainer;
    const template = this.state.chipTemplate;

    // If no container or template exists, chips are disabled
    if (!container || !template) {
      return false;
    }

    // Insert new chip after the template
    container.insertBefore(chip, template.nextSibling);
    return true;
  }

  // =============================================
  // CHIP REMOVAL AND CLEARING
  // =============================================

  /**
   * Removes a chip by its category and value
   */
  removeChipByValue(category, value) {
    const chipId = `${category}-${value}`;
    const chip = document.querySelector(`[data-chip-id="${chipId}"]`);

    if (chip && chip !== this.state.chipTemplate) {
      this.handleChipRemoval(chip);
      return true;
    }

    return false;
  }

  /**
   * Clears all chips for a specific category
   */
  clearCategoryChips(category) {
    const container = this.state.chipContainer;
    if (!container) return;

    const chips = Array.from(container.querySelectorAll(`[data-filter-category="${category}"]`));

    chips.forEach((chip) => {
      if (chip !== this.state.chipTemplate) {
        this.handleChipRemoval(chip);
      }
    });
  }

  /**
   * Clears all chips of a specific type
   */
  clearTypeChips(filterType) {
    const chipIds = this.state.chipsByType.get(filterType);
    if (!chipIds) return;

    chipIds.forEach((chipId) => {
      const chip = document.querySelector(`[data-chip-id="${chipId}"]`);
      if (chip && chip !== this.state.chipTemplate) {
        this.handleChipRemoval(chip);
      }
    });
  }

  /**
   * Clears all chips
   */
  clearAllChips() {
    const container = this.state.chipContainer;
    if (!container) return;

    const chips = Array.from(container.querySelectorAll('[w-filter-chip="chip"]'));

    chips.forEach((chip) => {
      if (chip !== this.state.chipTemplate) {
        this.handleChipRemoval(chip);
      }
    });
  }

  // =============================================
  // PUBLIC API
  // =============================================

  /**
   * Exposes the public API for external use
   */
  exposePublicAPI() {
    if (!this.state.isEnabled) {
      console.log('[FilterChipsManager] Chips disabled, skipping API exposure');
      return;
    }

    console.log('[FilterChipsManager] Exposing public API');
    window.filterChips = {
      create: this.createFilterChip.bind(this),
      addToContainer: this.addChipToContainer.bind(this),
      removeByValue: this.removeChipByValue.bind(this),
      clearCategory: this.clearCategoryChips.bind(this),
      clearType: this.clearTypeChips.bind(this),
      clearAll: this.clearAllChips.bind(this),
      exists: this.doesChipExist.bind(this),
    };

    // Signal that chips system is ready
    window.filterChipsReady = true;
    console.log('[FilterChipsManager] Public API exposed successfully');
  }
}

export default FilterChipsManager;
