import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Transformer } from './transformer.model';
import { TransformerPopupService } from './transformer-popup.service';
import { TransformerService } from './transformer.service';

@Component({
    selector: 'jhi-transformer-delete-dialog',
    templateUrl: './transformer-delete-dialog.component.html'
})
export class TransformerDeleteDialogComponent {

    transformer: Transformer;

    constructor(
        private transformerService: TransformerService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.transformerService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'transformerListModification',
                content: 'Deleted an transformer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-transformer-delete-popup',
    template: ''
})
export class TransformerDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private transformerPopupService: TransformerPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.transformerPopupService
                .open(TransformerDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
