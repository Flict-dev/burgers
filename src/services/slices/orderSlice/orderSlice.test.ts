import orderSlice, { initialState, getOrderByNumber } from './orderSlice';

describe('проверка редьюсера orderSlice', () => {
  describe('проверка асинхронного POST запроса getOrderByNumber', () => {
    const testData = {
      pending: {
        type: getOrderByNumber.pending.type,
        payload: null
      },
      rejected: {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Тестовая ошибка' }
      },
      fulfilled: {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: ['тестовыйЗаказ'] }
      }
    };

    test('проверка состояния pending в getOrderByNumber', () => {
      const result = orderSlice(initialState, testData.pending);
      expect(result.request).toBe(true);
      expect(result.error).toBe(testData.pending.payload);
    });
    test('проверка состояния rejected в getOrderByNumber', () => {
      const result = orderSlice(initialState, testData.rejected);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });
    test('проверка состояния fulfilled в getOrderByNumber', () => {
      const result = orderSlice(initialState, testData.fulfilled);
      expect(result.request).toBe(false);
      expect(result.error).toBe(null);
      expect(result.orderByNumberResponse).toBe(
        testData.fulfilled.payload.orders[0]
      );
    });
  });
});
