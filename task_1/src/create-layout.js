import { el, mount } from 'redom';
import {
  emailSection,
  numberSection,
  dateSection,
  codeSection,
  cardLogoEl,
  buttonEl,
} from './layout';

export function createLayout() {
  const formEl = el('form.form');
  const titleEl = el('p.form__title', 'Введите данные для оплаты');
  const numberWrapperEl = el('div.form__number-wrapper');
  const wrapperEl = el('div.form__wrapper');
  mount(numberWrapperEl, numberSection);
  mount(numberWrapperEl, cardLogoEl);
  mount(wrapperEl, dateSection);
  mount(wrapperEl, codeSection);
  mount(formEl, titleEl);
  mount(formEl, emailSection);
  mount(formEl, numberWrapperEl);
  mount(formEl, wrapperEl);
  mount(formEl, buttonEl);
  return formEl;
}
