import store, { rootReducer } from '../services/store';

/**
 * Unit tests for the rootReducer.
 * Checks for correctness of the default state and other edge cases.
 */
describe('rootReducer unit test suite', () => {
  /**
   * Test that rootReducer returns the initial state
   * when called with an unknown action and undefined previous state.
   */
  test('returns initial state when called with unknown action', () => {
    // "undefined" as previous state should use the reducer's initial value
    const result = rootReducer(undefined, { type: 'TEST_ACTION' });

    // The root reducer initial state should match the store state at initialization
    expect(result).toEqual(store.getState());
  });

  /**
   * Test that rootReducer handles actions that do not match any handler.
   * The state should remain unchanged in this case.
   */
  test('should return the same state for unregistered actions', () => {
    const initialState = store.getState();
    const result = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(result).toBe(initialState);
  });

  /**
   * Test that rootReducer does not mutate the provided previous state.
   * It must always return a new or the same reference as needed,
   * but not modify the input object itself (immutability).
   */
  test('does not mutate previous state object', () => {
    const previousState = store.getState();
    const result = rootReducer(previousState, { type: 'SOME_FAKE_ACTION' });
    // Ensure state was not accidentally mutated
    expect(result).toBe(previousState);
  });

});
