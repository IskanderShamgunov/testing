/**
 * @jest-environment jsdom
 */

import { validateCodeInput, validInputs } from '../src/index';

// Функция-валидатор меняет значение validInputs.cardCode
// для CVC/CVV кода на true при валидном значении
// и на false при невалидном

test.each(['534', '917', '627', '762', '475', '293'])(
  'Строки из 3-х цифр проходят валидацию',
  (code) => {
    validateCodeInput(code);
    expect(validInputs.cardCode).toBe(true);
  },
);

test.each(['54', '7', '27', '2', '5', '93'])(
  'Строки из 2-х и менее цифр не проходят валидацию',
  (code) => {
    validateCodeInput(code);
    expect(validInputs.cardCode).toBe(false);
  },
);

test.each(['2352', '2317', '682232', '12328', '5232232', '92321453'])(
  'Строки из 4-х и более цифр не проходят валидацию',
  (code) => {
    validateCodeInput(code);
    expect(validInputs.cardCode).toBe(false);
  },
);

test.each(['23s', 'sda', '$цн', './&', 'sa2', 'вав'])(
  'Строки с нецифровыми симолвами не проходят валидацию',
  (code) => {
    validateCodeInput(code);
    expect(validInputs.cardCode).toBe(false);
  },
);
