/**
 * @jest-environment jsdom
 */

import { validateNumberInput, validInputs } from '../src/index';

// Функция-валидатор меняет значение validInputs.cardNumber
// для номера карты на true при валидном значении
// и на false при невалидном

test.each([
  '5346654422230348',
  '5346651020627917',
  '4329832716343621',
  '4188514906687062',
  '5552983744875475',
  '4438231558582693',
])('Валидные номера карты проходят валидацию', (number) => {
  validateNumberInput(number);
  expect(validInputs.cardNumber).toBe(true);
});

test.each(['sdfd879w33fd.ase', 'vooam%5f#fadoa', 'asd2af', '555#@ff4487547s'])(
  'Произвольные строки с недопустимыми символами не проходят валидацию',
  (number) => {
    validateNumberInput(number);
    expect(validInputs.cardNumber).toBe(false);
  },
);

test.each([
  '534665442223034',
  '53466510206279',
  '4329832716343',
  '41885149066',
  '5552983744',
  '44382315',
])('Неполные валидные номера карт не проходят валидацию', (number) => {
  validateNumberInput(number);
  expect(validInputs.cardNumber).toBe(false);
});

test.each([
  '7587585499944393526051',
  '47801056496183472975',
  '5852638041732199676574914',
  '23043703871118835740',
])(
  'Последовательности из 20+ цифр, соответствующие алгоритму Луна, не проходят валидацию',
  (number) => {
    validateNumberInput(number);
    expect(validInputs.cardNumber).toBe(false);
  },
);
