package com.imperfectclone.transformers.repository;

import com.imperfectclone.transformers.domain.Transformer;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Transformer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TransformerRepository extends JpaRepository<Transformer, Long>, JpaSpecificationExecutor<Transformer> {

}
