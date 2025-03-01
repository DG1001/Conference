package de.xares.conference.service.impl;

import de.xares.conference.domain.Timeslot;
import de.xares.conference.repository.TimeslotRepository;
import de.xares.conference.service.TimeslotService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link de.xares.conference.domain.Timeslot}.
 */
@Service
@Transactional
public class TimeslotServiceImpl implements TimeslotService {

    private static final Logger LOG = LoggerFactory.getLogger(TimeslotServiceImpl.class);

    private final TimeslotRepository timeslotRepository;

    public TimeslotServiceImpl(TimeslotRepository timeslotRepository) {
        this.timeslotRepository = timeslotRepository;
    }

    @Override
    public Timeslot save(Timeslot timeslot) {
        LOG.debug("Request to save Timeslot : {}", timeslot);
        return timeslotRepository.save(timeslot);
    }

    @Override
    public Timeslot update(Timeslot timeslot) {
        LOG.debug("Request to update Timeslot : {}", timeslot);
        return timeslotRepository.save(timeslot);
    }

    @Override
    public Optional<Timeslot> partialUpdate(Timeslot timeslot) {
        LOG.debug("Request to partially update Timeslot : {}", timeslot);

        return timeslotRepository
            .findById(timeslot.getId())
            .map(existingTimeslot -> {
                if (timeslot.getStart() != null) {
                    existingTimeslot.setStart(timeslot.getStart());
                }
                if (timeslot.getEnd() != null) {
                    existingTimeslot.setEnd(timeslot.getEnd());
                }

                return existingTimeslot;
            })
            .map(timeslotRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Timeslot> findAll(Pageable pageable) {
        LOG.debug("Request to get all Timeslots");
        return timeslotRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Timeslot> findOne(Long id) {
        LOG.debug("Request to get Timeslot : {}", id);
        return timeslotRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Timeslot : {}", id);
        timeslotRepository.deleteById(id);
    }
}
