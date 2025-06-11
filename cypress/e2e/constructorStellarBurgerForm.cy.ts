// ======================== IMPORTS & SETUP =================================
import Cypress from 'cypress';

// Используем ID из фикстуры
const API_ENDPOINT = 'https://norma.nomoreparties.space/api';
const CRATER_BUN_SELECTOR = `[data-cy='643d69a5c3f7b9001cfa093c']`; // Краторная булка N-200i
const FLUORESCENT_BUN_SELECTOR = `[data-cy='643d69a5c3f7b9001cfa093d']`; // Флюоресцентная булка R2-D3
const MAGNOLIA_PATTY_SELECTOR = `[data-cy='643d69a5c3f7b9001cfa0941']`; // Биокотлета из марсианской Магнолии

// ======================== GLOBAL SETUP =================================
beforeEach(function() {
  // Настраиваем перехват API-запросов
  cy.intercept('GET', `${API_ENDPOINT}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('POST', `${API_ENDPOINT}/auth/login`, {
    fixture: 'user.json'
  });
  cy.intercept('GET', `${API_ENDPOINT}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${API_ENDPOINT}/orders`, {
    fixture: 'orderResponse.json'
  });
  
  // Настройка страницы
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('#modals').as('ingredientDetailsPortal');
});

// ======================== INGREDIENTS TESTS =================================
describe('Функционал добавления ингредиентов в конструктор', function() {
  it('должен увеличивать счетчик при добавлении ингредиента', function() {
    // Добавляем котлету и проверяем счетчик
    cy.get(MAGNOLIA_PATTY_SELECTOR).within(() => {
      cy.get('button').click();
      cy.get('.counter__num').should('have.text', '1');
    });
  });
  
  // ======================== BUN & FILLING INTERACTIONS =================================
  context('Взаимодействие между булками и начинками', function() {
    it('должен правильно добавлять и булку, и начинку', function() {
      // Добавляем булку, затем начинку
      cy.get(CRATER_BUN_SELECTOR).within(() => {
        cy.get('button').click();
      });
      cy.get(MAGNOLIA_PATTY_SELECTOR).within(() => {
        cy.get('button').click();
      });
      
      // Проверяем наличие счетчиков
      cy.get(CRATER_BUN_SELECTOR).find('.counter__num').should('exist');
      cy.get(MAGNOLIA_PATTY_SELECTOR).find('.counter__num').should('exist');
    });
    
    it('должен сохранять структуру при добавлении булки после начинок', function() {
      // Сначала добавляем начинку, потом булку
      cy.get(MAGNOLIA_PATTY_SELECTOR).within(() => {
        cy.get('button').click();
      });
      cy.get(CRATER_BUN_SELECTOR).within(() => {
        cy.get('button').click();
      });
      
      // Проверяем корректность счетчиков
      cy.get(MAGNOLIA_PATTY_SELECTOR).find('.counter__num').should('have.text', '1');
      cy.get(CRATER_BUN_SELECTOR).find('.counter__num').should('exist');
    });
  });
  
  // ======================== BUN REPLACEMENT LOGIC =================================
  context('Механика замены булок', function() {
    it('должен заменять одну булку на другую', function() {
      // Добавляем первую булку
      cy.get(CRATER_BUN_SELECTOR).within(() => {
        cy.get('button').click();
      });
      cy.get(CRATER_BUN_SELECTOR).find('.counter__num').should('exist');
      
      // Добавляем вторую булку (должна заменить первую)
      cy.get(FLUORESCENT_BUN_SELECTOR).within(() => {
        cy.get('button').click();
      });
      cy.get(FLUORESCENT_BUN_SELECTOR).find('.counter__num').should('exist');
      
      // Первая булка должна быть заменена
      cy.get(CRATER_BUN_SELECTOR).find('.counter__num').should('not.exist');
    });
    
    it('должен сохранять начинки при замене булки', function() {
      // Добавляем булку и начинку
      cy.get(CRATER_BUN_SELECTOR).within(() => {
        cy.get('button').click();
      });
      cy.get(MAGNOLIA_PATTY_SELECTOR).within(() => {
        cy.get('button').click();
      });
      
      // Заменяем булку
      cy.get(FLUORESCENT_BUN_SELECTOR).within(() => {
        cy.get('button').click();
      });
      
      // Проверяем, что начинка осталась, а булка заменилась
      cy.get(MAGNOLIA_PATTY_SELECTOR).find('.counter__num').should('have.text', '1');
      cy.get(FLUORESCENT_BUN_SELECTOR).find('.counter__num').should('exist');
      cy.get(CRATER_BUN_SELECTOR).find('.counter__num').should('not.exist');
    });
  });
});

// ======================== ORDER PROCESSING TESTS =================================
describe('Процесс оформления заказа', function() {
  beforeEach(function() {
    // Настраиваем авторизацию
    window.localStorage.setItem('refreshToken', 'cosmic_refresh_token_xyz');
    cy.setCookie('accessToken', 'space_access_token_abc');
    
    // Проверяем, что токены установлены
    cy.getAllLocalStorage().should('not.be.empty');
    cy.getCookie('accessToken').should('exist');
  });
  
  afterEach(function() {
    // Очищаем данные авторизации
    window.localStorage.clear();
    cy.clearAllCookies();
    
    // Проверяем, что токены удалены
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });

  it('должен создавать заказ и отображать номер в модальном окне', function() {
    // Добавляем необходимые ингредиенты
    cy.get(CRATER_BUN_SELECTOR).within(() => {
      cy.get('button').click();
    });
    cy.get(MAGNOLIA_PATTY_SELECTOR).within(() => {
      cy.get('button').click();
    });
    
    // Отправляем заказ
    cy.get("[data-cy='order-button']").click();
    
    // Проверяем, что в модальном окне отображается номер заказа
    cy.get('@ingredientDetailsPortal').find('h2').contains('38483');
  });
});

// ======================== MODAL WINDOW TESTS =================================
describe('Взаимодействие с модальными окнами ингредиентов', function() {
  it('должен открывать модальное окно с деталями ингредиента', function() {
    // Проверяем, что модальное окно изначально пусто
    cy.get('@ingredientDetailsPortal').should('be.empty');
    
    // Открываем детали ингредиента
    cy.get(MAGNOLIA_PATTY_SELECTOR).find('a').click();
    
    // Проверяем, что модальное окно открылось и URL обновился
    cy.get('@ingredientDetailsPortal').should('not.be.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');
    
    // Проверяем содержимое модального окна
    cy.get('@ingredientDetailsPortal').contains('Органическая котлета с Юпитера');
  });
  
  // ======================== MODAL CLOSING METHODS =================================
  it('должен закрывать модальное окно при нажатии на крестик', function() {
    // Открываем модальное окно
    cy.get('@ingredientDetailsPortal').should('be.empty');
    cy.get(MAGNOLIA_PATTY_SELECTOR).find('a').click();
    cy.get('@ingredientDetailsPortal').should('not.be.empty');
    
    // Закрываем, нажимая на крестик
    cy.get('@ingredientDetailsPortal').find('button').click();
    cy.get('@ingredientDetailsPortal').should('be.empty');
  });
  
  it('должен закрывать модальное окно при клике на оверлей', function() {
    // Открываем модальное окно
    cy.get('@ingredientDetailsPortal').should('be.empty');
    cy.get(MAGNOLIA_PATTY_SELECTOR).find('a').click();
    cy.get('@ingredientDetailsPortal').should('not.be.empty');
    
    // Закрываем, кликая на оверлей
    cy.get("[data-cy='overlay']").click({ force: true });
    cy.get('@ingredientDetailsPortal').should('be.empty');
  });
  
  it('должен закрывать модальное окно при нажатии клавиши Escape', function() {
    // Открываем модальное окно
    cy.get('@ingredientDetailsPortal').should('be.empty');
    cy.get(MAGNOLIA_PATTY_SELECTOR).find('a').click();
    cy.get('@ingredientDetailsPortal').should('not.be.empty');
    
    // Закрываем, нажимая Escape
    cy.get('body').type('{esc}');
    cy.get('@ingredientDetailsPortal').should('be.empty');
  });
});
// ======================== MODAL TESTS WITH SIMPLIFIED SELECTORS =================================
describe('Функционал модальных окон (с упрощенными селекторами)', function() {
  it('должен открывать модальное окно при клике на ингредиент', function() {
    cy.visit('/');
    
    // Клик на карточку ингредиента (общий подход)
    cy.get(MAGNOLIA_PATTY_SELECTOR).click();
    
    // Проверяем, что модальное окно открылось
    cy.get('#modals').should('not.be.empty');
  });
  
  it('должен закрывать модальное окно при клике на крестик', function() {
    cy.visit('/');
    
    // Открываем модальное окно
    cy.get(MAGNOLIA_PATTY_SELECTOR).click();
    cy.get('#modals').should('not.be.empty');
    
    // Закрываем модальное окно
    cy.get('#modals').find('button').first().click();
    cy.get('#modals').should('be.empty');
  });
});

// ======================== ORDER TOTAL PRICE TESTS =================================
describe('Расчет общей стоимости заказа', function() {
  it('должен корректно рассчитывать стоимость заказа с разными ингредиентами', function() {
    // Очищаем конструктор, если в нем что-то есть
    cy.visit('/');
    
    // Запоминаем начальную стоимость (должна быть 0)
    cy.get('[data-cy="order-button"]').parent().find('p').invoke('text').as('initialPrice');
    
    // Добавляем булку
    cy.get(CRATER_BUN_SELECTOR).within(() => {
      cy.get('button').click();
    });
    
    // Проверяем, что стоимость увеличилась
    cy.get('[data-cy="order-button"]').parent().find('p').invoke('text').then(function(priceText) {
      const initialPrice = parseInt(this.initialPrice.replace(/\D/g, '')) || 0;
      const currentPrice = parseInt(priceText.replace(/\D/g, ''));
      expect(currentPrice).to.be.greaterThan(initialPrice);
    });
    
    // Добавляем начинку
    cy.get(MAGNOLIA_PATTY_SELECTOR).within(() => {
      cy.get('button').click();
    });
    
    // Проверяем, что стоимость снова увеличилась
    cy.get('[data-cy="order-button"]').parent().find('p').invoke('text').then(function(priceText) {
      const initialPrice = parseInt(this.initialPrice.replace(/\D/g, '')) || 0;
      const currentPrice = parseInt(priceText.replace(/\D/g, ''));
      expect(currentPrice).to.be.greaterThan(initialPrice);
    });
  });
});

// ======================== ORDER BUTTON TESTS =================================
describe('Функционал кнопки оформления заказа', function() {
  
  it('должен оформлять заказ для авторизованного пользователя', function() {
    // Устанавливаем токены авторизации
    window.localStorage.setItem('refreshToken', 'cosmic_refresh_token_xyz');
    cy.setCookie('accessToken', 'space_access_token_abc');
    
    // Добавляем ингредиенты
    cy.visit('/');
    cy.get(CRATER_BUN_SELECTOR).find('button').click();
    cy.get(MAGNOLIA_PATTY_SELECTOR).find('button').click();
    
    // Перехватываем запрос на создание заказа
    cy.intercept('POST', `${API_ENDPOINT}/orders`, {
      fixture: 'orderResponse.json'
    }).as('orderRequest');
    
    // Нажимаем кнопку заказа
    cy.get('[data-cy="order-button"]').click();
    
    // Проверяем, что запрос был отправлен
    cy.wait('@orderRequest');
    
    // Проверяем, что открылось модальное окно с номером заказа
    cy.get('#modals').should('not.be.empty');
    cy.get('#modals').contains(/38483|заказ|order/i).should('exist');
  });
});

// ======================== END OF TESTS =================================
