package com.imperfectclone.transformers.service;

import com.imperfectclone.transformers.domain.Transformer;
import com.imperfectclone.transformers.repository.TransformerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Transformer}.
 */
@Service
@Transactional
public class TransformerService {

    private final Logger log = LoggerFactory.getLogger(TransformerService.class);

    private final TransformerRepository transformerRepository;

    public TransformerService(TransformerRepository transformerRepository) {
        this.transformerRepository = transformerRepository;
    }

    /**
     * Save a transformer.
     *
     * @param transformer the entity to save.
     * @return the persisted entity.
     */
    public Transformer save(Transformer transformer) {
        log.debug("Request to save Transformer : {}", transformer);
        return transformerRepository.save(transformer);
    }

    /**
     * Get all the transformers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Transformer> findAll(Pageable pageable) {
        log.debug("Request to get all Transformers");
        return transformerRepository.findAll(pageable);
    }


    /**
     * Get one transformer by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Transformer> findOne(Long id) {
        log.debug("Request to get Transformer : {}", id);
        return transformerRepository.findById(id);
    }

    /**
     * Delete the transformer by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Transformer : {}", id);
        transformerRepository.deleteById(id);
    }
}
