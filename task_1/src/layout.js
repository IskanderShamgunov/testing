import { el, mount } from 'redom';
// eslint-disable-next-line no-unused-vars
import styles from './css/style.css';

class InputSection {
  constructor(title, className, dataName, placeholder) {
    this.titleEl = el('span.form__label-text', title);
    this.inputEl = el(`input.form__${className}-input.form__input`, {
      name: dataName,
      placeholder: placeholder || title,
      required: true,
    });
    this.el = el(`label.form__${className}.form__label`);
    mount(this.el, this.titleEl);
    mount(this.el, this.inputEl);
  }
}

const emailSection = new InputSection('E-mail', 'email', 'email');
const numberSection = new InputSection('Номер карты', 'number', 'cardNumber');
const dateSection = new InputSection(
  'Срок действия',
  'date',
  'cardExpirationDate',
  'ММ/ГГ',
);
const codeSection = new InputSection('CVC/CVV', 'code', 'cardCode');

const cardLogoEl = el('div.form__card-logo');
const buttonEl = el('button.form__btn', 'Оплатить', { disabled: true });

export {
  emailSection,
  numberSection,
  dateSection,
  codeSection,
  cardLogoEl,
  buttonEl,
};
