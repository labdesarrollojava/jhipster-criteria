import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { TransformerComponent } from './transformer.component';
import { TransformerDetailComponent } from './transformer-detail.component';
import { TransformerPopupComponent } from './transformer-dialog.component';
import { TransformerDeletePopupComponent } from './transformer-delete-dialog.component';

@Injectable()
export class TransformerResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const transformerRoute: Routes = [
    {
        path: 'transformer',
        component: TransformerComponent,
        resolve: {
            'pagingParams': TransformerResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'transformersApp.transformer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'transformer/:id',
        component: TransformerDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'transformersApp.transformer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const transformerPopupRoute: Routes = [
    {
        path: 'transformer-new',
        component: TransformerPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'transformersApp.transformer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'transformer/:id/edit',
        component: TransformerPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'transformersApp.transformer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'transformer/:id/delete',
        component: TransformerDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'transformersApp.transformer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
