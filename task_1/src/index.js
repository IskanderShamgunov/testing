/* eslint-disable func-names */
import cardValidator from 'card-validator';
import Inputmask from 'inputmask';
import { el, mount, setAttr, unmount } from 'redom';
import {
  emailSection,
  numberSection,
  dateSection,
  codeSection,
  cardLogoEl,
  buttonEl,
} from './layout';
import { createLayout } from './create-layout';
import MastercardLogo from './assets/images/mastercard-logo.svg';
import MirLogo from './assets/images/mir-logo.svg';
import VisaLogo from './assets/images/visa-logo.svg';

mount(document.body, createLayout());

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const cardLogoImg = el('img');
let currentCard = null;
const validInputs = {
  email: false,
  cardNumber: false,
  cardExpirationDate: false,
  cardCode: false,
};
const images = {
  mastercard: MastercardLogo,
  mir: MirLogo,
  visa: VisaLogo,
};

// eslint-disable-next-line no-useless-escape
Inputmask('A{1,}@B{1,}.C{2,4}', {
  placeholder: ' ',
  definitions: {
    A: {
      validator: '[a-zA-Z0-9._-]',
    },
    B: {
      validator: '[a-zA-Z0-9-]',
    },
    C: {
      validator: '[a-zA-Z]',
    },
  },
}).mask(emailSection.inputEl);
Inputmask('9999 9999 9999 9999', {
  placeholder: ' ',
  definitions: {
    9: {
      validator: '[0-9]',
    },
  },
}).mask(numberSection.inputEl);
Inputmask('99 / 99', {
  placeholder: ' ',
  definitions: {
    9: {
      validator: '[0-9]',
    },
  },
}).mask(dateSection.inputEl);
Inputmask('999', {
  placeholder: '*',
  definitions: {
    9: {
      validator: '[0-9]',
    },
  },
}).mask(codeSection.inputEl);

function getValueFromInput(input) {
  return input.inputmask
    ? input.inputmask.unmaskedvalue().trim()
    : input.value.trim();
}

function setCardCodeMask(card) {
  Inputmask('9'.repeat(card.code.size), {
    placeholder: '*',
    definitions: {
      9: {
        validator: '[0-9]',
      },
    },
  }).mask(codeSection.inputEl);
}

function refreshCurrentCard(card) {
  if (currentCard && card && currentCard.type === card.type) return;
  if (!(currentCard || card)) return;

  currentCard = card;

  if (!currentCard) {
    unmount(cardLogoEl, cardLogoImg);
    return;
  }

  switch (currentCard.type) {
    case 'mir':
    case 'visa':
    case 'mastercard': {
      setAttr(cardLogoImg, {
        src: images[currentCard.type],
        alt: `${currentCard.type} logo`,
      });
      cardLogoImg.addEventListener(
        'load',
        () => {
          mount(cardLogoEl, cardLogoImg);
        },
        { once: true },
      );
      break;
    }
    default:
      break;
  }
}

// eslint-disable-next-line consistent-return
function getErrorText(error) {
  switch (error.message) {
    case 'E-mail is invalid':
      return 'E-mail введен неверно';
    case 'Luhn algorithm mismatch':
      return 'Карты с таким номером не существует';
    case 'Card number is invalid':
      return 'Номер карты введен неверно или не полностью';
    case 'Expiration date is incomplete':
      return 'Дата заполнена не полностью';
    case 'Date value is invalid': {
      const currentMonth =
        new Date().getMonth() < 9
          ? `0${new Date().getMonth() + 1}`
          : new Date().getMonth() + 1;
      const currentYear = String(new Date().getFullYear()).slice(2);
      return `Дата не может быть раньше ${currentMonth} / ${currentYear} или позже ${currentMonth} / ${+currentYear + 20}`;
    }
    case 'Card code is incomplete':
      return 'Код введен не полностью';
    case 'Card code is invalid':
      return 'Код введен некорректно';
    default:
      break;
  }
}

