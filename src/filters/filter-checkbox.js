/**
 * FilterCheckboxManager: Main class responsible for managing checkbox-based filtering functionality
 *
 * This class handles:
 * 1. State Management: Tracks checkbox states and filter variables
 * 2. UI Management: Handles checkbox visual updates
 * 3. Event Handling: Manages click events and request completions
 * 4. Wized Integration: Coordinates with Wized for data and requests
 * 5. Chips Integration: Coordinates with FilterChipsManager for visual feedback
 */
export class FilterCheckboxManager {
  constructor(Wized) {
    this.Wized = Wized;

    // Internal state
    this.state = {
      monitoredGroups: new Set(), // Tracks which checkbox groups are being monitored
      checkboxGroups: null, // Stores organized checkbox group data
    };

    // Bind methods to maintain context
    this.setupFilterMonitoring = this.setupFilterMonitoring.bind(this);
    this.handleRequestEnd = this.handleRequestEnd.bind(this);
    this.uncheckAllFilterCheckboxes =
      this.uncheckAllFilterCheckboxes.bind(this);

    // Initialize the manager
    this.initialize();
  }

  // =============================================
  // INITIALIZATION AND SETUP
  // =============================================

  /**
   * Initializes the manager and sets up event listeners
   */
  initialize() {
    // Make uncheck function globally available
    window.uncheckAllFilterCheckboxes = this.uncheckAllFilterCheckboxes;

    // Set up request monitoring
    this.Wized.on("requestend", this.handleRequestEnd);
  }

  // =============================================
  // UI HELPERS AND DOM MANIPULATION
  // =============================================

  /**
   * Gets the checkbox label text
   * @param {HTMLElement} checkbox - The checkbox element
   * @returns {string} The label text or empty string
   */
  getCheckboxLabel(checkbox) {
    return (
      checkbox.querySelector("[w-filter-checkbox-label]")?.textContent || ""
    );
  }

  /**
   * Updates checkbox visual state
   * @param {HTMLElement} checkbox - The checkbox element
   * @param {boolean} checked - Whether to check or uncheck
   */
  updateCheckboxVisualState(checkbox, checked) {
    const customCheckbox = checkbox.querySelector(
      ".w-checkbox-input--inputType-custom"
    );
    if (customCheckbox) {
      if (checked) {
        customCheckbox.classList.add("w--redirected-checked");
      } else {
        customCheckbox.classList.remove("w--redirected-checked");
      }
    }
  }

  // =============================================
  // CHIPS INTEGRATION
  // =============================================

  /**
   * Creates a chip for a checked checkbox if chips functionality is available
   * @param {HTMLElement} checkbox - The checkbox element
   * @param {string} category - The filter category
   */
  createCheckboxChip(checkbox, category) {
    // Skip if chips functionality is not available
    if (!window.filterChips) return;

    const label = this.getCheckboxLabel(checkbox);
    if (!label) return;

    // Store variable information for callbacks
    const variableName = checkbox.getAttribute("w-filter-checkbox-variable");
    const paginationVariable = checkbox.getAttribute(
      "w-filter-pagination-current-variable"
    );
    const filterRequest = checkbox.getAttribute("w-filter-request");

    // Create the chip with necessary callbacks
    const chip = window.filterChips.create({
      label: `${
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
      }: ${label}`,
      filterType: "checkbox",
      category,
      value: label,
      sourceElement: checkbox,
      onSourceUpdate: () => {
        // Uncheck the checkbox
        this.updateCheckboxVisualState(checkbox, false);

        // Update Wized variable and execute request
        this.updateWizedVariable(
          this.getCheckboxGroup(checkbox),
          variableName,
          paginationVariable,
          filterRequest
        );
      },
    });

    // Only try to add chip if it was created successfully
    if (chip && window.filterChips.addToContainer) {
      window.filterChips.addToContainer(chip);
    }
  }

