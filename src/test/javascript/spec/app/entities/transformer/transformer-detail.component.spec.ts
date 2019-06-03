/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { TransformersTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { TransformerDetailComponent } from '../../../../../../main/webapp/app/entities/transformer/transformer-detail.component';
import { TransformerService } from '../../../../../../main/webapp/app/entities/transformer/transformer.service';
import { Transformer } from '../../../../../../main/webapp/app/entities/transformer/transformer.model';

describe('Component Tests', () => {

    describe('Transformer Management Detail Component', () => {
        let comp: TransformerDetailComponent;
        let fixture: ComponentFixture<TransformerDetailComponent>;
        let service: TransformerService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TransformersTestModule],
                declarations: [TransformerDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    TransformerService,
                    JhiEventManager
                ]
            }).overrideTemplate(TransformerDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TransformerDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TransformerService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Transformer(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.transformer).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
