/**
 * @jest-environment jsdom
 */
import { createLayout } from '../src/create-layout';

test('Функция должна вернуть размету с 4 input-элементами с определенным значением placeholder', () => {
  const expectedPlaceholders = ['Номер карты', 'ММ/ГГ', 'CVC/CVV', 'E-mail'];
  const layout = createLayout();
  const inputs = layout.querySelectorAll('input');
  const inputsArray = Array.from(inputs);
  expect(inputs.length).toBe(4);
  expect(inputsArray.every((item) => item instanceof HTMLInputElement)).toBe(
    true,
  );
  expect(
    inputsArray.every((item) =>
      expectedPlaceholders.includes(item.placeholder),
    ),
  ).toBe(true);
});
