import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TransformersSharedModule } from 'app/shared';
import {
  TransformerComponent,
  TransformerDetailComponent,
  TransformerUpdateComponent,
  TransformerDeletePopupComponent,
  TransformerDeleteDialogComponent,
  transformerRoute,
  transformerPopupRoute
} from './';

const ENTITY_STATES = [...transformerRoute, ...transformerPopupRoute];

@NgModule({
  imports: [TransformersSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TransformerComponent,
    TransformerDetailComponent,
    TransformerUpdateComponent,
    TransformerDeleteDialogComponent,
    TransformerDeletePopupComponent
  ],
  entryComponents: [TransformerComponent, TransformerUpdateComponent, TransformerDeleteDialogComponent, TransformerDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransformersTransformerModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
