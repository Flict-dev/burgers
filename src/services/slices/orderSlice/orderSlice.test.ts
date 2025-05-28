import orderSlice, { initialState, getOrderByNumber } from './orderSlice';

// Проверка на случай неизвестного экшена
describe('orderSlice reducer: initial state and unknown actions', () => {
  it('should return the initial state if action is not recognized', () => {
    const unknownAction = { type: 'ORDER_UNKNOWN_ACTION' };
    const result = orderSlice(initialState, unknownAction);
    expect(result).toBe(initialState);
  });

  it('initialState snapshot sanity check', () => {
    expect(initialState).toMatchObject({
      request: expect.any(Boolean),
      error: null,
    });
  });
});

describe('Async order fetching (getOrderByNumber thunk)', () => {
  const actions = {
    pending: {
      type: getOrderByNumber.pending.type,
      payload: null,
    },
    rejected: {
      type: getOrderByNumber.rejected.type,
      error: { message: 'Тестовая ошибка' },
    },
    fulfilled: {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: ['тестовыйЗаказ'] },
    },
  };

  it('updates state correctly for pending getOrderByNumber', () => {
    const result = orderSlice(initialState, actions.pending);
    expect(result.request).toBe(true);
    expect(result.error).toBe(actions.pending.payload);
  });

  it('handles rejected state properly for getOrderByNumber', () => {
    const result = orderSlice(initialState, actions.rejected);
    expect(result.request).toBe(false);
    expect(result.error).toBe(actions.rejected.error.message);
  });

  it('saves order info and resets error for fulfilled getOrderByNumber', () => {
    const result = orderSlice(initialState, actions.fulfilled);
    expect(result.request).toBe(false);
    expect(result.error).toBe(null);
    expect(result.orderByNumberResponse).toBe(
      actions.fulfilled.payload.orders[0]
    );
  });

  // Дополнительная простая проверка на случай пустого массива заказов
  it('handles fulfilled with empty orders array', () => {
    const emptyPayload = {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: [] },
    };
    const result = orderSlice(initialState, emptyPayload);
    expect(result.orderByNumberResponse).toBeUndefined();
  });

  // Ещё одна дополнительная: если ошибка без сообщения
  it('handles rejected with missing error message gracefully', () => {
    const errorAction = {
      type: getOrderByNumber.rejected.type,
      error: {},
    };
    const result = orderSlice(initialState, errorAction);
    expect(result.error).toBeUndefined();
  });
});
