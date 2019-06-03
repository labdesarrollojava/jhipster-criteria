import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Transformer } from 'app/shared/model/transformer.model';
import { TransformerService } from './transformer.service';
import { TransformerComponent } from './transformer.component';
import { TransformerDetailComponent } from './transformer-detail.component';
import { TransformerUpdateComponent } from './transformer-update.component';
import { TransformerDeletePopupComponent } from './transformer-delete-dialog.component';
import { ITransformer } from 'app/shared/model/transformer.model';

@Injectable({ providedIn: 'root' })
export class TransformerResolve implements Resolve<ITransformer> {
  constructor(private service: TransformerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITransformer> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Transformer>) => response.ok),
        map((transformer: HttpResponse<Transformer>) => transformer.body)
      );
    }
    return of(new Transformer());
  }
}

export const transformerRoute: Routes = [
  {
    path: '',
    component: TransformerComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'transformersApp.transformer.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TransformerDetailComponent,
    resolve: {
      transformer: TransformerResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'transformersApp.transformer.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TransformerUpdateComponent,
    resolve: {
      transformer: TransformerResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'transformersApp.transformer.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TransformerUpdateComponent,
    resolve: {
      transformer: TransformerResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'transformersApp.transformer.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const transformerPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: TransformerDeletePopupComponent,
    resolve: {
      transformer: TransformerResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'transformersApp.transformer.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
