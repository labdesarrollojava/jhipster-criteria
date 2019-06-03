import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITransformer } from 'app/shared/model/transformer.model';

type EntityResponseType = HttpResponse<ITransformer>;
type EntityArrayResponseType = HttpResponse<ITransformer[]>;

@Injectable({ providedIn: 'root' })
export class TransformerService {
  public resourceUrl = SERVER_API_URL + 'api/transformers';

  constructor(protected http: HttpClient) {}

  create(transformer: ITransformer): Observable<EntityResponseType> {
    return this.http.post<ITransformer>(this.resourceUrl, transformer, { observe: 'response' });
  }

  update(transformer: ITransformer): Observable<EntityResponseType> {
    return this.http.put<ITransformer>(this.resourceUrl, transformer, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITransformer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITransformer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
