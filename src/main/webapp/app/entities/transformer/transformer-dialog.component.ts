import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Transformer } from './transformer.model';
import { TransformerPopupService } from './transformer-popup.service';
import { TransformerService } from './transformer.service';

@Component({
    selector: 'jhi-transformer-dialog',
    templateUrl: './transformer-dialog.component.html'
})
export class TransformerDialogComponent implements OnInit {

    transformer: Transformer;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private transformerService: TransformerService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.transformer.id !== undefined) {
            this.subscribeToSaveResponse(
                this.transformerService.update(this.transformer));
        } else {
            this.subscribeToSaveResponse(
                this.transformerService.create(this.transformer));
        }
    }

    private subscribeToSaveResponse(result: Observable<Transformer>) {
        result.subscribe((res: Transformer) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Transformer) {
        this.eventManager.broadcast({ name: 'transformerListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-transformer-popup',
    template: ''
})
export class TransformerPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private transformerPopupService: TransformerPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.transformerPopupService
                    .open(TransformerDialogComponent as Component, params['id']);
            } else {
                this.transformerPopupService
                    .open(TransformerDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
