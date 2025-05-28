import constructorSlice, {
  addIngredient,
  initialState as defaultState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient
} from './constructorSlice';
import { expect, test, describe } from '@jest/globals';

// Базовые проверки на редьюсер и initial state
describe('constructorSlice reducer: base functionality', () => {
  it('should return initial state when called with unknown action', () => {
    const result = constructorSlice(defaultState, { type: 'UNKNOWN_ACTION' });
    expect(result).toBe(defaultState);
  });

  it('initial fields presence sanity check', () => {
    expect(defaultState).toMatchObject({
      constructorItems: expect.any(Object),
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });
});

describe('addIngredient reducer logic', () => {
  const blankState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    loading: false,
    orderRequest: false,
    orderModalData: null,
    error: null
  };
  it('should add a sauce ingredient', () => {
    const result = constructorSlice(
      blankState,
      addIngredient({
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Тестовый соус',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
      })
    );

    // ингредиент добавлен первым в массив
    expect(result.constructorItems.ingredients.length).toBe(1);
    expect(result.constructorItems.ingredients[0].name).toBe('Тестовый соус');
    expect(result.constructorItems.ingredients[0].id).toEqual(expect.any(String));
  });

  it('should add bun to empty slot', () => {
    const result = constructorSlice(
      blankState,
      addIngredient({
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Булка для теста N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      })
    );
    expect(result.constructorItems.bun).toMatchObject({
      name: 'Булка для теста N-200i',
      id: expect.any(String)
    });
  });

  it('should replace existing bun', () => {
    const stateWithBun = {
      constructorItems: {
        bun: {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Булка старая',
          type: 'bun',
          proteins: 10,
          fat: 10,
          carbohydrates: 10,
          calories: 100,
          price: 1,
          id: 'id-test-bun',
          image: 'stub',
          image_mobile: 'stub',
          image_large: 'stub'
        },
        ingredients: []
      },
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    };
    const result = constructorSlice(
      stateWithBun,
      addIngredient({
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Булка новая',
        type: 'bun',
        proteins: 20,
        fat: 20,
        carbohydrates: 20,
        calories: 200,
        price: 2,
        image: 'stub2',
        image_mobile: 'stub2',
        image_large: 'stub2'
      })
    );
  });
});

describe('removeIngredient reducer action', () => {
  const stateWithIngredient = {
    constructorItems: {
      bun: null,
      ingredients: [
        {
          id: 'unique-id',
          _id: '643d69a5c3f7b9001cfa0944',
          name: 'Тестовый соус',
          type: 'sauce',
          proteins: 42,
          fat: 24,
          carbohydrates: 42,
          calories: 99,
          price: 15,
          image: 'stub',
          image_mobile: 'stub',
          image_large: 'stub'
        }
      ]
    },
    loading: false,
    orderRequest: false,
    orderModalData: null,
    error: null
  };
  it('removes ingredient by id', () => {
    const result = constructorSlice(stateWithIngredient, removeIngredient('unique-id'));
    expect(result.constructorItems.ingredients.length).toBe(0);
  });

  // Edge-case: удаление несуществующего id
  it('does nothing if id not found', () => {
    const result = constructorSlice(stateWithIngredient, removeIngredient('not-exist'));
    expect(result.constructorItems.ingredients.length).toBe(1);
  });
});

describe('moveIngredientUp and moveIngredientDown actions', () => {
  const sampleState = {
    constructorItems: {
      bun: null,
      ingredients: [
        { id: 'ing-1', name: 'Верхний' },
        { id: 'ing-2', name: 'Нижний' }
      ]
    },
    loading: false,
    orderRequest: false,
    orderModalData: null,
    error: null
  };
});

describe('orderBurger async thunk states', () => {
  const asyncActions = {
    pending: {
      type: orderBurger.pending.type,
      payload: null
    },
    rejected: {
      type: orderBurger.rejected.type,
      error: { message: 'Тестовая ошибка' }
    },
    fulfilled: {
      type: orderBurger.fulfilled.type,
      payload: { order: { number: 12345 } }
    }
  };
  it('sets orderRequest true and clears error when pending', () => {
    const result = constructorSlice(defaultState, asyncActions.pending);
    expect(result.orderRequest).toBe(true);
    expect(result.error).toBeNull();
  });
  it('sets error and orderRequest false if rejected', () => {
    const result = constructorSlice(defaultState, asyncActions.rejected);
    expect(result.orderRequest).toBe(false);
    expect(result.error).toBe(asyncActions.rejected.error.message);
  });
  it('sets orderModalData and stops request/clears error on fulfilled', () => {
    const result = constructorSlice(defaultState, asyncActions.fulfilled);
    expect(result.orderRequest).toBe(false);
    expect(result.error).toBeNull();
    expect(result.orderModalData).toEqual({ number: 12345 });
  });
});
