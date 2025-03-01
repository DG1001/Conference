package de.xares.conference.web.rest;

import static de.xares.conference.domain.TalkAsserts.*;
import static de.xares.conference.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.xares.conference.IntegrationTest;
import de.xares.conference.domain.Room;
import de.xares.conference.domain.Talk;
import de.xares.conference.domain.Timeslot;
import de.xares.conference.repository.TalkRepository;
import de.xares.conference.service.TalkService;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TalkResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TalkResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_SPEAKER = "AAAAAAAAAA";
    private static final String UPDATED_SPEAKER = "BBBBBBBBBB";

    private static final String DEFAULT_ABSTRACT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_ABSTRACT_TEXT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/talks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TalkRepository talkRepository;

    @Mock
    private TalkRepository talkRepositoryMock;

    @Mock
    private TalkService talkServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTalkMockMvc;

    private Talk talk;

    private Talk insertedTalk;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Talk createEntity(EntityManager em) {
        Talk talk = new Talk().title(DEFAULT_TITLE).speaker(DEFAULT_SPEAKER).abstractText(DEFAULT_ABSTRACT_TEXT);
        // Add required entity
        Room room;
        if (TestUtil.findAll(em, Room.class).isEmpty()) {
            room = RoomResourceIT.createEntity();
            em.persist(room);
            em.flush();
        } else {
            room = TestUtil.findAll(em, Room.class).get(0);
        }
        talk.setRoom(room);
        // Add required entity
        Timeslot timeslot;
        if (TestUtil.findAll(em, Timeslot.class).isEmpty()) {
            timeslot = TimeslotResourceIT.createEntity();
            em.persist(timeslot);
            em.flush();
        } else {
            timeslot = TestUtil.findAll(em, Timeslot.class).get(0);
        }
        talk.setTimeslot(timeslot);
        return talk;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Talk createUpdatedEntity(EntityManager em) {
        Talk updatedTalk = new Talk().title(UPDATED_TITLE).speaker(UPDATED_SPEAKER).abstractText(UPDATED_ABSTRACT_TEXT);
        // Add required entity
        Room room;
        if (TestUtil.findAll(em, Room.class).isEmpty()) {
            room = RoomResourceIT.createUpdatedEntity();
            em.persist(room);
            em.flush();
        } else {
            room = TestUtil.findAll(em, Room.class).get(0);
        }
        updatedTalk.setRoom(room);
        // Add required entity
        Timeslot timeslot;
        if (TestUtil.findAll(em, Timeslot.class).isEmpty()) {
            timeslot = TimeslotResourceIT.createUpdatedEntity();
            em.persist(timeslot);
            em.flush();
        } else {
            timeslot = TestUtil.findAll(em, Timeslot.class).get(0);
        }
        updatedTalk.setTimeslot(timeslot);
        return updatedTalk;
    }

    @BeforeEach
    public void initTest() {
        talk = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedTalk != null) {
            talkRepository.delete(insertedTalk);
            insertedTalk = null;
        }
    }

    @Test
    @Transactional
    void createTalk() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Talk
        var returnedTalk = om.readValue(
            restTalkMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(talk)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Talk.class
        );

        // Validate the Talk in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTalkUpdatableFieldsEquals(returnedTalk, getPersistedTalk(returnedTalk));

        insertedTalk = returnedTalk;
    }

    @Test
    @Transactional
    void createTalkWithExistingId() throws Exception {
        // Create the Talk with an existing ID
        talk.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTalkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(talk)))
            .andExpect(status().isBadRequest());

        // Validate the Talk in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        talk.setTitle(null);

        // Create the Talk, which fails.

        restTalkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(talk)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSpeakerIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        talk.setSpeaker(null);

        // Create the Talk, which fails.

        restTalkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(talk)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTalks() throws Exception {
        // Initialize the database
        insertedTalk = talkRepository.saveAndFlush(talk);

        // Get all the talkList
        restTalkMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(talk.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].speaker").value(hasItem(DEFAULT_SPEAKER)))
            .andExpect(jsonPath("$.[*].abstractText").value(hasItem(DEFAULT_ABSTRACT_TEXT)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTalksWithEagerRelationshipsIsEnabled() throws Exception {
        when(talkServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTalkMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(talkServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTalksWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(talkServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTalkMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(talkRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTalk() throws Exception {
        // Initialize the database
        insertedTalk = talkRepository.saveAndFlush(talk);

        // Get the talk
        restTalkMockMvc
            .perform(get(ENTITY_API_URL_ID, talk.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(talk.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.speaker").value(DEFAULT_SPEAKER))
            .andExpect(jsonPath("$.abstractText").value(DEFAULT_ABSTRACT_TEXT));
    }

    @Test
    @Transactional
    void getNonExistingTalk() throws Exception {
        // Get the talk
        restTalkMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTalk() throws Exception {
        // Initialize the database
        insertedTalk = talkRepository.saveAndFlush(talk);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the talk
        Talk updatedTalk = talkRepository.findById(talk.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTalk are not directly saved in db
        em.detach(updatedTalk);
        updatedTalk.title(UPDATED_TITLE).speaker(UPDATED_SPEAKER).abstractText(UPDATED_ABSTRACT_TEXT);

        restTalkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTalk.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTalk))
            )
            .andExpect(status().isOk());

        // Validate the Talk in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTalkToMatchAllProperties(updatedTalk);
    }

    @Test
    @Transactional
    void putNonExistingTalk() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        talk.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTalkMockMvc
            .perform(put(ENTITY_API_URL_ID, talk.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(talk)))
            .andExpect(status().isBadRequest());

        // Validate the Talk in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTalk() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        talk.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTalkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(talk))
            )
            .andExpect(status().isBadRequest());

        // Validate the Talk in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTalk() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        talk.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTalkMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(talk)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Talk in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTalkWithPatch() throws Exception {
        // Initialize the database
        insertedTalk = talkRepository.saveAndFlush(talk);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the talk using partial update
        Talk partialUpdatedTalk = new Talk();
        partialUpdatedTalk.setId(talk.getId());

        partialUpdatedTalk.speaker(UPDATED_SPEAKER).abstractText(UPDATED_ABSTRACT_TEXT);

        restTalkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTalk.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTalk))
            )
            .andExpect(status().isOk());

        // Validate the Talk in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTalkUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedTalk, talk), getPersistedTalk(talk));
    }

    @Test
    @Transactional
    void fullUpdateTalkWithPatch() throws Exception {
        // Initialize the database
        insertedTalk = talkRepository.saveAndFlush(talk);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the talk using partial update
        Talk partialUpdatedTalk = new Talk();
        partialUpdatedTalk.setId(talk.getId());

        partialUpdatedTalk.title(UPDATED_TITLE).speaker(UPDATED_SPEAKER).abstractText(UPDATED_ABSTRACT_TEXT);

        restTalkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTalk.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTalk))
            )
            .andExpect(status().isOk());

        // Validate the Talk in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTalkUpdatableFieldsEquals(partialUpdatedTalk, getPersistedTalk(partialUpdatedTalk));
    }

    @Test
    @Transactional
    void patchNonExistingTalk() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        talk.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTalkMockMvc
            .perform(patch(ENTITY_API_URL_ID, talk.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(talk)))
            .andExpect(status().isBadRequest());

        // Validate the Talk in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTalk() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        talk.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTalkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(talk))
            )
            .andExpect(status().isBadRequest());

        // Validate the Talk in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTalk() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        talk.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTalkMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(talk)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Talk in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTalk() throws Exception {
        // Initialize the database
        insertedTalk = talkRepository.saveAndFlush(talk);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the talk
        restTalkMockMvc
            .perform(delete(ENTITY_API_URL_ID, talk.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return talkRepository.count();
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

    protected Talk getPersistedTalk(Talk talk) {
        return talkRepository.findById(talk.getId()).orElseThrow();
    }

    protected void assertPersistedTalkToMatchAllProperties(Talk expectedTalk) {
        assertTalkAllPropertiesEquals(expectedTalk, getPersistedTalk(expectedTalk));
    }

    protected void assertPersistedTalkToMatchUpdatableProperties(Talk expectedTalk) {
        assertTalkAllUpdatablePropertiesEquals(expectedTalk, getPersistedTalk(expectedTalk));
    }
}
