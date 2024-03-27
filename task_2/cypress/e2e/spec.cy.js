describe('Тест игры "Пары"', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5500/20_testing/task_2/src/index.html');
    cy.contains('Начать').click();
  });

  it('По умолчанию игра устанавливает поле 4х4, цифры не видны', () => {
    const field = '.field';
    cy.get(field)
      .should('have.attr', 'style')
      .and('match', /grid-template-columns:\s{0,1}repeat\(4,\s{0,1}1fr\)/gi);
    cy.get(field)
      .should('have.attr', 'style')
      .and('match', /grid-template-rows:\s{0,1}repeat\(4,\s{0,1}1fr\)/gi);
    cy.get('.field__item').should('have.length', '16');
    cy.get('.field__item-front').should('be.hidden');
  });

  it('При нажатии на карточку она открывается', () => {
    const index = Math.floor(Math.random() * 16);
    const elements = '.field__item';
    cy.get(elements).eq(index).click();
    cy.get(elements).eq(index).should('have.class', 'field__item--open');
  });

  it('Найденная пара остается видимой', () => {
    cy.get('.field__item').each(($el, index, $elements) => {
      if (index + 1 <= 15) {
        cy.wrap($elements)
          .eq(index + 1)
          .click();
        cy.wrap($elements).eq(0).click();

        if (
          $elements.eq(0).eq(0).text() ===
          $elements
            .eq(index + 1)
            .eq(0)
            .text()
        ) {
          cy.get('.field__item:not(.field__item--open)').then((el) => {
            cy.wrap(el.eq(Math.floor(Math.random() * el.length))).click();
          });

          cy.wrap($elements)
            .eq(index + 1)
            .should('have.class', 'field__item--hit');
          cy.wrap($elements).eq(0).should('have.class', 'field__item--hit');
          return false;
        }
      }
    });
  });

  it('Несовпадающие карты закрываются при нажатии на 3-ю', () => {
    cy.get('.field__item').each(($el, index, $elements) => {
      if (index + 1 <= 15) {
        cy.wrap($elements)
          .eq(index + 1)
          .click();
        cy.wrap($elements).eq(0).click();

        if (
          $elements.eq(0).eq(0).text() !==
          $elements
            .eq(index + 1)
            .eq(0)
            .text()
        ) {
          cy.get('.field__item:not(.field__item--open)').then((el) => {
            cy.wrap(el.eq(Math.floor(Math.random() * el.length))).click();
          });

          cy.wrap($elements)
            .eq(index + 1)
            .should('not.have.class', 'field__item--open');
          cy.wrap($elements)
            .eq(0)
            .should('not.have.class', 'field__item--open');
          return false;
        }
      }
    });
  });
});
