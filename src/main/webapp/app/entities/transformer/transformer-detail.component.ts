import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Transformer } from './transformer.model';
import { TransformerService } from './transformer.service';

@Component({
    selector: 'jhi-transformer-detail',
    templateUrl: './transformer-detail.component.html'
})
export class TransformerDetailComponent implements OnInit, OnDestroy {

    transformer: Transformer;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private transformerService: TransformerService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTransformers();
    }

    load(id) {
        this.transformerService.find(id).subscribe((transformer) => {
            this.transformer = transformer;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTransformers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'transformerListModification',
            (response) => this.load(this.transformer.id)
        );
    }
}
