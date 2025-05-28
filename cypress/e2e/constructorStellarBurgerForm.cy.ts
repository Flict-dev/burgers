import Cypress from 'cypress';

const API_ROOT = 'https://norma.nomoreparties.space/api';
const SELECTOR_BUN = `[data-cy='643d69a5c3f7b9001cfa093c']`;
const SELECTOR_OTHER_BUN = `[data-cy='643d69a5c3f7b9001cfa093d']`;
const SELECTOR_FILLING = `[data-cy='643d69a5c3f7b9001cfa0941']`;

beforeEach(() => {
  cy.intercept('GET', `${API_ROOT}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('POST', `${API_ROOT}/auth/login`, {
    fixture: 'user.json'
  });
  cy.intercept('GET', `${API_ROOT}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${API_ROOT}/orders`, {
    fixture: 'orderResponse.json'
  });
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('#modals').as('ingredientModal');
});

// Group for ingredient operations
describe('Ingredient addition to order list', () => {
  it('increments ingredient counter on add', () => {
    cy.get(SELECTOR_FILLING).children('button').click();
    cy.get(SELECTOR_FILLING).find('.counter__num').should('contain', '1');
  });
  describe('handling buns and fillings', () => {
    it('puts bun and filling to order items', () => {
      cy.get(SELECTOR_BUN).children('button').click();
      cy.get(SELECTOR_FILLING).children('button').click();
      // sanity check: both counter should exist
      cy.get(SELECTOR_BUN).find('.counter__num').should('exist');
    });
    it('adds bun after fillings', () => {
      cy.get(SELECTOR_FILLING).children('button').click();
      cy.get(SELECTOR_BUN).children('button').click();
      cy.get(SELECTOR_FILLING).find('.counter__num').should('contain', '1');
    });
  });
  describe('bun replacement logic', () => {
    it('changes bun if only bun exists', () => {
      cy.get(SELECTOR_BUN).children('button').click();
      cy.get(SELECTOR_OTHER_BUN).children('button').click();
    });
    it('replaces bun with another bun while keeping fillings', () => {
      cy.get(SELECTOR_BUN).children('button').click();
      cy.get(SELECTOR_FILLING).children('button').click();
      cy.get(SELECTOR_OTHER_BUN).children('button').click();
    });
  });
});

// Order tests
describe('Order flow checks', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'stellar_token_sample');
    cy.setCookie('accessToken', 'galactic_access_sample');
    cy.getAllLocalStorage().should('not.be.empty');
    cy.getCookie('accessToken').should('exist');
  });
  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });

  it('submits the order and verifies response modal', () => {
    cy.get(SELECTOR_BUN).children('button').click();
    cy.get(SELECTOR_FILLING).children('button').click();
    cy.get("[data-cy='order-button']").click();
    // Additional check: modal should show the expected order number from fixture
    cy.get('@ingredientModal').find('h2').should('contain', '38483');
  });
});

// Various modal window scenarios
describe('Ingredient modal interactions', () => {
  it('shows ingredient data in modal on open', () => {
    cy.get('@ingredientModal').should('be.empty');
    cy.get(SELECTOR_FILLING).children('a').click();
    cy.get('@ingredientModal').should('not.be.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');
  });
  it('closes modal via "✕" button', () => {
    cy.get('@ingredientModal').should('be.empty');
    cy.get(SELECTOR_FILLING).children('a').click();
    cy.get('@ingredientModal').should('not.be.empty');
    cy.get('@ingredientModal').find('button').click();
    cy.get('@ingredientModal').should('be.empty');
  });
  it('closes modal by clicking overlay', () => {
    cy.get('@ingredientModal').should('be.empty');
    cy.get(SELECTOR_FILLING).children('a').click();
    cy.get('@ingredientModal').should('not.be.empty');
    cy.get("[data-cy='overlay']").click({ force: true });
    cy.get('@ingredientModal').should('be.empty');
  });
  it('closes modal when Escape pressed', () => {
    cy.get('@ingredientModal').should('be.empty');
    cy.get(SELECTOR_FILLING).children('a').click();
    cy.get('@ingredientModal').should('not.be.empty');
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@ingredientModal').should('be.empty');
  });
});
