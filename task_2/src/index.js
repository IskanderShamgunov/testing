'use strict';
document.addEventListener('DOMContentLoaded', () => {

  let cards = [];
  let timer;

  let field;
  let timerElement;

  class Card {
    constructor(container, cardNumber, flip) {

      this.cardNumber = cardNumber;
      this.element = this.createElement(container);

      this.open = false;
      this.success = false;
      this.fail = false;

    }

    getCheckElement() {
      const num = document.createElement('span');
      num.textContent = this._cardNumber;
      return num;
    }

    createElement(container) {
      const card = document.createElement('div');
      const cardFront = document.createElement('div');
      const cardBack = document.createElement('div');

      card.classList.add('field__item');
      cardFront.classList.add('field__item-front');
      cardBack.classList.add('field__item-back');

      card.addEventListener('click', () => {
        flip(this);
      });

      cardFront.append(this.getCheckElement());
      card.append(cardFront);
      card.append(cardBack);
      container.append(card);

      card.style.fontSize = `${card.clientHeight * .7}px`;

      return card;
    }

    set cardNumber(value) {
      if (typeof value !== 'number') throw new TypeError('Свойство cardNumber должно иметь тип number');
      this._cardNumber = value;
    }

    get cardNumber() {
      return this._cardNumber;
    }

    set open(state) {
      if (typeof state !== 'boolean') throw new TypeError('Свойство open должно иметь тип boolean');
      if (state) this.element.classList.add('field__item--open');
      if (!state) this.element.classList.remove('field__item--open');
      this._open = state;
    }

    get open() {
     return this._open;
    }

    set success(state) {
      if (typeof state !== 'boolean') throw new TypeError('Свойство success должно иметь тип boolean');
      if (state) this.element.classList.add('field__item--hit');
      this._success = state;
    }

    get success() {
      return this._success;
    }

    set fail(state) {
      if (typeof state !== 'boolean') throw new TypeError('Свойство fail должно иметь тип boolean');
      if (state) this.element.classList.add('field__item--fail');
      if (!state) this.element.classList.remove('field__item--fail');
      this._fail = state;
    }

    get fail() {
      return this._fail;
    }

  }

  class AmazingCard extends Card {

    getCheckElement() {
      const img = document.createElement('img');
      img.classList.add('field__item-front-image');
      img.src = `./img/${Math.random() <= .1 ? null : this._cardNumber}.jpg`;
      img.alt = '';

      img.addEventListener('error', function() {
        img.src = './img/default.jpg';
      });

      return img;
    }

  }

  const container = document.querySelector('.container')
  const form = document.forms.settings
  const tryAgainBtn = document.querySelector('.try-again-btn');

  function flip(card) {

    card.open = true;

    const prevCard = cards.find(prevCard => {
      return (prevCard !== card) && prevCard.open && !prevCard.success && !prevCard.fail;
    });

    if (!prevCard) {
      cards.filter(card => card.fail).forEach(card => {
        card.fail = false;
        card.open = false;
      });

      return;
    }

    if (card.cardNumber === prevCard.cardNumber) {
      card.success = true;
      prevCard.success = true;

      if ( !cards.some(card => !card.success) ) endGame();

    } else {
      card.fail = true;
      prevCard.fail = true;
    }

    return;
  }

  function handleForm(event) {
    event.preventDefault();

    function setErrorStatus(inputEl) {
      inputEl.classList.add('form__input--error');
      inputEl.value = '4';

      setTimeout(() => {
        inputEl.classList.remove('form__input--error');
      }, 3000);
    }

    const valueVertical = +form.elements.vertical.value;
    const valueHorizontal = +form.elements.horizontal.value;
    const mode = form.elements.mode.value;

    if (
      !(valueVertical % 2) &&
      valueVertical >= 2 &&
      valueVertical <= 10 &&
      !(valueHorizontal % 2) &&
      valueHorizontal >= 2 &&
      valueHorizontal <= 10
      ) {

      setField(valueVertical, valueHorizontal, mode);
      return;

    } else {

      if (
        !( !(valueVertical % 2) &&
            valueVertical >= 2 &&
            valueVertical <= 10 )
        ) {
        setErrorStatus(form.elements.vertical);
      }

      if (
        !( !(valueHorizontal % 2) &&
            valueHorizontal >= 2 &&
            valueHorizontal <= 10 )
        ) {
        setErrorStatus(form.elements.horizontal);
      }

      return;

    }

  }

  function getCardNumbers(amount) {
    let numbers = [];

    for (let n = 1; n <= amount; n++) {
      numbers.push(Math.ceil(n / 2));
    }

    let temp, j, i;

    for(i = numbers.length - 1; i > 0; i--){

      j = Math.floor(Math.random()*(i + 1));

      temp = numbers[j];
      numbers[j] = numbers[i];
      numbers[i] = temp;

    };

    return numbers;
  }

  function endGame() {

    timerElement.classList.add('timer--end');
    timerElement.classList.remove('timer--running-out');
    clearInterval(timer);

    field.classList.add('disable');

    tryAgainBtn.style.top = `${field.offsetHeight + 20}px`
    tryAgainBtn.classList.add('try-again-btn--active');
    cards = [];

  }

  function setField(valueVertical, valueHorizontal, mode) {

    const cardNumberArray = getCardNumbers(valueVertical * valueHorizontal);

    form.classList.remove('form--visible');

    field = document.createElement('div');
    field.classList.add('field');

    field.style.gridTemplateColumns = `repeat(${valueHorizontal}, 1fr)`;
    field.style.gridTemplateRows = `repeat(${valueVertical}, 1fr)`;
    field.style.height = `${window.innerHeight * .8}px`;

    timerElement = document.createElement('div');
    timerElement.classList.add('timer');

    container.append(field);
    container.append(timerElement);

    switch (mode) {
      case 'numbers':
        for (let cardNumber of cardNumberArray) {
          const card = new Card(field, cardNumber, flip);
          cards.push(card);
        }
        break;

      case 'pictures':
        for (let cardNumber of cardNumberArray) {
          const card = new AmazingCard(field, cardNumber, flip);
          cards.push(card);
        }
        break;
    }

    runGame();
  }

  function countTime() {

    let timeLeft = 60;

    timerElement.textContent = `${timeLeft}`;

    return (() => {

      timeLeft--;

      if (timeLeft === 10) {
        timerElement.classList.add('timer--running-out');
      };

      if (timeLeft <= 0) {

        clearInterval(timer);

        setTimeout(() => {

          timerElement.classList.add('timer--end');
          timerElement.classList.remove('timer--running-out');
          timerElement.textContent = '0';

          endGame();

        }, 1000);


      };

      timerElement.textContent = `${timeLeft}`;

    });

  }

  function runGame() {

    tryAgainBtn.addEventListener('click', function() {
      field.remove();
      timerElement.remove();

      tryAgainBtn.classList.remove('try-again-btn--active');
      form.classList.add('form--visible');
    });

    setTimeout(() => {
      timer = setInterval(countTime(), 1000);
    }, 1500)

  }

  form.addEventListener('submit', handleForm);

});