  /**
   * Gets all checkboxes in the same group
   * @param {HTMLElement} checkbox - A checkbox from the group
   * @returns {Array<HTMLElement>} Array of checkboxes in the group
   */
  getCheckboxGroup(checkbox) {
    const variableName = checkbox.getAttribute("w-filter-checkbox-variable");
    return Array.from(
      document.querySelectorAll(
        `[w-filter-checkbox-variable="${variableName}"]`
      )
    );
  }

  // =============================================
  // STATE MANAGEMENT AND WIZED INTEGRATION
  // =============================================

  /**
   * Updates Wized variables and triggers filter requests
   */
  async updateWizedVariable(
    checkboxes,
    variableName,
    paginationVariable,
    filterRequest,
    forceEmpty = false,
    isReset = false
  ) {
    // Calculate checked values
    const checkedValues = forceEmpty
      ? []
      : Array.from(checkboxes)
          .filter((checkbox) =>
            checkbox.querySelector(
              ".w-checkbox-input--inputType-custom.w--redirected-checked"
            )
          )
          .map(this.getCheckboxLabel);

    // Update Wized variable
    this.Wized.data.v[variableName] = checkedValues;

    // Determine if updates needed
    const shouldTriggerUpdates =
      isReset ||
      checkedValues.length > 0 ||
      (!forceEmpty && checkedValues.length === 0);

    if (shouldTriggerUpdates) {
      // Reset pagination if needed
      if (paginationVariable) {
        this.Wized.data.v[paginationVariable] = 1;
      }

      // Execute filter request if provided
      if (filterRequest) {
        try {
          await this.Wized.requests.execute(filterRequest);
        } catch (error) {
          console.error(`Error executing filter request: ${error}`);
        }
      }
    }
  }

  // =============================================
  // RESET FUNCTIONALITY
  // =============================================

  /**
   * Sets up reset button functionality for a checkbox group
   */
  setupResetButton(group) {
    const { elements: checkboxes } = group;
    if (checkboxes.length === 0) return;

    const firstCheckbox = checkboxes[0];
    const category = firstCheckbox.getAttribute("w-filter-checkbox-category");
    const filterRequest = firstCheckbox.getAttribute("w-filter-request");

    if (!category || !filterRequest) return;

    const resetButton = document.querySelector(
      `[w-filter-checkbox-reset="${category}"]`
    );

    if (!resetButton) return;

    resetButton.addEventListener("click", async (e) => {
      e.preventDefault();

      const hasCheckedBoxes = Array.from(checkboxes).some((checkbox) =>
        checkbox.querySelector(
          ".w-checkbox-input--inputType-custom.w--redirected-checked"
        )
      );

      const variableName = firstCheckbox.getAttribute(
        "w-filter-checkbox-variable"
      );
      const paginationVariable = firstCheckbox.getAttribute(
        "w-filter-pagination-current-variable"
      );

      // Clear chips for this category
      if (window.filterChips) {
        window.filterChips.clearCategory(category);
      }

      // Uncheck all checkboxes visually
      checkboxes.forEach((checkbox) => {
        this.updateCheckboxVisualState(checkbox, false);
      });

      await this.updateWizedVariable(
        checkboxes,
        variableName,
        paginationVariable,
        filterRequest,
        true,
        hasCheckedBoxes
      );
    });
  }

  // =============================================
  // FILTER GROUP MANAGEMENT
  // =============================================

  /**
   * Sets up and configures checkbox groups
   */
  setupFilterMonitoring() {
    const filterWrapper = document.querySelector("[w-filter-wrapper]");
    if (!filterWrapper) return null;

    const checkboxes = filterWrapper.querySelectorAll(
      "label[wized][w-filter-checkbox-variable]"
    );

    if (checkboxes.length > 0) {
      return Array.from(checkboxes).reduce((groups, checkbox) => {
        const wizedValue = checkbox.getAttribute("wized");
        const variableName = checkbox.getAttribute(
          "w-filter-checkbox-variable"
        );
        const paginationVariable = checkbox.getAttribute(
          "w-filter-pagination-current-variable"
        );
        const filterRequest = checkbox.getAttribute("w-filter-request");
        const requestName = checkbox.getAttribute("w-filter-checkbox-request");

        if (!groups[wizedValue]) {
          groups[wizedValue] = {
            wizedName: wizedValue,
            requestName,
            variableName,
            paginationVariable,
            filterRequest,
            elements: [],
            isStatic: !requestName,
          };
        }
        groups[wizedValue].elements.push(checkbox);
        return groups;
      }, {});
    }
    return null;
  }

