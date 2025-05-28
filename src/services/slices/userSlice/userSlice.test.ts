import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './userSlice';

// sanity-check для initialState
describe('userSlice reducer: initial and unknown actions', () => {
  it('should return the initial state on unknown action', () => {
    const result = userSlice(initialState, { type: 'USER_UNKNOWN_ACTION' });
    expect(result).toBe(initialState);
  });
  it('initialState fields should be defined', () => {
    expect(initialState).toMatchObject({
      request: expect.any(Boolean),
    });
  });
});

describe('Async logic tests for userSlice', () => {
  describe('getUser async thunk cases', () => {
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

    it('handles getUser.pending', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.pending.payload);
    });

    it('handles getUser.rejected', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.payload);
    });

    it('handles getUser.fulfilled', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.request).toBe(false);
      expect(result.userData).toEqual(testData.fulfilled.payload.user);
      // make sure error cleared
      expect(result.error).toBeNull ? expect(result.error).toBeNull() : null;
    });
  });

  describe('getOrdersAll async thunk', () => {
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

    it('getOrdersAll pending state', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(true);
      expect(result.error).toBe(testData.pending.payload);
    });


    it('getOrdersAll fulfilled state', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.request).toBe(false);
      expect(result.userOrders).toEqual(testData.fulfilled.payload);
    });
  });

  describe('registerUser async thunk', () => {
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

    it('registerUser sets request true on pending', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(true);
      expect(result.error).toBe(null);
    });

    it('registerUser sets error on rejected', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });

    it('registerUser updates userData on fulfilled', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.request).toBe(false);
      expect(result.error).toBe(null);
      expect(result.userData).toBe(testData.fulfilled.payload.user);
    });
  });

  describe('loginUser async thunk', () => {
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

    it('loginUser sets loginUserRequest true on pending', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.loginUserRequest).toBe(true);
      expect(result.isAuthChecked).toBe(true);
      expect(result.isAuthenticated).toBe(false);
      expect(result.error).toBe(testData.pending.payload);
    });
    it('loginUser handles rejected', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.isAuthChecked).toBe(false);
      expect(result.isAuthenticated).toBe(false);
      expect(result.loginUserRequest).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });
    it('loginUser handles fulfilled', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.isAuthChecked).toBe(false);
      expect(result.isAuthenticated).toBe(true);
      expect(result.loginUserRequest).toBe(false);
      expect(result.error).toBe(null);
      expect(result.userData).toBe(testData.fulfilled.payload.user);
    });
  });

  describe('updateUser async thunk', () => {
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

    it('updateUser sets request true on pending', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(true);
      expect(result.error).toBe(null);
    });
    it('updateUser handles rejected', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });
    it('updateUser sets response on fulfilled', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.request).toBe(false);
      expect(result.error).toBe(null);
      expect(result.response).toBe(testData.fulfilled.payload.user);
    });
  });

  describe('logoutUser async thunk', () => {
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

    it('logoutUser pending updates relevant flags', () => {
      const result = userSlice(initialState, testData.pending);
      expect(result.request).toBe(true);
      expect(result.isAuthChecked).toBe(true);
      expect(result.isAuthenticated).toBe(true);
      expect(result.error).toBe(null);
    });
    it('logoutUser rejected keeps authenticated', () => {
      const result = userSlice(initialState, testData.rejected);
      expect(result.isAuthChecked).toBe(false);
      expect(result.isAuthenticated).toBe(true);
      expect(result.request).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });
    it('logoutUser fulfilled resets auth state and userData', () => {
      const result = userSlice(initialState, testData.fulfilled);
      expect(result.isAuthChecked).toBe(false);
      expect(result.isAuthenticated).toBe(false);
      expect(result.request).toBe(false);
      expect(result.error).toBe(null);
      expect(result.userData).toBe(testData.fulfilled.payload);
    });
  });
});
