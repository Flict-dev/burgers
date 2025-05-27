import constructorSlice, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient
} from './constructorSlice';
import { expect, test, describe } from '@jest/globals';

describe('проверка редьюсера constructorSlice', () => {
  describe('проверка действия addIngredient', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: []
      },
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    };
    const expectedResult = {
      ...initialState,
      constructorItems: {
        bun: {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Булка для теста N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        },
        ingredients: [
          {
            _id: '643d69a5c3f7b9001cfa0943',
            name: 'Тестовый соус',
            type: 'sauce',
            proteins: 50,
            fat: 22,
            carbohydrates: 11,
            calories: 14,
            price: 80,
            image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/sauce-04-large.png'
          }
        ]
      }
    };

    test('проверка добавления ингредиента в список', () => {
      const result = constructorSlice(
        initialState,
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-04-large.png'
        })
      );

      const ingredient = result.constructorItems.ingredients[0];
      const expectedIngredient = expectedResult.constructorItems.ingredients[0];

      expect(ingredient).toEqual({
        ...expectedIngredient,
        id: expect.any(String)
      });
    });

    test('проверка добавления булки в пустое поле', () => {
      const result = constructorSlice(
        initialState,
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        })
      );

      const bun = result.constructorItems.bun;
      const expectedBun = expectedResult.constructorItems.bun;

      expect(bun).toEqual({
        ...expectedBun,
        id: expect.any(String)
      });
    });

    test('проверка замены существующей булки', () => {
      const initialStateWithBun = {
        constructorItems: {
          bun: {
            _id: '643d69a5c3f7b9001cfa093c',
            name: 'Булка для теста N-200i',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            id: 'тестовый-id',
            price: 1255,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/bun-02-large.png'
          },
          ingredients: []
        },
        loading: false,
        orderRequest: false,
        orderModalData: null,
        error: null
      };
      const expectedResultForBuns = {
        ...initialStateWithBun,
        constructorItems: {
          bun: {
            _id: '643d69a5c3f7b9001cfa093d',
            name: 'Тестовая булка R2-D3',
            type: 'bun',
            proteins: 44,
            fat: 26,
            carbohydrates: 85,
            calories: 643,
            price: 988,
            image: 'https://code.s3.yandex.net/react/code/bun-01.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/bun-01-large.png'
          },
          ingredients: []
        }
      };
      const result = constructorSlice(
        initialStateWithBun,
        addIngredient({
          _id: '643d69a5c3f7b9001cfa093d',
          name: 'Тестовая булка R2-D3',
          type: 'bun',
          proteins: 44,
          fat: 26,
          carbohydrates: 85,
          calories: 643,
          price: 988,
          image: 'https://code.s3.yandex.net/react/code/bun-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
        })
      );

      const bun = result.constructorItems.bun;
      const expectedBun = expectedResultForBuns.constructorItems.bun;

      expect(bun).toEqual({
        ...expectedBun,
        id: expect.any(String)
      });
    });
  });

  describe('проверка действия removeIngredient', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: [
          {
            id: 'тест-id',
            _id: '643d69a5c3f7b9001cfa0944',
            name: 'Тестовый соус',
            type: 'sauce',
            proteins: 42,
            fat: 24,
            carbohydrates: 42,
            calories: 99,
            price: 15,
            image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/sauce-03-large.png'
          }
        ]
      },
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    };
    const expectedResult = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: []
      }
    };

    test('проверка удаления ингредиента', () => {
      const result = constructorSlice(
        initialState,
        removeIngredient('тест-id')
      );

      const received = result.constructorItems.ingredients;
      const expected = expectedResult.constructorItems.ingredients;

      expect(expected).toEqual(received);
    });
  });

  describe('проверка действий перемещения: moveIngredientUp и moveIngredientDown', () => {
    const initialState = {
      constructorItems: {
        bun: {
          id: 'тест-булка',
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Тестовая булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/bun-02-large.png'
        },
        ingredients: [
          {
            id: 'тест-1',
            _id: '643d69a5c3f7b9001cfa0943',
            name: 'Тестовый соус 1',
            type: 'sauce',
            proteins: 50,
            fat: 22,
            carbohydrates: 11,
            calories: 14,
            price: 80,
            image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/sauce-04-large.png'
          },
          {
            id: 'тест-2',
            _id: '643d69a5c3f7b9001cfa0944',
            name: 'Тестовый соус 2',
            type: 'sauce',
            proteins: 42,
            fat: 24,
            carbohydrates: 42,
            calories: 99,
            price: 15,
            image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/sauce-03-large.png'
          }
        ]
      },
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    test('проверка перемещения ингредиента вверх', () => {
      const result = constructorSlice(initialState, moveIngredientUp(1));
      expect(result.constructorItems.ingredients[0].id).toBe('тест-2');
      expect(result.constructorItems.ingredients[1].id).toBe('тест-1');
    });

    test('проверка перемещения ингредиента вниз', () => {
      const result = constructorSlice(initialState, moveIngredientDown(0));
      expect(result.constructorItems.ingredients[0].id).toBe('тест-2');
      expect(result.constructorItems.ingredients[1].id).toBe('тест-1');
    });
  });

  describe('проверка асинхронного POST запроса orderBurger', () => {
    const testData = {
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

    test('проверка состояния pending в orderBurger', () => {
      const result = constructorSlice(initialState, testData.pending);
      expect(result.orderRequest).toBe(true);
      expect(result.error).toBe(testData.pending.payload);
    });

    test('проверка состояния rejected в orderBurger', () => {
      const result = constructorSlice(initialState, testData.rejected);
      expect(result.orderRequest).toBe(false);
      expect(result.error).toBe(testData.rejected.error.message);
    });

    test('проверка состояния fulfilled в orderBurger', () => {
      const result = constructorSlice(initialState, testData.fulfilled);
      expect(result.orderRequest).toBe(false);
      expect(result.error).toBe(null);
      expect(result.orderModalData).toEqual({ number: 12345 });
    });
  });
});