function hundleValidationError(inputSection, error) {
  if (inputSection.inputEl.classList.contains('input--error')) return;

  const errorText = getErrorText(error);

  const errorEl = el('span.form__error', errorText);
  inputSection.inputEl.classList.add('input--error');
  mount(inputSection, errorEl);

  inputSection.inputEl.addEventListener(
    'input',
    () => {
      inputSection.inputEl.classList.remove('input--error');
      unmount(inputSection, errorEl);
    },
    { once: true },
  );
}

function checkValidInputs() {
  for (const input in validInputs) {
    if (!validInputs[input]) {
      buttonEl.disabled = true;
      return;
    }
  }
  buttonEl.disabled = false;
}

numberSection.inputEl.addEventListener('input', function () {
  const value = getValueFromInput(this);
  const data = cardValidator.number(value);
  const oldCard = currentCard;
  refreshCurrentCard(data.card);

  if (!data.card) return;
  if (oldCard && data.card.type === currentCard.type) return;

  const lengthMax = Math.max(...data.card.lengths);
  const gapsArray = data.card.gaps;
  let currentMask = '';

  for (let i = 0; i <= gapsArray.length; i++) {
    switch (i) {
      case 0:
        currentMask = `${currentMask + '9'.repeat(gapsArray[i])} `;
        break;
      case gapsArray.length:
        currentMask += '9'.repeat(lengthMax - gapsArray[i - 1]);
        break;
      default:
        currentMask = `${currentMask + '9'.repeat(gapsArray[i] - gapsArray[i - 1])} `;
    }
  }

  Inputmask(currentMask, {
    placeholder: ' ',
    definitions: {
      9: {
        validator: '[0-9]',
      },
    },
  }).mask(numberSection.inputEl);
});

function validateEmailInput(value) {
  try {
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}$/.test(value))
      throw new ValidationError('E-mail is invalid');
    validInputs.email = true;
    checkValidInputs();
  } catch (error) {
    validInputs.email = false;
    checkValidInputs();
    if (!(error instanceof ValidationError)) throw error;
    hundleValidationError(emailSection, error);
  }
}

emailSection.inputEl.addEventListener('blur', function () {
  const value = getValueFromInput(this);
  if (!value) return;
  validateEmailInput(this.value);
});

function validateNumberInput(value) {
  try {
    const data = cardValidator.number(value);
    if (data.card) setCardCodeMask(data.card);
    if (!data.isPotentiallyValid)
      throw new ValidationError('Luhn algorithm mismatch');
    if (!data.isValid) throw new ValidationError('Card number is invalid');
    validInputs.cardNumber = true;
    checkValidInputs();
  } catch (error) {
    validInputs.cardNumber = false;
    checkValidInputs();
    if (!(error instanceof ValidationError)) throw error;
    hundleValidationError(numberSection, error);
  }
}

numberSection.inputEl.addEventListener('blur', function () {
  const value = getValueFromInput(this);
  if (!value) return;
  validateNumberInput(value);
});

function validateDateInput(value) {
  try {
    if (value.length < 4)
      throw new ValidationError('Expiration date is incomplete');
    const data = cardValidator.expirationDate(value);
    if (!data.isValid) throw new ValidationError('Date value is invalid');
    validInputs.cardExpirationDate = true;
    checkValidInputs();
  } catch (error) {
    validInputs.cardExpirationDate = false;
    checkValidInputs();
    if (!(error instanceof ValidationError)) throw error;
    hundleValidationError(dateSection, error);
  }
}

dateSection.inputEl.addEventListener('blur', function () {
  const value = getValueFromInput(this);
  if (!value) return;
  validateDateInput(value);
});

function validateCodeInput(value) {
  try {
    if (value.length !== 3)
      throw new ValidationError('Card code is incomplete');
    if (!/\d{3}/g.test(value))
      throw new ValidationError('Card code is invalid');
    validInputs.cardCode = true;
    checkValidInputs();
  } catch (error) {
    validInputs.cardCode = false;
    checkValidInputs();
    if (!(error instanceof ValidationError)) throw error;
    hundleValidationError(codeSection, error);
  }
}

codeSection.inputEl.addEventListener('blur', function () {
  const value = getValueFromInput(this);
  if (!value) return;
  validateCodeInput(value);
});

export { validateNumberInput, validateCodeInput, validInputs };