  // =============================================
  // EVENT HANDLING
  // =============================================

  /**
   * Handles checkbox click events
   */
  handleCheckboxClick(
    checkbox,
    elements,
    variableName,
    paginationVariable,
    filterRequest
  ) {
    setTimeout(() => {
      const category = checkbox.getAttribute("w-filter-checkbox-category");
      const label = this.getCheckboxLabel(checkbox);
      const isChecked = checkbox.querySelector(
        ".w-checkbox-input--inputType-custom.w--redirected-checked"
      );

      // Handle chips if the chips manager is available and initialized
      if (window.filterChips && window.filterChipsReady) {
        if (isChecked) {
          // Check if chip already exists before trying to create it
          if (
            !window.filterChips.exists ||
            !window.filterChips.exists(category, label)
          ) {
            this.createCheckboxChip(checkbox, category);
          }
        } else if (window.filterChips.removeByValue) {
          window.filterChips.removeByValue(category, label);
        }
      }

      this.updateWizedVariable(
        elements,
        variableName,
        paginationVariable,
        filterRequest
      );
    }, 50);
  }

  /**
   * Sets up event handlers for a checkbox group
   */
  setupGroupEventHandlers(group) {
    const {
      wizedName,
      requestName,
      variableName,
      paginationVariable,
      filterRequest,
      elements,
      isStatic,
    } = group;

    const groupKey = `${wizedName}-${variableName}`;

    if (!this.state.monitoredGroups.has(groupKey)) {
      this.state.monitoredGroups.add(groupKey);

      if (!this.Wized.data.v[variableName]) {
        this.Wized.data.v[variableName] = [];
      }

      this.setupResetButton(group);

      elements.forEach((checkbox) => {
        checkbox.addEventListener("click", () => {
          this.handleCheckboxClick(
            checkbox,
            elements,
            variableName,
            paginationVariable,
            filterRequest
          );
        });
      });

      if (!isStatic && requestName) {
        this.Wized.on("requestend", (filterResult) => {
          if (
            filterResult.id === requestName ||
            filterResult.name === requestName
          ) {
            // Dynamic filter request completed
          }
        });
      }
    }
  }

  /**
   * Handles request completion events
   */
  handleRequestEnd(result) {
    const checkboxGroups = this.setupFilterMonitoring();

    if (checkboxGroups) {
      Object.values(checkboxGroups).forEach((group) => {
        this.setupGroupEventHandlers(group);
      });
    }
  }

  // =============================================
  // PUBLIC API
  // =============================================

  /**
   * Unchecks all filter checkboxes and resets their variables
   */
  async uncheckAllFilterCheckboxes() {
    const filterWrapper = document.querySelector("[w-filter-wrapper]");
    if (!filterWrapper) return;

    const checkboxes = filterWrapper.querySelectorAll(
      "label[wized][w-filter-checkbox-variable]"
    );

    if (checkboxes.length === 0) return;

    // Clear all chips if chips manager is available and initialized
    if (
      window.filterChips &&
      window.filterChipsReady &&
      window.filterChips.clearAll
    ) {
      window.filterChips.clearAll();
    }

    const groupedByVariable = Array.from(checkboxes).reduce(
      (groups, checkbox) => {
        const variableName = checkbox.getAttribute(
          "w-filter-checkbox-variable"
        );
        if (!groups[variableName]) {
          groups[variableName] = [];
        }
        groups[variableName].push(checkbox);
        return groups;
      },
      {}
    );

    for (const [variableName, checkboxGroup] of Object.entries(
      groupedByVariable
    )) {
      checkboxGroup.forEach((checkbox) => {
        this.updateCheckboxVisualState(checkbox, false);
      });

      this.Wized.data.v[variableName] = [];
    }
  }
}
