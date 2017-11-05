import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { Transformer } from './transformer.model';
import { TransformerService } from './transformer.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-transformer',
    templateUrl: './transformer.component.html'
})
export class TransformerComponent implements OnInit, OnDestroy {

currentAccount: any;
    transformers: Transformer[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    criteria: any;

    constructor(
        private transformerService: TransformerService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.criteria = {
            name: null,
            power: null,
            areSet() {
                return this.name != null || this.power != null
            },
            clear() {
                this.name = null;
                this.power = null;
            }
        }
    }

    loadAll() {

        const criteria = [];

        if (this.criteria.areSet()) {
            if (this.criteria.name != null && this.criteria.name !== '') {
                criteria.push({key: 'name.equals', value: this.criteria.name});
            }
            if (this.criteria.power != null && this.criteria.power >= 0) {
                criteria.push({key: 'power.equals', value: this.criteria.power});
            }
        }

        this.transformerService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            criteria
        }).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/transformer'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate(['/transformer', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.criteria.clear();
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInTransformers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Transformer) {
        return item.id;
    }

    registerChangeInTransformers() {
        this.eventSubscriber = this.eventManager.subscribe('transformerListModification', (response) => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    search(criteria) {
        if (criteria.areSet()) {
            this.loadAll();
        }
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.transformers = data;
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
