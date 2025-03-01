package de.xares.conference.web.rest;

import de.xares.conference.domain.Talk;
import de.xares.conference.repository.TalkRepository;
import de.xares.conference.service.TalkService;
import de.xares.conference.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link de.xares.conference.domain.Talk}.
 */
@RestController
@RequestMapping("/api/talks")
public class TalkResource {

    private static final Logger LOG = LoggerFactory.getLogger(TalkResource.class);

    private static final String ENTITY_NAME = "talk";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TalkService talkService;

    private final TalkRepository talkRepository;

    public TalkResource(TalkService talkService, TalkRepository talkRepository) {
        this.talkService = talkService;
        this.talkRepository = talkRepository;
    }

    /**
     * {@code POST  /talks} : Create a new talk.
     *
     * @param talk the talk to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new talk, or with status {@code 400 (Bad Request)} if the talk has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Talk> createTalk(@Valid @RequestBody Talk talk) throws URISyntaxException {
        LOG.debug("REST request to save Talk : {}", talk);
        if (talk.getId() != null) {
            throw new BadRequestAlertException("A new talk cannot already have an ID", ENTITY_NAME, "idexists");
        }
        talk = talkService.save(talk);
        return ResponseEntity.created(new URI("/api/talks/" + talk.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, talk.getId().toString()))
            .body(talk);
    }

    /**
     * {@code PUT  /talks/:id} : Updates an existing talk.
     *
     * @param id the id of the talk to save.
     * @param talk the talk to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated talk,
     * or with status {@code 400 (Bad Request)} if the talk is not valid,
     * or with status {@code 500 (Internal Server Error)} if the talk couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Talk> updateTalk(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Talk talk)
        throws URISyntaxException {
        LOG.debug("REST request to update Talk : {}, {}", id, talk);
        if (talk.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, talk.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!talkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        talk = talkService.update(talk);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, talk.getId().toString()))
            .body(talk);
    }

    /**
     * {@code PATCH  /talks/:id} : Partial updates given fields of an existing talk, field will ignore if it is null
     *
     * @param id the id of the talk to save.
     * @param talk the talk to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated talk,
     * or with status {@code 400 (Bad Request)} if the talk is not valid,
     * or with status {@code 404 (Not Found)} if the talk is not found,
     * or with status {@code 500 (Internal Server Error)} if the talk couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Talk> partialUpdateTalk(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Talk talk
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Talk partially : {}, {}", id, talk);
        if (talk.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, talk.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!talkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Talk> result = talkService.partialUpdate(talk);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, talk.getId().toString())
        );
    }

    /**
     * {@code GET  /talks} : get all the talks.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of talks in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Talk>> getAllTalks(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Talks");
        Page<Talk> page;
        if (eagerload) {
            page = talkService.findAllWithEagerRelationships(pageable);
        } else {
            page = talkService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /talks/:id} : get the "id" talk.
     *
     * @param id the id of the talk to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the talk, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Talk> getTalk(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Talk : {}", id);
        Optional<Talk> talk = talkService.findOne(id);
        return ResponseUtil.wrapOrNotFound(talk);
    }

    /**
     * {@code DELETE  /talks/:id} : delete the "id" talk.
     *
     * @param id the id of the talk to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTalk(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Talk : {}", id);
        talkService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
