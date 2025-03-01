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

describe('Room e2e test', () => {
  const roomPageUrl = '/room';
  const roomPageUrlPattern = new RegExp('/room(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const roomSample = { name: 'futtern leistungsorientiert' };

  let room;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/rooms+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/rooms').as('postEntityRequest');
    cy.intercept('DELETE', '/api/rooms/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (room) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/rooms/${room.id}`,
      }).then(() => {
        room = undefined;
      });
    }
  });

  it('Rooms menu should load Rooms page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('room');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Room').should('exist');
    cy.url().should('match', roomPageUrlPattern);
  });

  describe('Room page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(roomPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Room page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/room/new$'));
        cy.getEntityCreateUpdateHeading('Room');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/rooms',
          body: roomSample,
        }).then(({ body }) => {
          room = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/rooms+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/rooms?page=0&size=20>; rel="last",<http://localhost/api/rooms?page=0&size=20>; rel="first"',
              },
              body: [room],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(roomPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Room page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('room');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);
      });

      it('edit button click should load edit Room page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Room');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);
      });

      it('edit button click should load edit Room page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Room');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);
      });

      it('last delete button click should delete instance of Room', () => {
        cy.intercept('GET', '/api/rooms/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('room').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);

        room = undefined;
      });
    });
  });

  describe('new Room page', () => {
    beforeEach(() => {
      cy.visit(`${roomPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Room');
    });

    it('should create an instance of Room', () => {
      cy.get(`[data-cy="name"]`).type('achtens vielmals');
      cy.get(`[data-cy="name"]`).should('have.value', 'achtens vielmals');

      cy.get(`[data-cy="capacity"]`).type('32349');
      cy.get(`[data-cy="capacity"]`).should('have.value', '32349');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        room = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', roomPageUrlPattern);
    });
  });
});
