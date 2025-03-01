package de.xares.conference.service;

import de.xares.conference.domain.Talk;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link de.xares.conference.domain.Talk}.
 */
public interface TalkService {
    /**
     * Save a talk.
     *
     * @param talk the entity to save.
     * @return the persisted entity.
     */
    Talk save(Talk talk);

    /**
     * Updates a talk.
     *
     * @param talk the entity to update.
     * @return the persisted entity.
     */
    Talk update(Talk talk);

    /**
     * Partially updates a talk.
     *
     * @param talk the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Talk> partialUpdate(Talk talk);

    /**
     * Get all the talks.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Talk> findAll(Pageable pageable);

    /**
     * Get all the talks with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Talk> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" talk.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Talk> findOne(Long id);

    /**
     * Delete the "id" talk.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
