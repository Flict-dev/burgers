import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './userSlice';

describe('проверка редьюсера userSlice', () => {
  describe('проверка асинхронного GET запроса getUser', () => {
    const testData = {
      pending: {
        type: getUser.pending.type,
        payload: null
      },
      rejected: {
        type: getUser.rejected.type,
        payload: null
      },
      fulfilled: {
        type: getUser.fulfilled.type,
        payload: { user: { name: 'тестИмя', email: 'тестПочта' } }
      }
    };

    test('проверка состояния pending в getUser', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.pending.payload);
    });

    test('проверка состояния rejected в getUser', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.payload);
    });

    test('проверка состояния fulfilled в getUser', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.request).toBe(false);
      expect(result.userData).toEqual(testData.fulfilled.payload.user);
    });
  });
  describe('проверка асинхронного GET запроса getOrdersAll', () => {
    const testData = {
      pending: {
        type: getOrdersAll.pending.type,
        payload: null
      },
      rejected: {
        type: getOrdersAll.rejected.type,
        error: { message: 'Тестовая ошибка' }
      },
      fulfilled: {
        type: getOrdersAll.fulfilled.type,
        payload: ['заказ1', 'заказ2']
      }
    };

    test('проверка состояния pending в getOrdersAll', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(true);
      expect(result.error).toBe(testData.pending.payload);
    });

    test('проверка состояния rejected в getOrdersAll', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });

    test('проверка состояния fulfilled в getOrdersAll', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.request).toBe(false);
      expect(result.userOrders).toEqual(testData.fulfilled.payload);
    });
  });

  describe('проверка асинхронного POST запроса registerUser', () => {
    const testData = {
      pending: {
        type: registerUser.pending.type,
        payload: null
      },
      rejected: {
        type: registerUser.rejected.type,
        error: { message: 'Тестовая ошибка' }
      },
      fulfilled: {
        type: registerUser.fulfilled.type,
        payload: { user: { name: 'тестИмя', email: 'тестПочта' } }
      }
    };

    test('проверка состояния pending в registerUser', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(true);
      expect(result.error).toBe(testData.pending.payload);
    });
    test('проверка состояния rejected в registerUser', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });
    test('проверка состояния fulfilled в registerUser', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.request).toBe(false);
      expect(result.error).toBe(null);
      expect(result.userData).toBe(testData.fulfilled.payload.user);
    });
  });
  describe('проверка асинхронного POST запроса loginUser', () => {
    const testData = {
      pending: {
        type: loginUser.pending.type,
        payload: null
      },
      rejected: {
        type: loginUser.rejected.type,
        error: { message: 'Тестовая ошибка' }
      },
      fulfilled: {
        type: loginUser.fulfilled.type,
        payload: { user: { name: 'тестИмя', email: 'тестПочта' } }
      }
    };

    test('проверка состояния pending в loginUser', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.loginUserRequest).toBe(true);
      expect(result.isAuthChecked).toBe(true);
      expect(result.isAuthenticated).toBe(false);
      expect(result.error).toBe(testData.pending.payload);
    });
    test('проверка состояния rejected в loginUser', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.isAuthChecked).toBe(false);
      expect(result.isAuthenticated).toBe(false);
      expect(result.loginUserRequest).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });
    test('проверка состояния fulfilled в loginUser', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.isAuthChecked).toBe(false);
      expect(result.isAuthenticated).toBe(true);
      expect(result.loginUserRequest).toBe(false);
      expect(result.error).toBe(null);
      expect(result.userData).toBe(testData.fulfilled.payload.user);
    });
  });
  describe('проверка асинхронного PATCH запроса updateUser', () => {
    const testData = {
      pending: {
        type: updateUser.pending.type,
        payload: null
      },
      rejected: {
        type: updateUser.rejected.type,
        error: { message: 'Тестовая ошибка' }
      },
      fulfilled: {
        type: updateUser.fulfilled.type,
        payload: { user: { name: 'тестИмя', email: 'тестПочта' } }
      }
    };

    test('проверка состояния pending в updateUser', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(true);
      expect(result.error).toBe(testData.pending.payload);
    });
    test('проверка состояния rejected в updateUser', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });
    test('проверка состояния fulfilled в updateUser', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.request).toBe(false);
      expect(result.error).toBe(null);
      expect(result.response).toBe(testData.fulfilled.payload.user);
    });
  });
  describe('проверка асинхронного POST запроса logoutUser', () => {
    const testData = {
      pending: {
        type: logoutUser.pending.type,
        payload: null
      },
      rejected: {
        type: logoutUser.rejected.type,
        error: { message: 'Тестовая ошибка' }
      },
      fulfilled: {
        type: logoutUser.fulfilled.type,
        payload: null
      }
    };

    test('проверка состояния pending в logoutUser', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(true);
      expect(result.isAuthChecked).toBe(true);
      expect(result.isAuthenticated).toBe(true);
      expect(result.error).toBe(testData.pending.payload);
    });
    test('проверка состояния rejected в logoutUser', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.isAuthChecked).toBe(false);
      expect(result.isAuthenticated).toBe(true);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });
    test('проверка состояния fulfilled в logoutUser', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.isAuthChecked).toBe(false);
      expect(result.isAuthenticated).toBe(false);
      expect(result.request).toBe(false);
      expect(result.error).toBe(null);
      expect(result.userData).toBe(testData.fulfilled.payload);
    });
  });
});
