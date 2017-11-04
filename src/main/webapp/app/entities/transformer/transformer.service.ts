import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Transformer } from './transformer.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class TransformerService {

    private resourceUrl = SERVER_API_URL + 'api/transformers';

    constructor(private http: Http) { }

    create(transformer: Transformer): Observable<Transformer> {
        const copy = this.convert(transformer);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(transformer: Transformer): Observable<Transformer> {
        const copy = this.convert(transformer);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Transformer> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Transformer.
     */
    private convertItemFromServer(json: any): Transformer {
        const entity: Transformer = Object.assign(new Transformer(), json);
        return entity;
    }

    /**
     * Convert a Transformer to a JSON which can be sent to the server.
     */
    private convert(transformer: Transformer): Transformer {
        const copy: Transformer = Object.assign({}, transformer);
        return copy;
    }
}
