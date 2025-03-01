package de.xares.conference.service.impl;

import de.xares.conference.domain.Talk;
import de.xares.conference.repository.TalkRepository;
import de.xares.conference.service.TalkService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link de.xares.conference.domain.Talk}.
 */
@Service
@Transactional
public class TalkServiceImpl implements TalkService {

    private static final Logger LOG = LoggerFactory.getLogger(TalkServiceImpl.class);

    private final TalkRepository talkRepository;

    public TalkServiceImpl(TalkRepository talkRepository) {
        this.talkRepository = talkRepository;
    }

    @Override
    public Talk save(Talk talk) {
        LOG.debug("Request to save Talk : {}", talk);
        return talkRepository.save(talk);
    }

    @Override
    public Talk update(Talk talk) {
        LOG.debug("Request to update Talk : {}", talk);
        return talkRepository.save(talk);
    }

    @Override
    public Optional<Talk> partialUpdate(Talk talk) {
        LOG.debug("Request to partially update Talk : {}", talk);

        return talkRepository
            .findById(talk.getId())
            .map(existingTalk -> {
                if (talk.getTitle() != null) {
                    existingTalk.setTitle(talk.getTitle());
                }
                if (talk.getSpeaker() != null) {
                    existingTalk.setSpeaker(talk.getSpeaker());
                }
                if (talk.getAbstractText() != null) {
                    existingTalk.setAbstractText(talk.getAbstractText());
                }

                return existingTalk;
            })
            .map(talkRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Talk> findAll(Pageable pageable) {
        LOG.debug("Request to get all Talks");
        return talkRepository.findAll(pageable);
    }

    public Page<Talk> findAllWithEagerRelationships(Pageable pageable) {
        return talkRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Talk> findOne(Long id) {
        LOG.debug("Request to get Talk : {}", id);
        return talkRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Talk : {}", id);
        talkRepository.deleteById(id);
    }
}
