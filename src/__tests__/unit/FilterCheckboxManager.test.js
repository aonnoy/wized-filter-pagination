/* global describe, beforeEach, afterEach, test, expect, jest */

import FilterCheckboxManager from '../../filters/filter-checkbox';
import Wized from '../../__mocks__/wized';

describe('FilterCheckboxManager', () => {
  let manager;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset the DOM mocks
    jest.spyOn(document, 'querySelector').mockImplementation(() => null);
    jest.spyOn(document, 'querySelectorAll').mockImplementation(() => []);

    // Create a new instance of the manager
    manager = new FilterCheckboxManager(Wized);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should initialize with Wized instance', () => {
    expect(manager).toBeDefined();
    expect(manager.Wized).toBe(Wized);
  });

  test('should set up event listeners on initialization', () => {
    expect(Wized.on).toHaveBeenCalledWith('requestend', expect.any(Function));
  });
});
