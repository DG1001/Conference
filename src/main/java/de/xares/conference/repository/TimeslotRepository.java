package de.xares.conference.repository;

import de.xares.conference.domain.Timeslot;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Timeslot entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimeslotRepository extends JpaRepository<Timeslot, Long> {}
