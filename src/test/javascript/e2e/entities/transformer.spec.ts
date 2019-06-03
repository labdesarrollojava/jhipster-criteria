import { browser, element, by, $ } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
const path = require('path');

describe('Transformer e2e test', () => {

    let navBarPage: NavBarPage;
    let transformerDialogPage: TransformerDialogPage;
    let transformerComponentsPage: TransformerComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Transformers', () => {
        navBarPage.goToEntity('transformer');
        transformerComponentsPage = new TransformerComponentsPage();
        expect(transformerComponentsPage.getTitle()).toMatch(/transformersApp.transformer.home.title/);

    });

    it('should load create Transformer dialog', () => {
        transformerComponentsPage.clickOnCreateButton();
        transformerDialogPage = new TransformerDialogPage();
        expect(transformerDialogPage.getModalTitle()).toMatch(/transformersApp.transformer.home.createOrEditLabel/);
        transformerDialogPage.close();
    });

    it('should create and save Transformers', () => {
        transformerComponentsPage.clickOnCreateButton();
        transformerDialogPage.setNameInput('name');
        expect(transformerDialogPage.getNameInput()).toMatch('name');
        transformerDialogPage.setPowerInput('5');
        expect(transformerDialogPage.getPowerInput()).toMatch('5');
        transformerDialogPage.save();
        expect(transformerDialogPage.getSaveButton().isPresent()).toBeFalsy();
    }); 

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class TransformerComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-transformer div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class TransformerDialogPage {
    modalTitle = element(by.css('h4#myTransformerLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    powerInput = element(by.css('input#field_power'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function (name) {
        this.nameInput.sendKeys(name);
    }

    getNameInput = function () {
        return this.nameInput.getAttribute('value');
    }

    setPowerInput = function (power) {
        this.powerInput.sendKeys(power);
    }

    getPowerInput = function () {
        return this.powerInput.getAttribute('value');
    }

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
