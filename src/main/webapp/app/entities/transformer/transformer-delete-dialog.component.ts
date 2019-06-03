import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITransformer } from 'app/shared/model/transformer.model';
import { TransformerService } from './transformer.service';

@Component({
  selector: 'jhi-transformer-delete-dialog',
  templateUrl: './transformer-delete-dialog.component.html'
})
export class TransformerDeleteDialogComponent {
  transformer: ITransformer;

  constructor(
    protected transformerService: TransformerService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.transformerService.delete(id).subscribe(response => {
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
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ transformer }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(TransformerDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.transformer = transformer;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/transformer', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/transformer', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
