package com.imperfectclone.transformers.web.rest;

import com.imperfectclone.transformers.TransformersApp;

import com.imperfectclone.transformers.domain.Transformer;
import com.imperfectclone.transformers.repository.TransformerRepository;
import com.imperfectclone.transformers.service.TransformerService;
import com.imperfectclone.transformers.web.rest.errors.ExceptionTranslator;
import com.imperfectclone.transformers.service.dto.TransformerCriteria;
import com.imperfectclone.transformers.service.TransformerQueryService;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.imperfectclone.transformers.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TransformerResource REST controller.
 *
 * @see TransformerResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TransformersApp.class)
public class TransformerResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_POWER = 0;
    private static final Integer UPDATED_POWER = 1;

    @Autowired
    private TransformerRepository transformerRepository;

    @Autowired
    private TransformerService transformerService;

    @Autowired
    private TransformerQueryService transformerQueryService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTransformerMockMvc;

    private Transformer transformer;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TransformerResource transformerResource = new TransformerResource(transformerService, transformerQueryService);
        this.restTransformerMockMvc = MockMvcBuilders.standaloneSetup(transformerResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transformer createEntity(EntityManager em) {
        Transformer transformer = new Transformer()
            .name(DEFAULT_NAME)
            .power(DEFAULT_POWER);
        return transformer;
    }

    @Before
    public void initTest() {
        transformer = createEntity(em);
    }

    @Test
    @Transactional
    public void createTransformer() throws Exception {
        int databaseSizeBeforeCreate = transformerRepository.findAll().size();

        // Create the Transformer
        restTransformerMockMvc.perform(post("/api/transformers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transformer)))
            .andExpect(status().isCreated());

        // Validate the Transformer in the database
        List<Transformer> transformerList = transformerRepository.findAll();
        assertThat(transformerList).hasSize(databaseSizeBeforeCreate + 1);
        Transformer testTransformer = transformerList.get(transformerList.size() - 1);
        assertThat(testTransformer.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTransformer.getPower()).isEqualTo(DEFAULT_POWER);
    }

    @Test
    @Transactional
    public void createTransformerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = transformerRepository.findAll().size();

        // Create the Transformer with an existing ID
        transformer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransformerMockMvc.perform(post("/api/transformers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transformer)))
            .andExpect(status().isBadRequest());

        // Validate the Transformer in the database
        List<Transformer> transformerList = transformerRepository.findAll();
        assertThat(transformerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = transformerRepository.findAll().size();
        // set the field null
        transformer.setName(null);

        // Create the Transformer, which fails.

        restTransformerMockMvc.perform(post("/api/transformers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transformer)))
            .andExpect(status().isBadRequest());

        List<Transformer> transformerList = transformerRepository.findAll();
        assertThat(transformerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPowerIsRequired() throws Exception {
        int databaseSizeBeforeTest = transformerRepository.findAll().size();
        // set the field null
        transformer.setPower(null);

        // Create the Transformer, which fails.

        restTransformerMockMvc.perform(post("/api/transformers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transformer)))
            .andExpect(status().isBadRequest());

        List<Transformer> transformerList = transformerRepository.findAll();
        assertThat(transformerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTransformers() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get all the transformerList
        restTransformerMockMvc.perform(get("/api/transformers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transformer.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].power").value(hasItem(DEFAULT_POWER)));
    }

    @Test
    @Transactional
    public void getTransformer() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get the transformer
        restTransformerMockMvc.perform(get("/api/transformers/{id}", transformer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(transformer.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.power").value(DEFAULT_POWER));
    }

    @Test
    @Transactional
    public void getAllTransformersByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get all the transformerList where name equals to DEFAULT_NAME
        defaultTransformerShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the transformerList where name equals to UPDATED_NAME
        defaultTransformerShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    public void getAllTransformersByNameIsInShouldWork() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get all the transformerList where name in DEFAULT_NAME or UPDATED_NAME
        defaultTransformerShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the transformerList where name equals to UPDATED_NAME
        defaultTransformerShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    public void getAllTransformersByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get all the transformerList where name is not null
        defaultTransformerShouldBeFound("name.specified=true");

        // Get all the transformerList where name is null
        defaultTransformerShouldNotBeFound("name.specified=false");
    }

    @Test
    @Transactional
    public void getAllTransformersByPowerIsEqualToSomething() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get all the transformerList where power equals to DEFAULT_POWER
        defaultTransformerShouldBeFound("power.equals=" + DEFAULT_POWER);

        // Get all the transformerList where power equals to UPDATED_POWER
        defaultTransformerShouldNotBeFound("power.equals=" + UPDATED_POWER);
    }

    @Test
    @Transactional
    public void getAllTransformersByPowerIsInShouldWork() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get all the transformerList where power in DEFAULT_POWER or UPDATED_POWER
        defaultTransformerShouldBeFound("power.in=" + DEFAULT_POWER + "," + UPDATED_POWER);

        // Get all the transformerList where power equals to UPDATED_POWER
        defaultTransformerShouldNotBeFound("power.in=" + UPDATED_POWER);
    }

    @Test
    @Transactional
    public void getAllTransformersByPowerIsNullOrNotNull() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get all the transformerList where power is not null
        defaultTransformerShouldBeFound("power.specified=true");

        // Get all the transformerList where power is null
        defaultTransformerShouldNotBeFound("power.specified=false");
    }

    @Test
    @Transactional
    public void getAllTransformersByPowerIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get all the transformerList where power greater than or equals to DEFAULT_POWER
        defaultTransformerShouldBeFound("power.greaterOrEqualThan=" + DEFAULT_POWER);

        // Get all the transformerList where power greater than or equals to UPDATED_POWER
        defaultTransformerShouldNotBeFound("power.greaterOrEqualThan=" + UPDATED_POWER);
    }

    @Test
    @Transactional
    public void getAllTransformersByPowerIsLessThanSomething() throws Exception {
        // Initialize the database
        transformerRepository.saveAndFlush(transformer);

        // Get all the transformerList where power less than or equals to DEFAULT_POWER
        defaultTransformerShouldNotBeFound("power.lessThan=" + DEFAULT_POWER);

        // Get all the transformerList where power less than or equals to UPDATED_POWER
        defaultTransformerShouldBeFound("power.lessThan=" + UPDATED_POWER);
    }

    /**
     * Executes the search, and checks that the default entity is returned
     */
    private void defaultTransformerShouldBeFound(String filter) throws Exception {
        restTransformerMockMvc.perform(get("/api/transformers?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transformer.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].power").value(hasItem(DEFAULT_POWER)));
    }

    /**
     * Executes the search, and checks that the default entity is not returned
     */
    private void defaultTransformerShouldNotBeFound(String filter) throws Exception {
        restTransformerMockMvc.perform(get("/api/transformers?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
    }


    @Test
    @Transactional
    public void getNonExistingTransformer() throws Exception {
        // Get the transformer
        restTransformerMockMvc.perform(get("/api/transformers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTransformer() throws Exception {
        // Initialize the database
        transformerService.save(transformer);

        int databaseSizeBeforeUpdate = transformerRepository.findAll().size();

        // Update the transformer
        Transformer updatedTransformer = transformerRepository.findOne(transformer.getId());
        updatedTransformer
            .name(UPDATED_NAME)
            .power(UPDATED_POWER);

        restTransformerMockMvc.perform(put("/api/transformers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTransformer)))
            .andExpect(status().isOk());

        // Validate the Transformer in the database
        List<Transformer> transformerList = transformerRepository.findAll();
        assertThat(transformerList).hasSize(databaseSizeBeforeUpdate);
        Transformer testTransformer = transformerList.get(transformerList.size() - 1);
        assertThat(testTransformer.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTransformer.getPower()).isEqualTo(UPDATED_POWER);
    }

    @Test
    @Transactional
    public void updateNonExistingTransformer() throws Exception {
        int databaseSizeBeforeUpdate = transformerRepository.findAll().size();

        // Create the Transformer

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTransformerMockMvc.perform(put("/api/transformers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transformer)))
            .andExpect(status().isCreated());

        // Validate the Transformer in the database
        List<Transformer> transformerList = transformerRepository.findAll();
        assertThat(transformerList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteTransformer() throws Exception {
        // Initialize the database
        transformerService.save(transformer);

        int databaseSizeBeforeDelete = transformerRepository.findAll().size();

        // Get the transformer
        restTransformerMockMvc.perform(delete("/api/transformers/{id}", transformer.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Transformer> transformerList = transformerRepository.findAll();
        assertThat(transformerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Transformer.class);
        Transformer transformer1 = new Transformer();
        transformer1.setId(1L);
        Transformer transformer2 = new Transformer();
        transformer2.setId(transformer1.getId());
        assertThat(transformer1).isEqualTo(transformer2);
        transformer2.setId(2L);
        assertThat(transformer1).isNotEqualTo(transformer2);
        transformer1.setId(null);
        assertThat(transformer1).isNotEqualTo(transformer2);
    }
}
