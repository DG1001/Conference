import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('Timeslot e2e test', () => {
  const timeslotPageUrl = '/timeslot';
  const timeslotPageUrlPattern = new RegExp('/timeslot(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const timeslotSample = { start: '2025-02-28T10:47:35.809Z', end: '2025-02-28T21:13:51.598Z' };

  let timeslot;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/timeslots+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/timeslots').as('postEntityRequest');
    cy.intercept('DELETE', '/api/timeslots/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (timeslot) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/timeslots/${timeslot.id}`,
      }).then(() => {
        timeslot = undefined;
      });
    }
  });

  it('Timeslots menu should load Timeslots page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('timeslot');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Timeslot').should('exist');
    cy.url().should('match', timeslotPageUrlPattern);
  });

  describe('Timeslot page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(timeslotPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Timeslot page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/timeslot/new$'));
        cy.getEntityCreateUpdateHeading('Timeslot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', timeslotPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/timeslots',
          body: timeslotSample,
        }).then(({ body }) => {
          timeslot = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/timeslots+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/timeslots?page=0&size=20>; rel="last",<http://localhost/api/timeslots?page=0&size=20>; rel="first"',
              },
              body: [timeslot],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(timeslotPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Timeslot page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('timeslot');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', timeslotPageUrlPattern);
      });

      it('edit button click should load edit Timeslot page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Timeslot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', timeslotPageUrlPattern);
      });

      it('edit button click should load edit Timeslot page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Timeslot');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', timeslotPageUrlPattern);
      });

      it('last delete button click should delete instance of Timeslot', () => {
        cy.intercept('GET', '/api/timeslots/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('timeslot').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', timeslotPageUrlPattern);

        timeslot = undefined;
      });
    });
  });

  describe('new Timeslot page', () => {
    beforeEach(() => {
      cy.visit(`${timeslotPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Timeslot');
    });

    it('should create an instance of Timeslot', () => {
      cy.get(`[data-cy="start"]`).type('2025-02-28T02:30');
      cy.get(`[data-cy="start"]`).blur();
      cy.get(`[data-cy="start"]`).should('have.value', '2025-02-28T02:30');

      cy.get(`[data-cy="end"]`).type('2025-02-28T23:34');
      cy.get(`[data-cy="end"]`).blur();
      cy.get(`[data-cy="end"]`).should('have.value', '2025-02-28T23:34');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        timeslot = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', timeslotPageUrlPattern);
    });
  });
});
