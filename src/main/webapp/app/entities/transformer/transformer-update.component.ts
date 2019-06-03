import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ITransformer, Transformer } from 'app/shared/model/transformer.model';
import { TransformerService } from './transformer.service';

@Component({
  selector: 'jhi-transformer-update',
  templateUrl: './transformer-update.component.html'
})
export class TransformerUpdateComponent implements OnInit {
  transformer: ITransformer;
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(3)]],
    power: [null, [Validators.required, Validators.min(0)]]
  });

  constructor(protected transformerService: TransformerService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ transformer }) => {
      this.updateForm(transformer);
      this.transformer = transformer;
    });
  }

  updateForm(transformer: ITransformer) {
    this.editForm.patchValue({
      id: transformer.id,
      name: transformer.name,
      power: transformer.power
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const transformer = this.createFromForm();
    if (transformer.id !== undefined) {
      this.subscribeToSaveResponse(this.transformerService.update(transformer));
    } else {
      this.subscribeToSaveResponse(this.transformerService.create(transformer));
    }
  }

  private createFromForm(): ITransformer {
    const entity = {
      ...new Transformer(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      power: this.editForm.get(['power']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransformer>>) {
    result.subscribe((res: HttpResponse<ITransformer>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
