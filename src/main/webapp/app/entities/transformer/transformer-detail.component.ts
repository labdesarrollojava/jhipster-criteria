import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITransformer } from 'app/shared/model/transformer.model';

@Component({
  selector: 'jhi-transformer-detail',
  templateUrl: './transformer-detail.component.html'
})
export class TransformerDetailComponent implements OnInit {
  transformer: ITransformer;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ transformer }) => {
      this.transformer = transformer;
    });
  }

  previousState() {
    window.history.back();
  }
}
