package com.imperfectclone.transformers.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.imperfectclone.transformers.domain.Transformer;
import com.imperfectclone.transformers.service.TransformerService;
import com.imperfectclone.transformers.web.rest.errors.BadRequestAlertException;
import com.imperfectclone.transformers.web.rest.util.HeaderUtil;
import com.imperfectclone.transformers.web.rest.util.PaginationUtil;
import com.imperfectclone.transformers.service.dto.TransformerCriteria;
import com.imperfectclone.transformers.service.TransformerQueryService;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Transformer.
 */
@RestController
@RequestMapping("/api")
public class TransformerResource {

    private final Logger log = LoggerFactory.getLogger(TransformerResource.class);

    private static final String ENTITY_NAME = "transformer";

    private final TransformerService transformerService;

    private final TransformerQueryService transformerQueryService;

    public TransformerResource(TransformerService transformerService, TransformerQueryService transformerQueryService) {
        this.transformerService = transformerService;
        this.transformerQueryService = transformerQueryService;
    }

    /**
     * POST  /transformers : Create a new transformer.
     *
     * @param transformer the transformer to create
     * @return the ResponseEntity with status 201 (Created) and with body the new transformer, or with status 400 (Bad Request) if the transformer has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/transformers")
    @Timed
    public ResponseEntity<Transformer> createTransformer(@Valid @RequestBody Transformer transformer) throws URISyntaxException {
        log.debug("REST request to save Transformer : {}", transformer);
        if (transformer.getId() != null) {
            throw new BadRequestAlertException("A new transformer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Transformer result = transformerService.save(transformer);
        return ResponseEntity.created(new URI("/api/transformers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /transformers : Updates an existing transformer.
     *
     * @param transformer the transformer to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated transformer,
     * or with status 400 (Bad Request) if the transformer is not valid,
     * or with status 500 (Internal Server Error) if the transformer couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/transformers")
    @Timed
    public ResponseEntity<Transformer> updateTransformer(@Valid @RequestBody Transformer transformer) throws URISyntaxException {
        log.debug("REST request to update Transformer : {}", transformer);
        if (transformer.getId() == null) {
            return createTransformer(transformer);
        }
        Transformer result = transformerService.save(transformer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, transformer.getId().toString()))
            .body(result);
    }

    /**
     * GET  /transformers : get all the transformers.
     *
     * @param pageable the pagination information
     * @param criteria the criterias which the requested entities should match
     * @return the ResponseEntity with status 200 (OK) and the list of transformers in body
     */
    @GetMapping("/transformers")
    @Timed
    public ResponseEntity<List<Transformer>> getAllTransformers(TransformerCriteria criteria,@ApiParam Pageable pageable) {
        log.debug("REST request to get Transformers by criteria: {}", criteria);
        Page<Transformer> page = transformerQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/transformers");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /transformers/:id : get the "id" transformer.
     *
     * @param id the id of the transformer to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the transformer, or with status 404 (Not Found)
     */
    @GetMapping("/transformers/{id}")
    @Timed
    public ResponseEntity<Transformer> getTransformer(@PathVariable Long id) {
        log.debug("REST request to get Transformer : {}", id);
        Transformer transformer = transformerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(transformer));
    }

    /**
     * DELETE  /transformers/:id : delete the "id" transformer.
     *
     * @param id the id of the transformer to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/transformers/{id}")
    @Timed
    public ResponseEntity<Void> deleteTransformer(@PathVariable Long id) {
        log.debug("REST request to delete Transformer : {}", id);
        transformerService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
