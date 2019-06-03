/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TransformersTestModule } from '../../../test.module';
import { TransformerDetailComponent } from 'app/entities/transformer/transformer-detail.component';
import { Transformer } from 'app/shared/model/transformer.model';

describe('Component Tests', () => {
  describe('Transformer Management Detail Component', () => {
    let comp: TransformerDetailComponent;
    let fixture: ComponentFixture<TransformerDetailComponent>;
    const route = ({ data: of({ transformer: new Transformer(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TransformersTestModule],
        declarations: [TransformerDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(TransformerDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TransformerDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.transformer).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
