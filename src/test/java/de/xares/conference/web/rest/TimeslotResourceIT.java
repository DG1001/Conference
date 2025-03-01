package de.xares.conference.web.rest;

import static de.xares.conference.domain.TimeslotAsserts.*;
import static de.xares.conference.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.xares.conference.IntegrationTest;
import de.xares.conference.domain.Timeslot;
import de.xares.conference.repository.TimeslotRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TimeslotResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TimeslotResourceIT {

    private static final Instant DEFAULT_START = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/timeslots";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TimeslotRepository timeslotRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTimeslotMockMvc;

    private Timeslot timeslot;

    private Timeslot insertedTimeslot;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Timeslot createEntity() {
        return new Timeslot().start(DEFAULT_START).end(DEFAULT_END);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Timeslot createUpdatedEntity() {
        return new Timeslot().start(UPDATED_START).end(UPDATED_END);
    }

    @BeforeEach
    public void initTest() {
        timeslot = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTimeslot != null) {
            timeslotRepository.delete(insertedTimeslot);
            insertedTimeslot = null;
        }
    }

    @Test
    @Transactional
    void createTimeslot() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Timeslot
        var returnedTimeslot = om.readValue(
            restTimeslotMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(timeslot)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Timeslot.class
        );

        // Validate the Timeslot in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTimeslotUpdatableFieldsEquals(returnedTimeslot, getPersistedTimeslot(returnedTimeslot));

        insertedTimeslot = returnedTimeslot;
    }

    @Test
    @Transactional
    void createTimeslotWithExistingId() throws Exception {
        // Create the Timeslot with an existing ID
        timeslot.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimeslotMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(timeslot)))
            .andExpect(status().isBadRequest());

        // Validate the Timeslot in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        timeslot.setStart(null);

        // Create the Timeslot, which fails.

        restTimeslotMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(timeslot)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        timeslot.setEnd(null);

        // Create the Timeslot, which fails.

        restTimeslotMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(timeslot)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTimeslots() throws Exception {
        // Initialize the database
        insertedTimeslot = timeslotRepository.saveAndFlush(timeslot);

        // Get all the timeslotList
        restTimeslotMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(timeslot.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())));
    }

    @Test
    @Transactional
    void getTimeslot() throws Exception {
        // Initialize the database
        insertedTimeslot = timeslotRepository.saveAndFlush(timeslot);

        // Get the timeslot
        restTimeslotMockMvc
            .perform(get(ENTITY_API_URL_ID, timeslot.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(timeslot.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTimeslot() throws Exception {
        // Get the timeslot
        restTimeslotMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTimeslot() throws Exception {
        // Initialize the database
        insertedTimeslot = timeslotRepository.saveAndFlush(timeslot);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the timeslot
        Timeslot updatedTimeslot = timeslotRepository.findById(timeslot.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTimeslot are not directly saved in db
        em.detach(updatedTimeslot);
        updatedTimeslot.start(UPDATED_START).end(UPDATED_END);

        restTimeslotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTimeslot.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTimeslot))
            )
            .andExpect(status().isOk());

        // Validate the Timeslot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTimeslotToMatchAllProperties(updatedTimeslot);
    }

    @Test
    @Transactional
    void putNonExistingTimeslot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        timeslot.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeslotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, timeslot.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(timeslot))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timeslot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTimeslot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        timeslot.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeslotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(timeslot))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timeslot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTimeslot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        timeslot.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeslotMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(timeslot)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Timeslot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTimeslotWithPatch() throws Exception {
        // Initialize the database
        insertedTimeslot = timeslotRepository.saveAndFlush(timeslot);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the timeslot using partial update
        Timeslot partialUpdatedTimeslot = new Timeslot();
        partialUpdatedTimeslot.setId(timeslot.getId());

        restTimeslotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimeslot.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTimeslot))
            )
            .andExpect(status().isOk());

        // Validate the Timeslot in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTimeslotUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedTimeslot, timeslot), getPersistedTimeslot(timeslot));
    }

    @Test
    @Transactional
    void fullUpdateTimeslotWithPatch() throws Exception {
        // Initialize the database
        insertedTimeslot = timeslotRepository.saveAndFlush(timeslot);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the timeslot using partial update
        Timeslot partialUpdatedTimeslot = new Timeslot();
        partialUpdatedTimeslot.setId(timeslot.getId());

        partialUpdatedTimeslot.start(UPDATED_START).end(UPDATED_END);

        restTimeslotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimeslot.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTimeslot))
            )
            .andExpect(status().isOk());

        // Validate the Timeslot in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTimeslotUpdatableFieldsEquals(partialUpdatedTimeslot, getPersistedTimeslot(partialUpdatedTimeslot));
    }

    @Test
    @Transactional
    void patchNonExistingTimeslot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        timeslot.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeslotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, timeslot.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(timeslot))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timeslot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTimeslot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        timeslot.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeslotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(timeslot))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timeslot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTimeslot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        timeslot.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeslotMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(timeslot)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Timeslot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTimeslot() throws Exception {
        // Initialize the database
        insertedTimeslot = timeslotRepository.saveAndFlush(timeslot);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the timeslot
        restTimeslotMockMvc
            .perform(delete(ENTITY_API_URL_ID, timeslot.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return timeslotRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Timeslot getPersistedTimeslot(Timeslot timeslot) {
        return timeslotRepository.findById(timeslot.getId()).orElseThrow();
    }

    protected void assertPersistedTimeslotToMatchAllProperties(Timeslot expectedTimeslot) {
        assertTimeslotAllPropertiesEquals(expectedTimeslot, getPersistedTimeslot(expectedTimeslot));
    }

    protected void assertPersistedTimeslotToMatchUpdatableProperties(Timeslot expectedTimeslot) {
        assertTimeslotAllUpdatablePropertiesEquals(expectedTimeslot, getPersistedTimeslot(expectedTimeslot));
    }
}
