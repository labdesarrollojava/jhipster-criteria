import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TransformersSharedModule } from '../../shared';
import {
    TransformerService,
    TransformerPopupService,
    TransformerComponent,
    TransformerDetailComponent,
    TransformerDialogComponent,
    TransformerPopupComponent,
    TransformerDeletePopupComponent,
    TransformerDeleteDialogComponent,
    transformerRoute,
    transformerPopupRoute,
    TransformerResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...transformerRoute,
    ...transformerPopupRoute,
];

@NgModule({
    imports: [
        TransformersSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        TransformerComponent,
        TransformerDetailComponent,
        TransformerDialogComponent,
        TransformerDeleteDialogComponent,
        TransformerPopupComponent,
        TransformerDeletePopupComponent,
    ],
    entryComponents: [
        TransformerComponent,
        TransformerDialogComponent,
        TransformerPopupComponent,
        TransformerDeleteDialogComponent,
        TransformerDeletePopupComponent,
    ],
    providers: [
        TransformerService,
        TransformerPopupService,
        TransformerResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransformersTransformerModule {}
