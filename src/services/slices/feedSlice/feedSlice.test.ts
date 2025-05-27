import feedSlice, { getFeeds, initialState } from './feedSlice';

describe('проверка редьюсера feedSlice', () => {
  describe('проверка асинхронного GET запроса getFeeds', () => {
    const testActions = {
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

    test('проверка состояния pending в getFeeds', () => {
      const result = feedSlice(initialState, testActions.pending);
      expect(result.loading).toBe(true);
      expect(result.error).toBe(testActions.pending.payload);
    });

    test('проверка состояния rejected в getFeeds', () => {
      const result = feedSlice(initialState, testActions.rejected);
      expect(result.loading).toBe(false);
      expect(result.error).toBe(testActions.rejected.error.message);
    });

    test('проверка состояния fulfilled в getFeeds', () => {
      const result = feedSlice(initialState, testActions.fulfilled);
      expect(result.loading).toBe(false);
      expect(result.orders).toEqual(testActions.fulfilled.payload.orders);
    });
  });
});
