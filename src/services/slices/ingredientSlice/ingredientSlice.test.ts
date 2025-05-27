import ingredientSlice, {
  getIngredients,
  initialState
} from './ingredientSlice';

describe('проверка редьюсера ingredientSlice', () => {
  describe('проверка асинхронного GET запроса getIngredients', () => {
    const testData = {
      pending: {
        type: getIngredients.pending.type,
        payload: null
      },
      rejected: {
        type: getIngredients.rejected.type,
        error: { message: 'Тестовая ошибка' }
      },
      fulfilled: {
        type: getIngredients.fulfilled.type,
        payload: ['ингредиент1', 'ингредиент2']
      }
    };

    test('проверка состояния pending в getIngredients', () => {
      const result = ingredientSlice(initialState, testData.pending);
      expect(result.loading).toBe(true);
      expect(result.error).toBe(testData.pending.payload);
    });

    test('проверка состояния rejected в getIngredients', () => {
      const result = ingredientSlice(initialState, testData.rejected);
      expect(result.loading).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });

    test('проверка состояния fulfilled в getIngredients', () => {
      const result = ingredientSlice(initialState, testData.fulfilled);
      expect(result.loading).toBe(false);
      expect(result.ingredients).toEqual(testData.fulfilled.payload);
    });
  });
});
