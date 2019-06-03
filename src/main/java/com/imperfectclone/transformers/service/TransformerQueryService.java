package com.imperfectclone.transformers.service;

import java.util.List;

import javax.persistence.criteria.JoinType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.jhipster.service.QueryService;

import com.imperfectclone.transformers.domain.Transformer;
import com.imperfectclone.transformers.domain.*; // for static metamodels
import com.imperfectclone.transformers.repository.TransformerRepository;
import com.imperfectclone.transformers.service.dto.TransformerCriteria;

/**
 * Service for executing complex queries for {@link Transformer} entities in the database.
 * The main input is a {@link TransformerCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Transformer} or a {@link Page} of {@link Transformer} which fulfills the criteria.
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
     * Return a {@link List} of {@link Transformer} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Transformer> findByCriteria(TransformerCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Transformer> specification = createSpecification(criteria);
        return transformerRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Transformer} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Transformer> findByCriteria(TransformerCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Transformer> specification = createSpecification(criteria);
        return transformerRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(TransformerCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Transformer> specification = createSpecification(criteria);
        return transformerRepository.count(specification);
    }

    /**
     * Function to convert TransformerCriteria to a {@link Specification}.
     */
    private Specification<Transformer> createSpecification(TransformerCriteria criteria) {
        Specification<Transformer> specification = Specification.where(null);
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
