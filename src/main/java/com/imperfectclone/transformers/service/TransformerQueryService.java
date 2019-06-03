package com.imperfectclone.transformers.service;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specifications;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.jhipster.service.QueryService;

import com.imperfectclone.transformers.domain.Transformer;
import com.imperfectclone.transformers.domain.*; // for static metamodels
import com.imperfectclone.transformers.repository.TransformerRepository;
import com.imperfectclone.transformers.service.dto.TransformerCriteria;


/**
 * Service for executing complex queries for Transformer entities in the database.
 * The main input is a {@link TransformerCriteria} which get's converted to {@link Specifications},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {%link Transformer} or a {@link Page} of {%link Transformer} which fulfills the criterias
 */
@Service
@Transactional(readOnly = true)
public class TransformerQueryService extends QueryService<Transformer> {

    private final Logger log = LoggerFactory.getLogger(TransformerQueryService.class);


    private final TransformerRepository transformerRepository;

    public TransformerQueryService(TransformerRepository transformerRepository) {
        this.transformerRepository = transformerRepository;
    }

    /**
     * Return a {@link List} of {%link Transformer} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Transformer> findByCriteria(TransformerCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specifications<Transformer> specification = createSpecification(criteria);
        return transformerRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {%link Transformer} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Transformer> findByCriteria(TransformerCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specifications<Transformer> specification = createSpecification(criteria);
        return transformerRepository.findAll(specification, page);
    }

    /**
     * Function to convert TransformerCriteria to a {@link Specifications}
     */
    private Specifications<Transformer> createSpecification(TransformerCriteria criteria) {
        Specifications<Transformer> specification = Specifications.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), Transformer_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), Transformer_.name));
            }
            if (criteria.getPower() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getPower(), Transformer_.power));
            }
        }
        return specification;
    }

}
