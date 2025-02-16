import { FilterCheckboxManager } from '../../filters/filter-checkbox.js';
import mockWized from '../../__mocks__/wized.js';

describe('FilterCheckboxManager', () => {
  let manager;
  let mockElement;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div w-filter-wrapper>
        <label wized="CHECKBOX1" w-filter-checkbox-variable="category" w-filter-checkbox-category="Category" w-filter-request="filterRequest">
          <div class="w-checkbox-input--inputType-custom"></div>
          <span w-filter-checkbox-label>Option 1</span>
        </label>
      </div>
    `;

    mockElement = document.querySelector('label[wized]');
    manager = new FilterCheckboxManager(mockWized);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('initializes with correct state', () => {
    expect(manager.state.monitoredGroups).toBeDefined();
    expect(manager.state.checkboxGroups).toBeNull();
  });

  test('sets up event listeners on initialization', () => {
    expect(mockWized.on).toHaveBeenCalledWith('requestend', expect.any(Function));
  });
});
