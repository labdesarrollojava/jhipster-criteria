package com.imperfectclone.transformers.repository;

import com.imperfectclone.transformers.domain.Transformer;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Transformer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TransformerRepository extends JpaRepository<Transformer, Long>, JpaSpecificationExecutor<Transformer> {

}
