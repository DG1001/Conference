package de.xares.conference.web.rest;

import static de.xares.conference.domain.RoomAsserts.*;
import static de.xares.conference.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.xares.conference.IntegrationTest;
import de.xares.conference.domain.Room;
import de.xares.conference.repository.RoomRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link RoomResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RoomResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_CAPACITY = 1;
    private static final Integer UPDATED_CAPACITY = 2;

    private static final String ENTITY_API_URL = "/api/rooms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRoomMockMvc;

    private Room room;

    private Room insertedRoom;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Room createEntity() {
        return new Room().name(DEFAULT_NAME).capacity(DEFAULT_CAPACITY);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Room createUpdatedEntity() {
        return new Room().name(UPDATED_NAME).capacity(UPDATED_CAPACITY);
    }

    @BeforeEach
    public void initTest() {
        room = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedRoom != null) {
            roomRepository.delete(insertedRoom);
            insertedRoom = null;
        }
    }

    @Test
    @Transactional
    void createRoom() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Room
        var returnedRoom = om.readValue(
            restRoomMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(room)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Room.class
        );

        // Validate the Room in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertRoomUpdatableFieldsEquals(returnedRoom, getPersistedRoom(returnedRoom));

        insertedRoom = returnedRoom;
    }

    @Test
    @Transactional
    void createRoomWithExistingId() throws Exception {
        // Create the Room with an existing ID
        room.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(room)))
            .andExpect(status().isBadRequest());

        // Validate the Room in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        room.setName(null);

        // Create the Room, which fails.

        restRoomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(room)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRooms() throws Exception {
        // Initialize the database
        insertedRoom = roomRepository.saveAndFlush(room);

        // Get all the roomList
        restRoomMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(room.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)));
    }

    @Test
    @Transactional
    void getRoom() throws Exception {
        // Initialize the database
        insertedRoom = roomRepository.saveAndFlush(room);

        // Get the room
        restRoomMockMvc
            .perform(get(ENTITY_API_URL_ID, room.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(room.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.capacity").value(DEFAULT_CAPACITY));
    }

    @Test
    @Transactional
    void getNonExistingRoom() throws Exception {
        // Get the room
        restRoomMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRoom() throws Exception {
        // Initialize the database
        insertedRoom = roomRepository.saveAndFlush(room);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the room
        Room updatedRoom = roomRepository.findById(room.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRoom are not directly saved in db
        em.detach(updatedRoom);
        updatedRoom.name(UPDATED_NAME).capacity(UPDATED_CAPACITY);

        restRoomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRoom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedRoom))
            )
            .andExpect(status().isOk());

        // Validate the Room in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedRoomToMatchAllProperties(updatedRoom);
    }

    @Test
    @Transactional
    void putNonExistingRoom() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        room.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoomMockMvc
            .perform(put(ENTITY_API_URL_ID, room.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(room)))
            .andExpect(status().isBadRequest());

        // Validate the Room in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRoom() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        room.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(room))
            )
            .andExpect(status().isBadRequest());

        // Validate the Room in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRoom() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        room.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(room)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Room in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRoomWithPatch() throws Exception {
        // Initialize the database
        insertedRoom = roomRepository.saveAndFlush(room);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the room using partial update
        Room partialUpdatedRoom = new Room();
        partialUpdatedRoom.setId(room.getId());

        partialUpdatedRoom.capacity(UPDATED_CAPACITY);

        restRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoom.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRoom))
            )
            .andExpect(status().isOk());

        // Validate the Room in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRoomUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedRoom, room), getPersistedRoom(room));
    }

    @Test
    @Transactional
    void fullUpdateRoomWithPatch() throws Exception {
        // Initialize the database
        insertedRoom = roomRepository.saveAndFlush(room);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the room using partial update
        Room partialUpdatedRoom = new Room();
        partialUpdatedRoom.setId(room.getId());

        partialUpdatedRoom.name(UPDATED_NAME).capacity(UPDATED_CAPACITY);

        restRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoom.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRoom))
            )
            .andExpect(status().isOk());

        // Validate the Room in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRoomUpdatableFieldsEquals(partialUpdatedRoom, getPersistedRoom(partialUpdatedRoom));
    }

    @Test
    @Transactional
    void patchNonExistingRoom() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        room.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoomMockMvc
            .perform(patch(ENTITY_API_URL_ID, room.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(room)))
            .andExpect(status().isBadRequest());

        // Validate the Room in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRoom() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        room.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(room))
            )
            .andExpect(status().isBadRequest());

        // Validate the Room in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRoom() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        room.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoomMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(room)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Room in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRoom() throws Exception {
        // Initialize the database
        insertedRoom = roomRepository.saveAndFlush(room);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the room
        restRoomMockMvc
            .perform(delete(ENTITY_API_URL_ID, room.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return roomRepository.count();
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

    protected Room getPersistedRoom(Room room) {
        return roomRepository.findById(room.getId()).orElseThrow();
    }

    protected void assertPersistedRoomToMatchAllProperties(Room expectedRoom) {
        assertRoomAllPropertiesEquals(expectedRoom, getPersistedRoom(expectedRoom));
    }

    protected void assertPersistedRoomToMatchUpdatableProperties(Room expectedRoom) {
        assertRoomAllUpdatablePropertiesEquals(expectedRoom, getPersistedRoom(expectedRoom));
    }
}
