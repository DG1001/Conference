package de.xares.conference.service.impl;

import de.xares.conference.domain.Room;
import de.xares.conference.repository.RoomRepository;
import de.xares.conference.service.RoomService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link de.xares.conference.domain.Room}.
 */
@Service
@Transactional
public class RoomServiceImpl implements RoomService {

    private static final Logger LOG = LoggerFactory.getLogger(RoomServiceImpl.class);

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public Room save(Room room) {
        LOG.debug("Request to save Room : {}", room);
        return roomRepository.save(room);
    }

    @Override
    public Room update(Room room) {
        LOG.debug("Request to update Room : {}", room);
        return roomRepository.save(room);
    }

    @Override
    public Optional<Room> partialUpdate(Room room) {
        LOG.debug("Request to partially update Room : {}", room);

        return roomRepository
            .findById(room.getId())
            .map(existingRoom -> {
                if (room.getName() != null) {
                    existingRoom.setName(room.getName());
                }
                if (room.getCapacity() != null) {
                    existingRoom.setCapacity(room.getCapacity());
                }

                return existingRoom;
            })
            .map(roomRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Room> findAll(Pageable pageable) {
        LOG.debug("Request to get all Rooms");
        return roomRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Room> findOne(Long id) {
        LOG.debug("Request to get Room : {}", id);
        return roomRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Room : {}", id);
        roomRepository.deleteById(id);
    }
}
