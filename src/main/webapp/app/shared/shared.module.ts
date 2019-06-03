import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TransformersSharedLibsModule, TransformersSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [TransformersSharedLibsModule, TransformersSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [TransformersSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransformersSharedModule {
  static forRoot() {
    return {
      ngModule: TransformersSharedModule
    };
  }
}
