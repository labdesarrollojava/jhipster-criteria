/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TransformerComponentsPage, TransformerDeleteDialog, TransformerUpdatePage } from './transformer.page-object';

const expect = chai.expect;

describe('Transformer e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let transformerUpdatePage: TransformerUpdatePage;
  let transformerComponentsPage: TransformerComponentsPage;
  let transformerDeleteDialog: TransformerDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Transformers', async () => {
    await navBarPage.goToEntity('transformer');
    transformerComponentsPage = new TransformerComponentsPage();
    await browser.wait(ec.visibilityOf(transformerComponentsPage.title), 5000);
    expect(await transformerComponentsPage.getTitle()).to.eq('transformersApp.transformer.home.title');
  });

  it('should load create Transformer page', async () => {
    await transformerComponentsPage.clickOnCreateButton();
    transformerUpdatePage = new TransformerUpdatePage();
    expect(await transformerUpdatePage.getPageTitle()).to.eq('transformersApp.transformer.home.createOrEditLabel');
    await transformerUpdatePage.cancel();
  });

  it('should create and save Transformers', async () => {
    const nbButtonsBeforeCreate = await transformerComponentsPage.countDeleteButtons();

    await transformerComponentsPage.clickOnCreateButton();
    await promise.all([transformerUpdatePage.setNameInput('name'), transformerUpdatePage.setPowerInput('5')]);
    expect(await transformerUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await transformerUpdatePage.getPowerInput()).to.eq('5', 'Expected power value to be equals to 5');
    await transformerUpdatePage.save();
    expect(await transformerUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await transformerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Transformer', async () => {
    const nbButtonsBeforeDelete = await transformerComponentsPage.countDeleteButtons();
    await transformerComponentsPage.clickOnLastDeleteButton();

    transformerDeleteDialog = new TransformerDeleteDialog();
    expect(await transformerDeleteDialog.getDialogTitle()).to.eq('transformersApp.transformer.delete.question');
    await transformerDeleteDialog.clickOnConfirmButton();

    expect(await transformerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
