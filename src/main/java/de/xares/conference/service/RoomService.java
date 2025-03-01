package de.xares.conference.service;

import de.xares.conference.domain.Room;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link de.xares.conference.domain.Room}.
 */
public interface RoomService {
    /**
     * Save a room.
     *
     * @param room the entity to save.
     * @return the persisted entity.
     */
    Room save(Room room);

    /**
     * Updates a room.
     *
     * @param room the entity to update.
     * @return the persisted entity.
     */
    Room update(Room room);

    /**
     * Partially updates a room.
     *
     * @param room the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Room> partialUpdate(Room room);

    /**
     * Get all the rooms.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Room> findAll(Pageable pageable);

    /**
     * Get the "id" room.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Room> findOne(Long id);

    /**
     * Delete the "id" room.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
