package com.imperfectclone.transformers.web.rest;

import com.imperfectclone.transformers.domain.Transformer;
import com.imperfectclone.transformers.service.TransformerService;
import com.imperfectclone.transformers.web.rest.errors.BadRequestAlertException;
import com.imperfectclone.transformers.service.dto.TransformerCriteria;
import com.imperfectclone.transformers.service.TransformerQueryService;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.imperfectclone.transformers.domain.Transformer}.
 */
@RestController
@RequestMapping("/api")
public class TransformerResource {

    private final Logger log = LoggerFactory.getLogger(TransformerResource.class);

    private static final String ENTITY_NAME = "transformer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TransformerService transformerService;

    private final TransformerQueryService transformerQueryService;

    public TransformerResource(TransformerService transformerService, TransformerQueryService transformerQueryService) {
        this.transformerService = transformerService;
        this.transformerQueryService = transformerQueryService;
    }

    /**
     * {@code POST  /transformers} : Create a new transformer.
     *
     * @param transformer the transformer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new transformer, or with status {@code 400 (Bad Request)} if the transformer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/transformers")
    public ResponseEntity<Transformer> createTransformer(@Valid @RequestBody Transformer transformer) throws URISyntaxException {
        log.debug("REST request to save Transformer : {}", transformer);
        if (transformer.getId() != null) {
            throw new BadRequestAlertException("A new transformer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Transformer result = transformerService.save(transformer);
        return ResponseEntity.created(new URI("/api/transformers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /transformers} : Updates an existing transformer.
     *
     * @param transformer the transformer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated transformer,
     * or with status {@code 400 (Bad Request)} if the transformer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the transformer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/transformers")
    public ResponseEntity<Transformer> updateTransformer(@Valid @RequestBody Transformer transformer) throws URISyntaxException {
        log.debug("REST request to update Transformer : {}", transformer);
        if (transformer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Transformer result = transformerService.save(transformer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, transformer.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /transformers} : get all the transformers.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of transformers in body.
     */
    @GetMapping("/transformers")
    public ResponseEntity<List<Transformer>> getAllTransformers(TransformerCriteria criteria, Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to get Transformers by criteria: {}", criteria);
        Page<Transformer> page = transformerQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
    * {@code GET  /transformers/count} : count all the transformers.
    *
    * @param criteria the criteria which the requested entities should match.
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
    */
    @GetMapping("/transformers/count")
    public ResponseEntity<Long> countTransformers(TransformerCriteria criteria) {
        log.debug("REST request to count Transformers by criteria: {}", criteria);
        return ResponseEntity.ok().body(transformerQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /transformers/:id} : get the "id" transformer.
     *
     * @param id the id of the transformer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the transformer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/transformers/{id}")
    public ResponseEntity<Transformer> getTransformer(@PathVariable Long id) {
        log.debug("REST request to get Transformer : {}", id);
        Optional<Transformer> transformer = transformerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(transformer);
    }

    /**
     * {@code DELETE  /transformers/:id} : delete the "id" transformer.
     *
     * @param id the id of the transformer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/transformers/{id}")
    public ResponseEntity<Void> deleteTransformer(@PathVariable Long id) {
        log.debug("REST request to delete Transformer : {}", id);
        transformerService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
