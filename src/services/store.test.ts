import store, { rootReducer } from '../services/store';

test('проверяем корректность rootReducer', () => {
  const result = rootReducer(undefined, { type: 'TEST_ACTION' });
  expect(result).toEqual(store.getState());
});
