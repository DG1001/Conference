package de.xares.conference.service;

import de.xares.conference.domain.Timeslot;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link de.xares.conference.domain.Timeslot}.
 */
public interface TimeslotService {
    /**
     * Save a timeslot.
     *
     * @param timeslot the entity to save.
     * @return the persisted entity.
     */
    Timeslot save(Timeslot timeslot);

    /**
     * Updates a timeslot.
     *
     * @param timeslot the entity to update.
     * @return the persisted entity.
     */
    Timeslot update(Timeslot timeslot);

    /**
     * Partially updates a timeslot.
     *
     * @param timeslot the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Timeslot> partialUpdate(Timeslot timeslot);

    /**
     * Get all the timeslots.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Timeslot> findAll(Pageable pageable);

    /**
     * Get the "id" timeslot.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Timeslot> findOne(Long id);

    /**
     * Delete the "id" timeslot.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
