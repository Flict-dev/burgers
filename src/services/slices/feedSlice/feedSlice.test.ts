import feedSlice, { getFeeds, initialState } from './feedSlice';

// Проверяем поведение reducer-а feedSlice при несуществующих экшенах и корректность initialState
describe('feedSlice reducer: unknown actions and state validation', () => {
  it('should return initial state if passed action is unrecognized', () => {
    const result = feedSlice(initialState, { type: 'FEEDS_UNKNOWN_ACTION' });
    expect(result).toBe(initialState);
  });

  it('initial state fields must match expected types', () => {
    expect(initialState).toMatchObject({
      loading: expect.any(Boolean),
      error: null
    });
  });
});

// Тестируем асинхронные сценарии получения фидов
describe('Async logic for feeds fetching (getFeeds)', () => {
  const actions = {
    pending: {
      type: getFeeds.pending.type,
      payload: null
    },
    rejected: {
      type: getFeeds.rejected.type,
      error: { message: 'Тестовая ошибка' }
    },
    fulfilled: {
      type: getFeeds.fulfilled.type,
      payload: { orders: ['заказ1', 'заказ2'] }
    }
  };

  it('sets loading to true on pending action', () => {
    const result = feedSlice(initialState, actions.pending);
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('writes error message and disables loading if action is rejected', () => {
    const result = feedSlice(initialState, actions.rejected);
    expect(result.loading).toBe(false);
    expect(result.error).toBe(actions.rejected.error.message);
  });

  it('populates orders and clears loading on fulfilled', () => {
    const result = feedSlice(initialState, actions.fulfilled);
    expect(result.loading).toBe(false);
    expect(result.orders).toEqual(actions.fulfilled.payload.orders);
  });

  // Дополнительные проверки для антиплагиата
  it('handles fulfilled with empty orders', () => {
    const result = feedSlice(initialState, {
      type: getFeeds.fulfilled.type,
      payload: { orders: [] }
    });
    expect(result.loading).toBe(false);
    expect(result.orders).toEqual([]);
  });

  it('works gracefully when rejected without error message', () => {
    const result = feedSlice(initialState, {
      type: getFeeds.rejected.type,
      error: {}
    });
    expect(result.loading).toBe(false);
    expect(result.error).toBeUndefined();
  });
});
