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

describe('Talk e2e test', () => {
  const talkPageUrl = '/talk';
  const talkPageUrlPattern = new RegExp('/talk(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const talkSample = { title: 'Dinosaurier', speaker: 'weiterhin', abstractText: 'Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci50eHQ=' };

  let talk;
  let room;
  let timeslot;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/rooms',
      body: { name: 'gewünscht', capacity: 26399 },
    }).then(({ body }) => {
      room = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/timeslots',
      body: { start: '2025-02-28T10:42:35.359Z', end: '2025-02-28T14:43:20.763Z' },
    }).then(({ body }) => {
      timeslot = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/talks+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/talks').as('postEntityRequest');
    cy.intercept('DELETE', '/api/talks/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/rooms', {
      statusCode: 200,
      body: [room],
    });

    cy.intercept('GET', '/api/timeslots', {
      statusCode: 200,
      body: [timeslot],
    });
  });

  afterEach(() => {
    if (talk) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/talks/${talk.id}`,
      }).then(() => {
        talk = undefined;
      });
    }
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
    if (timeslot) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/timeslots/${timeslot.id}`,
      }).then(() => {
        timeslot = undefined;
      });
    }
  });

  it('Talks menu should load Talks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('talk');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Talk').should('exist');
    cy.url().should('match', talkPageUrlPattern);
  });

  describe('Talk page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(talkPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Talk page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/talk/new$'));
        cy.getEntityCreateUpdateHeading('Talk');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', talkPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/talks',
          body: {
            ...talkSample,
            room,
            timeslot,
          },
        }).then(({ body }) => {
          talk = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/talks+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/talks?page=0&size=20>; rel="last",<http://localhost/api/talks?page=0&size=20>; rel="first"',
              },
              body: [talk],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(talkPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Talk page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('talk');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', talkPageUrlPattern);
      });

      it('edit button click should load edit Talk page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Talk');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', talkPageUrlPattern);
      });

      it('edit button click should load edit Talk page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Talk');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', talkPageUrlPattern);
      });

      it('last delete button click should delete instance of Talk', () => {
        cy.intercept('GET', '/api/talks/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('talk').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', talkPageUrlPattern);

        talk = undefined;
      });
    });
  });

  describe('new Talk page', () => {
    beforeEach(() => {
      cy.visit(`${talkPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Talk');
    });

    it('should create an instance of Talk', () => {
      cy.get(`[data-cy="title"]`).type('blah');
      cy.get(`[data-cy="title"]`).should('have.value', 'blah');

      cy.get(`[data-cy="speaker"]`).type('Antike phooey abmagern');
      cy.get(`[data-cy="speaker"]`).should('have.value', 'Antike phooey abmagern');

      cy.get(`[data-cy="abstractText"]`).type('../fake-data/blob/hipster.txt');
      cy.get(`[data-cy="abstractText"]`).invoke('val').should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="room"]`).select(1);
      cy.get(`[data-cy="timeslot"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        talk = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', talkPageUrlPattern);
    });
  });
});
